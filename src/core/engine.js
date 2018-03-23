/**
 * This is the core animation engine for this library.
 * Most of the code is copied from https://github.com/juliangarnier/anime but there are **some** differences:
 *
 * 1. Lifecycle hooks are refactored and parameters received are modified.
 * 2. Animation speed is now configured via different instances rather than relying on the singleton instance.
 * 3. Removed unused properties (`version`, `remove`, `setDashoffset`).
 * 4. Serialised values for performing **from** - **to** animations (implemented in utils/fromTo.js).
 * 5. Dropped support for motion path, drawing lines and SVG path
 * 6. Disable autoplay since we rely on control time-based execution methods
 *
 * Julian Garnier 👏👏
 */

 import {
   is,
   stringContains,
   stringToHyphens,
   selectString,
   filterArray,
   toArray,
   arrayContains,
   flattenArray,
   cloneObject,
   mergeObjects,
   replaceObjectProps,
   rgbToRgba,
   hexToRgba,
   hslToRgba,
   colorToRgb
 } from './utils'
import { easings } from './easing'

const defaultInstanceSettings = {
  onUpdate: undefined,
  onStart: undefined,
  callFrame: undefined,
  onComplete: undefined,
  loop: 1,
  direction: 'normal',
  autoplay: false,
  offset: 0,
}

const defaultTweenSettings = {
  duration: 1000,
  delay: 0,
  easing: 'easeOutElastic',
  elasticity: 500,
  round: 0,
}

const validTransforms = [
  'translateX',
  'translateY',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'skewX',
  'skewY',
  'perspective',
]

let transformString

// Units

const getUnit = val => {
  const split = /([\+\-]?[0-9#\.]+)(%|px|pt|em|rem|in|cm|mm|ex|ch|pc|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
    val
  )
  if (split) return split[2]
}

const getTransformUnit = propName => {
  if (stringContains(propName, 'translate') || propName === 'perspective')
    return 'px'
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew'))
    return 'deg'
}

const minMaxValue = (val, min, max) => {
  return Math.min(Math.max(val, min), max)
}

const getFunctionValue = (val, animatable) => {
  if (!is.fnc(val)) return val
  return val(animatable.target, animatable.id, animatable.total)
}

const getCSSValue = (el, prop) => {
  if (prop in el.style) {
    return getComputedStyle(el).getPropertyValue(stringToHyphens(prop)) || '0'
  }
}

const getAnimationType = (el, prop) => {
  if (is.dom(el) && arrayContains(validTransforms, prop)) return 'transform'
  if (is.dom(el) && (el.getAttribute(prop) || (is.svg(el) && el[prop])))
    return 'attribute'
  if (is.dom(el) && (prop !== 'transform' && getCSSValue(el, prop)))
    return 'css'
  if (el[prop] != null) return 'object'
}

const getTransformValue = (el, propName) => {
  const defaultUnit = getTransformUnit(propName)
  const defaultVal = stringContains(propName, 'scale') ? 1 : 0 + defaultUnit
  const str = el.style.transform
  if (!str) return defaultVal
  let match = []
  let props = []
  let values = []
  const rgx = /(\w+)\((.+?)\)/g
  while ((match = rgx.exec(str))) {
    props.push(match[1])
    values.push(match[2])
  }
  const value = filterArray(values, (val, i) => props[i] === propName)
  return value.length ? value[0] : defaultVal
}

const getOriginalTargetValue = (target, propName) => {
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

const getRelativeValue = (to, from) => {
  const operator = /^(\*=|\+=|-=)/.exec(to)
  if (!operator) return to
  const u = getUnit(to) || 0
  const x = parseFloat(from)
  const y = parseFloat(to.replace(operator[0], ''))
  switch (operator[0][0]) {
    case '+':
      return x + y + u
    case '-':
      return x - y + u
    case '*':
      return x * y + u
  }
}

const validateValue = (val, unit) => {
  if (is.col(val)) {
    return colorToRgb(val)
  }

  const originalUnit = getUnit(val)
  const unitLess = originalUnit
    ? val.substr(0, val.length - originalUnit.length)
    : val
  return unit && !/\s/g.test(val) ? unitLess + unit : unitLess
}

// getTotalLength() equivalent for circle, rect, polyline, polygon and line shapes.
// adapted from https://gist.github.com/SebLambla/3e0550c496c236709744

const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2))
}

const getCircleLength = el => {
  return 2 * Math.PI * el.getAttribute('r')
}

const getRectLength = el => {
  return el.getAttribute('width') * 2 + el.getAttribute('height') * 2
}

const getLineLength = el => {
  return getDistance(
    { x: el.getAttribute('x1'), y: el.getAttribute('y1') },
    { x: el.getAttribute('x2'), y: el.getAttribute('y2') }
  )
}

