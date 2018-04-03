/**
 * This is the core animation engine for this library.
 * Most of the code is taken from https://github.com/juliangarnier/anime
 *
 * Modifications -
 *
 * 1. Lifecycle hooks
 * 2. Animation speed is now configured via different instances and via params passed to the main instance rather
 *    than relying on the singleton instance.
 * 3. Minimal API
 * 4. Serialised values for performing **from** - **to** animations (implemented in utils/fromTo.js).
 * 5. New defaults for instance and tweens parameters.
 * 6. Lifecycle hooks can no longer be passed through parameters. They are available as instance methods
 *
 * Additions -
 *
 * 1. Style reads and writes are now batched so as to avoid layout calc. in each frame ✅
 * 2. Use 'will-change' prop to let the browser know that a new layer has to be created for a transform ✅
      (don't use 'will-change' for all the properties so as to avoid memory consumption)
 * 3. APIs for getting information about active instances in an animation using getAnimation()
 * 4. Declarative API for Timeline component for React
 * 5. Promise based API for oncancel event
 *
 */

import fastdom from 'fastdom'
import invariant from 'invariant'
import {
  isArray,
  isObject,
  isSVG,
  isDOM,
  isString,
  isFunc,
  isUnd,
  isHex,
  isPath,
  isRgb,
  isHsl,
  isCol,
  stringContains,
  stringToHyphens,
  selectString,
  filterArray,
  toArray,
  arrayContains,
  flattenArray,
  clone,
  mergeObjects,
  replaceObjectProps,
  rgbToRgba,
  hexToRgba,
  hslToRgba,
  colorToRgb,
  getRelativeValue,
  getUnit
} from '../utils/engineUtils'
import { easings } from './easing'
import { bezier } from './bezier'
import { getDefaultTweensParams, getDefaultInstanceParams } from '../utils/defaults'
import {
  getTransformUnit,
  getTransformValue,
  validTransforms
} from './transforms'
import {
  batchMutation,
  batchRead,
  exceptions,
  emptyScheduledJobs
} from './batchMutations'

let transformString

const minMaxValue = (val, min, max) => Math.min(Math.max(val, min), max)

const log = args => console.log(args)

// Check if the prop value is a function
const isFunctionValue = (val, prop) => {
  invariant(
    typeof val !== 'function',
    `Animation property value for '${prop}' cannot be a function.`
  )
  return val
}

// Get the CSS property value (opacity, backgroundColor, ..., etc)
export const getCSSValue = (el, prop) => {
  if (prop in el.style) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0'
  }
}

// Get the animation type (transform, css or attribute)
export const getAnimationType = (el, prop) => {
  // Check if the prop is a valid transform name
  if (isDOM(el) && arrayContains(validTransforms, prop)) return 'transform'
  // Check if its a valid attribute for a DOM node
  if (isDOM(el) && (el.getAttribute(prop) || (isSVG(el) && el[prop]))) return 'attribute'
  // Check if the prop returns a valid CSS transform value
  if (isDOM(el) && (prop !== 'transform' && getCSSValue(el, prop))) return 'css'
  // { value: '', duration: 2000 }
  if (el[prop] != null) return 'object'
}

// Get the animation value for the element
export const getOriginalTargetValue = (target, propName) => {
  switch (getAnimationType(target, propName)) {
    case 'transform':
      return getTransformValue(target, propName)
    case 'css':
      return getCSSValue(target, propName)
    case 'attribute':
      return target.getAttribute(propName)
  }

  return target[propName] || 0
}

// Validates and returns the value like 20px, 360deg, 0.4
export const validateValue = (val, unit) => {
  if (isCol(val)) {
    return colorToRgb(val)
  }

  const originalUnit = getUnit(val)
  const unitLess = originalUnit
    ? val.substr(0, val.length - originalUnit.length)
    : val
  return unit && !/\s/g.test(val) ? unitLess + unit : unitLess
}

// Creates an object of value 500px => { original: "500", numbers: [500], strings: ["", "px"] }
const decomposeValue = (val, unit) => {
  const rgx = /-?\d*\.?\d+/g
  const value = validateValue(isPath(val) ? val.totalLength : val, unit) + ''

  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: isString(val) || unit ? value.split(rgx) : []
  }
}

// Parse the elements and returns an array of elements
export const parseElements = elements => {
  const elementsArray = elements
    ? flattenArray(
        isArray(elements) ? elements.map(toArray) : toArray(elements)
      )
    : []

  return filterArray(
    elementsArray,
    (item, pos, self) => self.indexOf(item) === pos
  )
}

