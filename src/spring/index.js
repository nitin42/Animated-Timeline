/**
 * Animations using spring physics!
 *
 * Core:
 *
 * 1. Animate single and multiple elements (supports chaining)
 * 2. Interpolations
 * 3. Provides callbacks which get invoked during different phases of an animation
 *
 * Control methods:
 *
 * 1. startAt(value) - Start the animation from a value
 * 2. stop() - Stop the animation
 * 3. reset() - Reset the animation
 * 4. reverse() - Reverse the animation
 * 5. setValueVelocity({ value, velocity }) - Start the animation with a value and velocity
 * 6. setValue(value) - Set a new value and start the animation
 * 7. start() - Resume the animation from the last value
 * 8. seek(value) - Change the animation position with an input value
 * 9. oncancel - Promise API for cancelling a running animation
 * 10. infinite(startValue, endValue, duration) - Infinite iterations of an animation
 *
 */

import _R from 'rebound'
import invariant from 'invariant'

import { getAnimationType } from '../core/engine'
import { noop } from '../utils/noop'
import { batchMutation } from '../core/batchMutations'

const rAF = window.requestAnimationFrame

const isColorProperty = property =>
  property.includes('Color') || property.includes('color')

const isSkewOrRotate = property =>
  property.includes('rotate') || property.includes('skew')

const shouldInvokeCallback = (callback, params) => {
  if (callback && typeof callback === 'function') callback(params)
  else if (callback && typeof callback !== 'function')
    console.error(
      `Expected callback to be a function but instead got a ${typeof callback}.`
    )
}

const validateValue = (property, value) => {
  // Color properties are validated and converted to RGB by `interpolateColor` option
  if (isColorProperty(property)) return value
  else if (isSkewOrRotate(property))
    // TODO: Add conversion for degrees to radians and vice-versa
    return String(value).concat('deg')
  else return String(value).concat('px')
}

const applyInitialProps = (element, { property, value, type }) => {
  const newValue = validateValue(property, value)

  if (type === 'transform') {
    batchMutation(() => (element.style.transform = `${property}(${newValue})`))
  } else if (type === 'css') {
    batchMutation(() => (element.style[property] = newValue))
  }
}

const getCallbackProps = instance => ({
  currentValue: instance.getCurrentValue(),
  endValue: instance.getEndValue(),
  velocity: instance.getVelocity(),
  springAtRest: instance.isAtRest()
})

export function Spring({ friction = 10, tension = 5 }) {
  invariant(
    typeof friction === 'number',
    `Expected 'friction' value to be a number but instead got a ${typeof friction}`
  )

  invariant(
    typeof tension === 'number',
    `Expected 'tension' value to be a number but instead got a ${typeof tension}`
  )

  const spring = new _R.SpringSystem().createSpring(friction, tension)

  const mapValues = _R.MathUtil.mapValueInRange

  const interpolateColor = _R.util.interpolateColor

  let id = null

  spring.animate = ({
    element,
    property,
    options = {
      mapValues: { from: [0, 1], to: [1, 1.5] },
      interpolateColor: { colors: ['#183a72', '#85c497'], range: [] }
    },
    interpolate = noop
  }) => {
    invariant(
      !Array.isArray(element) ||
        typeof element === 'string' ||
        typeof element === 'object',
      'Can only pass a selector (id or class) or a reference to the element'
    )

    invariant(
      typeof property === 'string',
      `Expected property to be a string but instead got a ${typeof property}.`
    )

    invariant(
      typeof interpolate === 'function',
      `Expected interpolate to be a function but instead got a ${typeof interpolate}.`
    )

    // Reference to the element which will be animated
    let el = null

    // Property type (css or transform)
    let type = null

    if (typeof element === 'object') {
      // must be a 'ref'
      el = element
    } else if (typeof element === 'string') {
      // id or classname
      el = document.querySelector(element)
    }

    if (getAnimationType(el, property) === 'transform') {
      type = 'transform'
    } else if (getAnimationType(el, property) === 'css') {
      type = 'css'
    }

    // Set the initial state of the animation property of the element we want to animate
    applyInitialProps(el, {
      property,
      value: isColorProperty(property)
        ? options.interpolateColor.colors[0]
        : options.mapValues.to[0],
      type
    })

    spring.addListener({
      onSpringActivate: spr =>
        shouldInvokeCallback(spring.onStart, getCallbackProps(spr)),
      onSpringAtRest: spr =>
        shouldInvokeCallback(spring.onRest, getCallbackProps(spr)),
      onSpringUpdate: spr => {
        let val = spr.getCurrentValue()

        if (!isColorProperty(property)) {
          const { from, to } = options.mapValues

          // Map the value for the animation property
          val = mapValues(val, from[0], from[1], to[0], to[1])
        } else if (isColorProperty(property)) {
          const { colors, range } = options.interpolateColor

          // Interpolate hex values with an input range
          if (range && (Array.isArray(range) && range.length === 2)) {
            val = interpolateColor(
              val,
              colors[0],
              colors[1],
              range[0],
              range[1]
            )
          } else {
            // Ignore the input range
            val = interpolateColor(val, colors[0], colors[1])
          }
        }

        if (isSkewOrRotate(property)) {
          val = String(val).concat('deg')
        } else if (property.includes('translate'))
          val = String(val).concat('px')

        id = rAF(() => {
          interpolate(
            el.style,
            String(val).replace('deg', '') || String(val).replace('px', ''),
            {
              mapValues: _R.MathUtil.mapValueInRange,
              interpolateColor: _R.util.interpolateColor
            }
          )

          if (type === 'transform') {
            if (!el.style['transform'].includes(property)) {
              el.style['transform'] = el.style['transform'].concat(
                `${property}(${val})`
              )
            } else {
              el.style['transform'] = `${property}(${val})`
            }
          } else if (type === 'css') {
            el.style[property] = `${val}`
          }
        })
      }
    })

    // Support chaining
    return spring
  }

  // Set a new value
  spring.setValue = spring.setEndValue

  // Start the animation with value and velocity
  spring.setValueVelocity = ({ value, velocity }) => {
    spring.setValue(value)
    spring.setVelocity(velocity)
  }

  // Start the animation with a value
  spring.startAt = val => spring.setValue(val)

  // Stop the animation
  spring.stop = () => spring.setCurrentValue(spring.getCurrentValue())

  // Reset the animation
  spring.reset = () => spring.setCurrentValue(-1)

  // Reverse the animation
  spring.reverse = () => spring.setValue(-spring.getCurrentValue())

  // Change the position of an element along with its motion
  spring.seek = val => spring.setValue(val)

  // Start the animation
  spring.start = () =>
    spring.setValue(spring.getEndValue() - spring.getCurrentValue())

  // Run the animation infinite times
  spring.infinite = (startValue, endValue, duration) => {
    let id = null

    spring.setValue(startValue)

    id = setTimeout(() => {
      spring.setValue(endValue)
    }, duration || 1200)

    return id
  }

  spring.oncancel = () => {
    let res

    function createPromise() {
      return window.Promise && new Promise(resolve => (res = resolve))
    }

    const promise = createPromise()

    // Exit the physics solver loop
    spring.removeAllListeners()

    window.cancelAnimationFrame(id)

    res({ msg: 'Animation cancelled.' })

    return promise
  }

  return spring
}