const getPolylineLength = el => {
  const points = el.points
  let totalLength = 0
  let previousPos
  for (let i = 0; i < points.numberOfItems; i++) {
    const currentPos = points.getItem(i)
    if (i > 0) totalLength += getDistance(previousPos, currentPos)
    previousPos = currentPos
  }
  return totalLength
}

const getPolygonLength = el => {
  const points = el.points
  return (
    getPolylineLength(el) +
    getDistance(points.getItem(points.numberOfItems - 1), points.getItem(0))
  )
}

// Path animation

const getTotalLength = el => {
  if (el.getTotalLength) return el.getTotalLength()
  switch (el.tagName.toLowerCase()) {
    case 'circle':
      return getCircleLength(el)
    case 'rect':
      return getRectLength(el)
    case 'line':
      return getLineLength(el)
    case 'polyline':
      return getPolylineLength(el)
    case 'polygon':
      return getPolygonLength(el)
  }
}

const decomposeValue = (val, unit) => {
  const rgx = /-?\d*\.?\d+/g
  const value = validateValue(is.pth(val) ? val.totalLength : val, unit) + ''
  return {
    original: value,
    numbers: value.match(rgx) ? value.match(rgx).map(Number) : [0],
    strings: is.str(val) || unit ? value.split(rgx) : [],
  }
}

const parseElements = elements => {
  const elementsArray = elements
    ? flattenArray(is.arr(elements) ? elements.map(toArray) : toArray(elements))
    : []
  return filterArray(
    elementsArray,
    (item, pos, self) => self.indexOf(item) === pos
  )
}

const getAnimatables = elements => {
  const parsed = parseElements(elements)
  return parsed.map((t, i) => {
    return { target: t, id: i, total: parsed.length }
  })
}

const normalizePropertyTweens = (prop, tweenSettings) => {
  let settings = cloneObject(tweenSettings)
  if (is.arr(prop)) {
    const l = prop.length
    const isFromTo = l === 2 && !is.obj(prop[0])
    if (!isFromTo) {
      // Duration divided by the number of tweens
      if (!is.fnc(tweenSettings.duration))
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
      let obj = is.obj(v) && !is.pth(v) ? v : { value: v }
      // Set default delay value
      if (is.und(obj.delay)) obj.delay = delay
      return obj
    })
    .map(k => mergeObjects(k, settings))
}

const getProperties = (instanceSettings, tweenSettings, params) => {
  let properties = []
  const settings = mergeObjects(instanceSettings, tweenSettings)
  for (let p in params) {
    if (!settings.hasOwnProperty(p) && p !== 'elements') {
      properties.push({
        name: p,
        offset: settings['offset'],
        tweens: normalizePropertyTweens(params[p], tweenSettings),
      })
    }
  }
  return properties
}

const normalizeTweenValues = (tween, animatable) => {
  let t = {}
  for (let p in tween) {
    let value = getFunctionValue(tween[p], animatable)
    if (is.arr(value)) {
      value = value.map(v => getFunctionValue(v, animatable))
      if (value.length === 1) value = value[0]
    }
    t[p] = value
  }
  t.duration = parseFloat(t.duration)
  t.delay = parseFloat(t.delay)
  return t
}

const normalizeEasing = val => {
  return is.arr(val) ? bezier.apply(this, val) : easings[val]
}

const normalizeTweens = (prop, animatable) => {
  let previousTween
  return prop.tweens.map(t => {
    let tween = normalizeTweenValues(t, animatable)
    const tweenValue = tween.value
    const originalValue = getOriginalTargetValue(animatable.target, prop.name)
    const previousValue = previousTween
      ? previousTween.to.original
      : originalValue
    const from = is.arr(tweenValue) ? tweenValue[0] : previousValue
    const to = getRelativeValue(
      is.arr(tweenValue) ? tweenValue[1] : tweenValue,
      from
    )
    const unit = getUnit(to) || getUnit(from) || getUnit(originalValue)
    tween.from = decomposeValue(from, unit)
    tween.to = decomposeValue(to, unit)
    tween.start = previousTween ? previousTween.end : prop.offset
    tween.end = tween.start + tween.delay + tween.duration
    tween.easing = normalizeEasing(tween.easing)
    tween.elasticity = (1000 - minMaxValue(tween.elasticity, 1, 999)) / 1000
    tween.isPath = is.pth(tweenValue)
    tween.isColor = is.col(tween.from.original)
    if (tween.isColor) tween.round = 1
    previousTween = tween
    return tween
  })
}

const setTweenProgress = {
  css: (t, p, v) => (t.style[p] = v),
  attribute: (t, p, v) => t.setAttribute(p, v),
  object: (t, p, v) => (t[p] = v),
  transform: (t, p, v, transforms, id) => {
    if (!transforms[id]) transforms[id] = []
    transforms[id].push(`${p}(${v})`)
  },
}

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
      delay: tweens[0].delay,
    }
  }
}