export const getAnimatables = elements => {
  const parsed = parseElements(elements)
  return parsed.map((t, i) => {
    return { target: t, id: i, total: parsed.length }
  })
}

// Normalize tweens and animation properties
const normalizePropertyTweens = (prop, tweenSettings) => {
  let settings = clone(tweenSettings)
  // from > to based prop values
  if (isArray(prop)) {
    const l = prop.length
    const isFromTo = l === 2 && !isObject(prop[0])
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!isFunc(tweenSettings.duration))
        settings.duration = tweenSettings.duration / l
    } else {
      // Transform [from, to] values shorthand to a valid tween value
      prop = { value: prop }
    }
  }

  return toArray(prop)
    .map((v, i) => {
      // Default delay value should be applied only on the first tween
      const delay = !i ? tweenSettings.delay : 0
      // Use path object as a tween value
      let obj = isObject(v) && !isPath(v) ? v : { value: v }
      // Set default delay value
      if (isUnd(obj.delay)) obj.delay = delay
      return obj
    })
    .map(k => mergeObjects(k, settings))
}

// Get the animation properties
const getProperties = (instanceSettings, tweenSettings, params) => {
  // store animation properties
  let properties = []
  // Merge instance params and tween params
  const settings = mergeObjects(instanceSettings, tweenSettings)
  for (let p in params) {
    if (!settings.hasOwnProperty(p) && p !== 'elements') {
      properties.push({
        name: p,
        offset: settings['offset'],
        tweens: normalizePropertyTweens(params[p], tweenSettings)
      })
    }
  }
  return properties
}

// Normalize tween values
const normalizeTweenValues = (tween, animatable) => {
  let t = {}
  for (let p in tween) {
    let value = isFunctionValue(tween[p], p)
    // from > to based ?
    if (isArray(value)) {
      value = value.map(v => isFunctionValue(v, p))
      if (value.length === 1) value = value[0]
    }
    t[p] = value
  }
  t.duration = parseFloat(t.duration)
  t.delay = parseFloat(t.delay)
  return t
}

// If we have an array of control points, then create a custom bezier curve or return the easing name using the val
const normalizeEasing = val => {
  return isArray(val) ? bezier.apply(this, val) : easings[val]
}

// Create a normalise data structure of tween properties
const normalizeTweens = (prop, animatable) => {
  let previousTween

  return prop.tweens.map(t => {
    let tween = normalizeTweenValues(t, animatable)
    // This may be transform value like 360deg or from to based animation values like [1, 2]
    const tweenValue = tween.value
    const originalValue = getOriginalTargetValue(animatable.target, prop.name)
    const previousValue = previousTween
      ? previousTween.to.original
      : originalValue
    const from = isArray(tweenValue) ? tweenValue[0] : previousValue
    const to = getRelativeValue(
      isArray(tweenValue) ? tweenValue[1] : tweenValue,
      from
    )
    const unit = getUnit(to) || getUnit(from) || getUnit(originalValue)
    tween.from = decomposeValue(from, unit)
    tween.to = decomposeValue(to, unit)
    tween.start = previousTween ? previousTween.end : prop.offset
    tween.end = tween.start + tween.delay + tween.duration
    tween.easing = normalizeEasing(tween.easing)
    tween.elasticity = (1000 - minMaxValue(tween.elasticity, 1, 999)) / 1000
    tween.isPath = isPath(tweenValue)
    tween.isColor = isCol(tween.from.original)
    if (tween.isColor) tween.round = 1
    previousTween = tween
    return tween
  })
}

// Apply the animation properties throughout the tween progress
const setTweenProgress = {
  css: (t, p, v) => {
    if (p === 'opacity' && t.style['will-change'] !== 'opacity') {
      // TODO: At this point, we may override the 'will-change' property which was set to 'transform' earlier. Change this!
      // Though, this isn't a concern for memory consumption as it just overrides the content

      t.style['will-change'] = 'opacity'

      // Batch style updates
      return batchMutation(() => (t.style[p] = v), p, v)
    }

    // Hint already given to the browser, so batch the mutation
    return batchMutation(() => (t.style[p] = v), p, v)
  },
  attribute: (t, p, v) => batchMutation(() => t.setAttribute(p, v), p, v),
  object: (t, p, v) => (t[p] = v),
  transform: (t, p, v, transforms, id) => {
    if (!transforms[id]) transforms[id] = []
    transforms[id].push(`${p}(${v})`)
  }
}

// Create an object of animation properties for an element with animation type
function createAnimation(animatable, prop) {
  const animType = getAnimationType(animatable.target, prop.name)
  if (animType) {
    const tweens = normalizeTweens(prop, animatable)
    return {
      type: animType,
      property: prop.name,
      animatable: animatable,
      tweens: tweens,
      duration: tweens[tweens.length - 1].end,
      delay: tweens[0].delay
    }
  }
}

