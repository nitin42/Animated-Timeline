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

const isColorProperty = (property) =>
  property.includes('Color') || property.includes('color')

const isSkewOrRotate = (property) =>
  property.includes('rotate') || property.includes('skew')

const withUnit = (value, unit) => {
  value = String(value)
  if (value.includes(unit)) return value
  return value.concat(unit)
}

// Helpers for assigning units

const deg = (value) => withUnit(value, 'deg')

const px = (value) => withUnit(value, 'px')

const em = (value) => withUnit(value, 'em')

const rem = (value) => withUnit(value, 'rem')

const rad = (value) => withUnit(value, 'rad')

const grad = (value) => withUnit(value, 'grad')

const turn = (value) => withUnit(value, 'turn')

// Get the unit from value
const parseValue = (value) => {
  value = String(value)

  const split = /([\+\-]?[0-9#\.]+)(%|px|em|rem|in|cm|mm|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
    value.replace(/\s/g, '')
  )
  if (split) return split
}

const shouldInvokeCallback = (callback, params) => {
  if (callback && typeof callback === 'function') callback(params)
  else if (callback && typeof callback !== 'function')
    console.error(
      `Expected callback to be a function but instead got a ${typeof callback}.`
    )
}

const setInitialState = (element, { property, value, type }) => {
  if (type === 'transform') {
    // Saves us recalcs/sec
    batchMutation(() => (element.style.transform = `${property}(${value})`))
  } else if (type === 'css') {
    batchMutation(() => (element.style[property] = value))
  }
}

const getCallbackProps = (instance) => ({
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
      // TODO: not sure if these are the right defaults !?
      mapValues: { from: [0, 1], to: ['1px', '1.5px'] },
      // TODO: not sure if these are the right defaults !?
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
    setInitialState(el, {
      property,
      value: isColorProperty(property)
        ? options.interpolateColor.colors[0]
        : options.mapValues.to[0],
      type
    })

    spring.addListener({
      onSpringActivate: (spr) =>
        shouldInvokeCallback(spring.onStart, getCallbackProps(spr)),
      onSpringAtRest: (spr) =>
        shouldInvokeCallback(spring.onRest, getCallbackProps(spr)),
      onSpringUpdate: (spr) => {
        let val = spr.getCurrentValue()

        if (!isColorProperty(property)) {
          // For transforms, layout and other props (but not color props)
          const { from, to } = options.mapValues

          const unit = parseValue(to[0])[2] || parseValue(to[1])[2] || ''

          // Output ranges

          const t1 = Number(parseValue(to[0])[1])

          const t2 = Number(parseValue(to[1])[1])

          // Map the values
          val = String(mapValues(val, from[0], from[1], t1, t2)).concat(unit)
        } else if (isColorProperty(property)) {
          // For color props only
          const { colors, range } = options.interpolateColor

          // Interpolate hex values with an input range
          if (range && (Array.isArray(range) && range.length === 2)) {
            // Converted to RGB scale
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

        id = rAF(() => {
          // Interpolate callback should receive unitless values
          // They can be changed afterwards (by adding units) using the options
          interpolate(
            el.style,
            !isColorProperty(property)
              ? Number(parseValue(String(val))[1])
              : val,
            {
              mapValues: _R.MathUtil.mapValueInRange,
              interpolateColor: _R.util.interpolateColor,
              radians: _R.util.radiansToDegrees,
              degrees: _R.util.degreesToRadians,
              px,
              deg,
              rad,
              grad,
              turn,
              em,
              rem
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
  spring.startAt = (val) => spring.setValue(val)

  // Stop the animation
  spring.stop = () => spring.setCurrentValue(spring.getCurrentValue())

  // Reset the animation
  spring.reset = () => spring.setCurrentValue(-1)

  // Reverse the animation
  spring.reverse = () => spring.setValue(-spring.getCurrentValue())

  // Change the position of an element along with its motion
  spring.seek = (val) => spring.setValue(val)

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

  // This ensures that we don't cause a memory leak when the setState calls are batched inside the interpolations
  // If we need to update the state inside the interpolation method, then this method MUST be called inside the componentWillUnmount() hook.
  spring.unbatchUpdate = () => {
    spring.removeAllListeners()
    id && cancelAnimationFrame(id)
  }

  spring.oncancel = () => {
    let res

    function createPromise() {
      return window.Promise && new Promise((resolve) => (res = resolve))
    }

    const promise = createPromise()

    spring.removeAllListeners()

    window.cancelAnimationFrame(id)

    res({ msg: 'Animation cancelled.' })

    return promise
  }

  return spring
}