function getAnimations(animatables, properties) {
  return filterArray(
    flattenArray(
      animatables.map(animatable => {
        return properties.map(prop => {
          return createAnimation(animatable, prop)
        })
      })
    ),
    a => !is.und(a)
  )
}

function getInstanceTimings(type, animations, instanceSettings, tweenSettings) {
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

function createNewInstance(params) {
  const instanceSettings = replaceObjectProps(defaultInstanceSettings, params)
  const tweenSettings = replaceObjectProps(defaultTweenSettings, params)
  const animatables = getAnimatables(params.elements)
  const properties = getProperties(instanceSettings, tweenSettings, params)
  const animations = getAnimations(animatables, properties)
  return mergeObjects(instanceSettings, {
    children: [],
    animatables: animatables,
    animations: animations,
    duration: getInstanceTimings(
      'duration',
      animations,
      instanceSettings,
      tweenSettings
    ),
    delay: getInstanceTimings(
      'delay',
      animations,
      instanceSettings,
      tweenSettings
    ),
  })
}

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
        if (activeInstances[i]) activeInstances[i].frameLoop(t)
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

  let resolve = null

  let instance = createNewInstance(params)

  function toggleInstanceDirection() {
    instance.reversed = !instance.reversed
  }

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
        } else {
          value = getPathProgress(tween.value, eased * toNumber)
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
          transformString = getCSSValue(document.body, t) ? t : `-webkit-${t}`
        }
        instance.animatables[id].target.style[transformString] = transforms[
          id
        ].join(' ')
      }
    }
    instance.currentTime = insTime
    instance.progress = insTime / instance.duration * 100
  }

  function setCallback(cb) {
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
      reset,
    } = instance

    const controller = {
      start,
      stop,
      restart,
      reverse,
      reset,
    }

    const finalProps = {
      completed,
      progress,
      duration,
      remaining,
      reversed,
      currentTime,
      began,
      paused,
      controller,
    }

    if (instance[cb]) instance[cb](finalProps)
  }

  function countIteration() {
    if (instance.remaining && instance.remaining !== true) {
      instance.remaining--
    }
  }

  function setInstanceProgress(engineTime) {
    const insDuration = instance.duration
    const insOffset = instance.offset
    const insStart = insOffset + instance.delay
    const insCurrentTime = instance.currentTime
    const insReversed = instance.reversed
    const insTime = adjustTime(engineTime)
    if (instance.children.length) syncInstanceChildren(insTime)
    if (insTime >= insStart || !insDuration) {
      if (!instance.began) {
        instance.began = true
        setCallback('onStart')
      }
      setCallback('callFrame')
    }
    if (insTime > insOffset && insTime < insDuration) {
      setAnimationsProgress(insTime)
    } else {
      if (insTime <= insOffset && insCurrentTime !== 0) {
        setAnimationsProgress(0)
        if (insReversed) countIteration()
      }
      if (
        (insTime >= insDuration && insCurrentTime !== insDuration) ||
        !insDuration
      ) {
        setAnimationsProgress(insDuration)
        if (!insReversed) countIteration()
      }
    }
    setCallback('onUpdate')
    if (engineTime >= insDuration) {
      if (instance.remaining) {
        startTime = now
        if (instance.direction === 'alternate') toggleInstanceDirection()
      } else {
        instance.stop()
        if (!instance.completed) {
          instance.completed = true
          setCallback('onComplete')
        }
      }
      lastTime = 0
    }
  }

  instance.reset = function() {
    const direction = instance.direction
    const loops = instance.loop
    instance.currentTime = 0
    instance.progress = 0
    instance.paused = true
    instance.began = false
    instance.completed = false
    instance.reversed = direction === 'reverse'
    instance.remaining = direction === 'alternate' && loops === 1 ? 2 : loops
    setAnimationsProgress(0)
    for (let i = instance.children.length; i--; ) {
      instance.children[i].reset()
    }
  }

  instance.frameLoop = function(t) {
    now = t
    if (!startTime) startTime = now
    const engineTime = (lastTime + now - startTime) * instance.speed || 1
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
    if (!instance.paused) return
    instance.paused = false
    startTime = 0
    lastTime = adjustTime(instance.currentTime)
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

  instance.reset()

  if (instance.autoplay) instance.start()

  return instance
}

// Timeline

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
        replaceObjectProps(defaultTweenSettings, params || {})
      )
      insParams.elements = insParams.elements || params.elements
      const tlDuration = tl.duration
      const insOffset = insParams.offset
      insParams.autoplay = false
      insParams.direction = tl.direction
      insParams.offset = is.und(insOffset)
        ? tlDuration
        : getRelativeValue(insOffset, tlDuration)
      tl.began = true
      tl.completed = true
      tl.seek(insParams.offset)
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

const getRandomNum = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min

// Main instance fields should not be mutated
Object.freeze(animated)

export {
  animated,
  getOriginalTargetValue as getValue,
  createTimeline,
  getRandomNum as random,
}