// Create animation object using array of properties
function getAnimations(animatables, properties) {
  return filterArray(
    flattenArray(
      animatables.map(animatable => {
        return properties.map(prop => {
          return createAnimation(animatable, prop)
        })
      })
    ),
    a => !isUnd(a)
  )
}

// Get the animation offset from the animation instance
function getInstanceoffsets(type, animations, instanceSettings, tweenSettings) {
  const isDelay = type === 'delay'
  if (animations.length) {
    return (isDelay ? Math.min : Math.max).apply(
      Math,
      animations.map(anim => anim[type])
    )
  } else {
    return isDelay
      ? tweenSettings.delay
      : instanceSettings.offset + tweenSettings.delay + tweenSettings.duration
  }
}

const hasLifecycleHook = params => {
  const hooks = ['onStart', 'onUpdate', 'tick', 'onComplete']

  const errorMsg =
    "Use 'createLifecycleComponent()' method to create and use animation lifecyle. Lifecycle hooks are instance methods and are not animatable properties."

  hooks.forEach(hook => {
    if (params.hasOwnProperty(hook)) {
      delete params[hook]

      throw new Error(errorMsg)
    }
  })
}

// Create a new animation object which contains data about the element which will be animated and its animation properties, also the instance properties and tween properties.
function createNewInstance(params) {
  // Lifecycle hook should not be an animation property
  hasLifecycleHook(params)

  const instanceSettings = replaceObjectProps(
    getDefaultInstanceParams(),
    params
  )
  const tweenSettings = replaceObjectProps(getDefaultTweensParams(), params)

  const animatables = getAnimatables(params.elements)

  const properties = getProperties(instanceSettings, tweenSettings, params)
  const animations = getAnimations(animatables, properties)
  return mergeObjects(instanceSettings, {
    children: [],
    animatables: animatables,
    animations: animations,
    duration: getInstanceoffsets(
      'duration',
      animations,
      instanceSettings,
      tweenSettings
    ),
    delay: getInstanceoffsets(
      'delay',
      animations,
      instanceSettings,
      tweenSettings
    )
  })
}

// Active animation instances
let activeInstances = []
let raf = 0

const engine = (() => {
  function start() {
    raf = requestAnimationFrame(step)
  }
  function step(t) {
    const activeLength = activeInstances.length
    if (activeLength) {
      let i = 0
      while (i < activeLength) {
        // Call frame loop for all active instances
        if (activeInstances[i]) {
          activeInstances[i].frameLoop(t)
        }
        i++
      }
      start()
    } else {
      cancelAnimationFrame(raf)
      raf = 0
    }
  }
  return start
})()

function animated(params = {}) {
  let now,
    startTime,
    lastTime = 0

  let instance = createNewInstance(params)

  let res = null

  function createPromise() {
    return window.Promise && new Promise(resolve => (res = resolve))
  }

  let promise = createPromise()

  function toggleInstanceDirection() {
    instance.reversed = !instance.reversed
  }

  // If the direction is reverse, then make the playback rate negative (don't expose this as an imperative workaround to the user)
  function adjustTime(time) {
    return instance.reversed ? instance.duration - time : time
  }

  function syncInstanceChildren(time) {
    const children = instance.children
    const childrenLength = children.length
    if (time >= instance.currentTime) {
      for (let i = 0; i < childrenLength; i++) children[i].seek(time)
    } else {
      for (let i = childrenLength; i--; ) children[i].seek(time)
    }
  }

  // Batch style mutations
  function batchStyleUpdates(instance, id, transforms, transformString) {
    let element = instance.animatables[id].target

    if (element.style['will-change'] === 'opacity') {
      element.style['will-change'] = element.style['will-change'].concat(
        ', transform'
      )
    } else if (
      element.style['will-change'] === 'opacity, transform' ||
      element.style['will-change'] === 'transform'
    ) {
    } else {
      element.style['will-change'] = 'transform'
    }

    // Batch updates
    if (transforms[id]) {
      return batchMutation(
        () => (element.style[transformString] = transforms[id].join(' ')),
        transformString,
        transforms[id].join(' ')
      )
    }
  }

  function setAnimationsProgress(insTime) {
    let i = 0
    let transforms = {}
    const animations = instance.animations
    const animationsLength = animations.length
    while (i < animationsLength) {
      const anim = animations[i]
      const animatable = anim.animatable
      const tweens = anim.tweens
      const tweenLength = tweens.length - 1
      let tween = tweens[tweenLength]
      // Only check for keyframes if there is more than one tween
      if (tweenLength)
        tween = filterArray(tweens, t => insTime < t.end)[0] || tween
      const elapsed =
        minMaxValue(insTime - tween.start - tween.delay, 0, tween.duration) /
        tween.duration
      const eased = isNaN(elapsed) ? 1 : tween.easing(elapsed, tween.elasticity)
      const strings = tween.to.strings
      const round = tween.round
      let numbers = []
      let progress
      const toNumbersLength = tween.to.numbers.length
      for (let n = 0; n < toNumbersLength; n++) {
        let value
        const toNumber = tween.to.numbers[n]
        const fromNumber = tween.from.numbers[n]
        if (!tween.isPath) {
          value = fromNumber + eased * (toNumber - fromNumber)
        }

        if (round) {
          if (!(tween.isColor && n > 2)) {
            value = Math.round(value * round) / round
          }
        }
        numbers.push(value)
      }
      // Manual Array.reduce for better performances
      const stringsLength = strings.length
      if (!stringsLength) {
        progress = numbers[0]
      } else {
        progress = strings[0]
        for (let s = 0; s < stringsLength; s++) {
          const a = strings[s]
          const b = strings[s + 1]
          const n = numbers[s]
          if (!isNaN(n)) {
            if (!b) {
              progress += n + ' '
            } else {
              progress += n + b
            }
          }
        }
      }

      setTweenProgress[anim.type](
        animatable.target,
        anim.property,
        progress,
        transforms,
        animatable.id
      )
      anim.currentValue = progress
      i++
    }

    const transformsLength = Object.keys(transforms).length
    if (transformsLength) {
      for (let id = 0; id < transformsLength; id++) {
        if (!transformString) {
          const t = 'transform'
          transformString = batchRead(
            () => getCSSValue(document.body, t),
            'transform'
          )
            ? t
            : `-webkit-${t}`
        }

        batchStyleUpdates(instance, id, transforms, transformString)
      }
    }
    instance.currentTime = insTime
    instance.progress = insTime / instance.duration * 100
  }

  function registerLifecycleHook(cb) {
    // Prepare props for a lifecyle hook
    const {
      completed,
      progress,
      duration,
      remaining,
      reversed,
      currentTime,
      began,
      paused,
      start,
      stop,
      restart,
      reverse,
      reset
    } = instance

    // Methods to control execution of an animation
    const controller = {
      start,
      stop,
      restart,
      reverse,
      reset
    }

    // Props received by a lifecyle hook
    const finalProps = {
      completed,
      progress,
      duration,
      remaining,
      reversed,
      currentTime,
      began,
      paused,
      controller
    }

    if (instance[cb]) instance[cb](finalProps)
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--
    }
  }

  // Set the animation instance progress using the engine time
  // BUG: synchronise the engine time with speed coefficient
  function setInstanceProgress(engineTime) {
    const insDuration = instance.duration
    const insoffset = instance.offset
    const insStart = insoffset + instance.delay
    const insCurrentTime = instance.currentTime
    const insReversed = instance.reversed
    const insTime = adjustTime(engineTime)
    if (instance.children.length) syncInstanceChildren(insTime)
    if (insTime >= insStart || !insDuration) {
      if (!instance.began) {
        instance.began = true
        registerLifecycleHook('onStart')
      }
    }
    if (insTime > insoffset && insTime < insDuration) {
      // Update the style and apply the transforms here
      setAnimationsProgress(insTime)
    } else {
      if (insTime <= insoffset && insCurrentTime !== 0) {
        // Animation completed!
        setAnimationsProgress(0)
        if (insReversed) countIteration()
      }
      if (
        (insTime >= insDuration && insCurrentTime !== insDuration) ||
        !insDuration
      ) {
        // Run the animation for a value defind for duration property
        setAnimationsProgress(insDuration)
        if (!insReversed) countIteration()
      }
    }

    registerLifecycleHook('onUpdate')

    if (process.env.NODE_ENV !== 'production') {
      // Catch errors occurred due to a scheduled job.
      exceptions()
    }

    if (engineTime >= insDuration) {
      // remaining not equals to 1 ?
      if (instance.remaining) {
        startTime = now
        // Change the direction
        if (instance.direction === 'alternate') toggleInstanceDirection()
      } else {
        // Loops done! So animation can be stopped.
        instance.stop()
        // Mark the flag completed
        if (!instance.completed) {
          instance.completed = true

          // Animations are done so remove the hint ('will-change')
          removeHints(instance.animatables)

          // Clear any scheduled job
          emptyScheduledJobs()

          registerLifecycleHook('onComplete')

          if ('Promise' in window) {
            // Resolve the promise
            res({ msg: 'Animation completed!' })

            promise = createPromise()
          }
        }
      }
      lastTime = 0
    }
  }

  instance.reset = function() {
    const direction = instance.direction
    const loops = instance.iterations
    // console.log(loops);
    instance.currentTime = 0
    instance.progress = 0
    instance.paused = true
    instance.began = false
    instance.completed = false
    instance.reversed = direction === 'reverse'
    instance.remaining = direction === 'alternate' && loops === 1 ? 2 : loops
    setAnimationsProgress(0)
    // Also reset the child nodes
    for (let i = instance.children.length; i--; ) {
      instance.children[i].reset()
    }
  }

  instance.frameLoop = function(t) {
    let speedInParams = false

    now = t
    if (!startTime) startTime = now

    if (params.speed) {
      speedInParams = true
    }

    const speedCoefficient = () =>
      speedInParams ? params.speed : instance.speed ? instance.speed : 1

    const engineTime = (lastTime + now - startTime) * speedCoefficient()
    setInstanceProgress(engineTime)
  }

  instance.seek = function(time) {
    setInstanceProgress(adjustTime(time))
  }

  instance.stop = function() {
    const i = activeInstances.indexOf(instance)
    if (i > -1) activeInstances.splice(i, 1)

    instance.paused = true
  }

  instance.start = function() {
    // Already running
    if (!instance.paused) return
    instance.paused = false
    startTime = 0
    lastTime = adjustTime(instance.currentTime)
    // Push the instances which will be animated
    activeInstances.push(instance)
    if (!raf) engine()
  }

  instance.reverse = function() {
    toggleInstanceDirection()
    startTime = 0
    lastTime = adjustTime(instance.currentTime)
  }

  instance.restart = function() {
    instance.stop()
    instance.reset()
    instance.start()
  }

  // Mutate the active instances through this method
  instance.getAnimations = () => {
    if (activeInstances.length !== 0) {
      return activeInstances
    }

    return []
  }

  // Promise based APIs

  instance.onfinish = promise

  function removeNodes(a, elements, animations, res) {
    if (arrayContains(elements, animations[a].animatable.target)) {
      const node = animations[a].animatable.target
      animations.splice(a, 1)
      if (!animations.length) {
        instance.paused = true
        if ('Promise' in window) {
          res({ node: node, msg: 'Removed node from the timeline' })
        }
      }
    }
  }

  instance.oncancel = elements => {
    // Promise status
    let res = null

    function createPromise() {
      return window.Promise && new Promise(resolved => (res = resolved))
    }

    let prom = createPromise()

    const elementsArray = parseElements(elements)

    for (let i = activeInstances.length; i--; ) {
      const instance = activeInstances[i]
      if (instance.animations.length === 0 && instance.children.length !== 0) {
        for (let j = instance.children.length; j--; ) {
          const animations = instance.children[j].animations

          for (let a = animations.length; a--; ) {
            removeNodes(a, elementsArray, animations, res)
          }
        }
      } else {
        const animations = instance.animations
        for (let a = animations.length; a--; ) {
          removeNodes(a, elementsArray, animations, res)
        }
      }
    }

    return prom
  }

  instance.reset()

  if (instance.autoplay) instance.start()

  return instance
}

const removeHints = instances => {
  instances.forEach(instance => {
    instance.target.style['will-change'] = ''
  })
}

function createTimeline(params) {
  let tl = animated(params)
  tl.stop()
  tl.duration = 0
  tl.value = function(instancesParams) {
    tl.children.forEach(i => {
      i.began = true
      i.completed = true
    })
    toArray(instancesParams).forEach(instanceParams => {
      let insParams = mergeObjects(
        instanceParams,
        replaceObjectProps(getDefaultTweensParams(), params || {})
      )
      insParams.elements = insParams.elements || params.elements
      const tlDuration = tl.duration
      const insoffset = insParams.offset
      insParams.autoplay = false
      insParams.direction = tl.direction
      insParams.offset = isUnd(insoffset)
        ? tlDuration
        : getRelativeValue(insoffset, tlDuration)
      tl.began = true
      tl.completed = true
      tl.seek(insParams.offset)
      // Start animating the next children node
      const ins = animated(insParams)
      ins.began = true
      ins.completed = true
      if (ins.duration > tlDuration) tl.duration = ins.duration
      tl.children.push(ins)
    })
    tl.seek(0)
    tl.reset()
    if (tl.autoplay) tl.restart()
    return tl
  }
  return tl
}

const getTransforms = () => validTransforms

export { animated, createTimeline, getTransforms }
