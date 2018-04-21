// @flow

import _R from 'rebound'
import invariant from 'invariant'

import { getAnimationType } from '../core/engine'
import { batchMutation } from '../core/batchMutations'

import {
  deg,
  px,
  rem,
  em,
  rad,
  grad,
  turn,
  parseValue
} from '../utils/springUtils'

// Property name
type property = string

// Main spring instance
type SPRING = Object

// Spring callback function (invoked during different phases of animation)
type callback = (spring: SPRING) => void

// Element to animate
type element = HTMLElement

// Spring callback function props
type callbackProps = {
  currentValue: number,
  // Value at which spring will be at rest
  endValue: number,
  // Current velocity
  velocity: number,
  // Is at rest ?
  springAtRest: boolean,
  //TODO:
  // should oscillating ?
  isOscillating: boolean,
  // Exceeded the end value
  exceeded: boolean
}

// Options for main 'Spring' function
type springOptions = {
  friction?: number,
  tension?: number,
  bounciness?: number,
  speed?: number
}

// Options passed to interpolate callback function
type interpolateOptions = {
  // Map values from one range to another range
  mapValues: (
    value: number,
    f1: number,
    f2: number,
    t1: number,
    t2: number
  ) => void,
  // Interpolate hex colors with or without an input range
  interpolateColor: (
    value: number,
    c1: string,
    c2: string,
    f1: number,
    f2: number
  ) => void,
  // Convert to degree
  radians: (radians: number) => {},
  // Convert to radian
  degrees: (degrees: number) => {},
  // Convert to pixel
  px: (value: number) => string,
  // Convert to degrees
  deg: (value: number) => string,
  // Convert to radians
  rad: (value: number) => string,
  // Convert to gradians
  grad: (value: number) => string,
  // Convert to turn
  turn: (value: number) => string,
  // Convert to em
  em: (value: number) => string,
  // Convert to rem
  rem: (value: number) => string
}

type animationOptions = {
  mapValues: {
    input: Array<number>,
    output: Array<any>
  },
  interpolateColor: {
    colors: Array<any>,
    range?: Array<number>
  }
}

type interpolate = (
  style: Object,
  value: string | number,
  options: interpolateOptions
) => void

const isColorProperty = (property: property): boolean =>
  property.includes('Color') || property.includes('color')

// Set the initial styles of the element which will be animated
const setInitialStyles = (
  element: element,
  { property, value, type }: { property: any, value: string, type: string }
): void => {
  if (type === 'transform') {
    // Batching style mutation reduces recalcs/sec
    batchMutation(() => (element.style.transform = `${property}(${value})`))
  } else if (type === 'css') {
    batchMutation(() => (element.style[property] = value))
  }
}

// Spring callback props
const getCallbackProps = (instance: SPRING): callbackProps => ({
  ...instance.state()
})

// Default spring config
const defaultSpring = () => new _R.SpringSystem().createSpring(13, 3)

// Spring config with tension and friction
const createSpring = (friction: number = 13, tension: number = 3): SPRING =>
  new _R.SpringSystem().createSpring(friction, tension)

// Spring config with bounciness and speed
const createSpringWithBounciness = (
  bounciness: number = 20,
  speed: number = 10
): SPRING =>
  new _R.SpringSystem().createSpringWithBouncinessAndSpeed(bounciness, speed)

export function Spring(options: springOptions): SPRING {
  let spring

  if (options && typeof options === 'object') {
    const { friction, tension, bounciness, speed } = options

    if (bounciness || speed) {
      if (!(friction || tension)) {
        spring = createSpringWithBounciness(bounciness, speed)
      } else {
        throw new Error(
          `Cannot configure ${
            friction !== undefined ? 'friction' : 'tension'
          } property with ${bounciness !== undefined ? 'bounciness' : 'speed'}.`
        )
      }
    } else if (friction || tension) {
      if (!(bounciness || speed)) {
        spring = createSpring(friction, tension)
      } else {
        throw new Error(
          `Cannot configure ${
            bounciness !== undefined ? 'bounciness' : 'speed'
          } property with ${friction !== undefined ? 'friction' : 'tension'}.`
        )
      }
    } else {
      if (process.env.NODE_ENV !== 'production') {
        console.info(
          'Using default spring constants: { friction: 13, tension: 3 }'
        )
      }
      spring = defaultSpring()
    }
  } else {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        'Using default spring constants: { friction: 13, tension: 3 }'
      )
    }
    spring = defaultSpring()
  }

  // Map values from one range to another range
  const mapValues = _R.MathUtil.mapValueInRange

  // Interpolate color (hex value) using the value received from instance.getCurrentValue()
  const interpolateColor = _R.util.interpolateColor

  // rAF
  let id = null

  // TimeoutID for running infinite iterations of an animation
  let timeoutId: TimeoutID

  spring.animate = ({
    element, // Can be ref or selector (id or classname)
    property, // Property to be animated
    options = {
      mapValues: { input: [0, 1], output: [1, 1.5] },
      interpolateColor: { colors: ['#183a72', '#85c497'], range: [] }
    },
    interpolate = (style, value, options) => {},
    shouldOscillate = true // Flag to toggle oscillations in-between
  }: {
    element: element,
    property: any, // $FlowFixMe
    options: animationOptions,
    interpolate: interpolate,
    shouldOscillate: boolean
  }) => {
    invariant(
      !Array.isArray(element) ||
        typeof element === 'string' ||
        typeof element === 'object',
      'Can only pass a selector (id or class) or a reference to the element. To animate multiple elements, chain animate({}) calls.'
    )

    invariant(
      typeof property === 'string',
      `Expected property to be a string but instead got a ${typeof property}.`
    )

    invariant(
      typeof interpolate === 'function',
      `Expected interpolate to be a function but instead got a ${typeof interpolate}.`
    )

    if (!shouldOscillate) spring.setOvershootClampingEnabled(true)

    // Reference to the element which will be animated
    let el

    // Property type (css or transform)
    let type = ''

    // type: HTMLElement
    if (typeof element === 'object') {
      // must be a 'ref'
      el = element
    } else if (typeof element === 'string') {
      // id or classname
      el = document.querySelector(element)
    } else {
      throw new Error(`Received an invalid element type ${typeof element}.`)
    }

    if (getAnimationType(el, property) === 'transform') {
      type = 'transform'
    } else if (getAnimationType(el, property) === 'css') {
      type = 'css'
    }

    // Set the initial styles of the animation property of the element we want to animate
    // The values are derived from the options (mapValues or interpolateColor)
    setInitialStyles(el, {
      property,
      value: isColorProperty(property)
        ? options.interpolateColor.colors[0]
        : options.mapValues.output[0],
      type
    })

    spring.addListener({
      // Called when the spring moves
      onSpringActivate: (spr: SPRING): void => {
        if (spring.onStart && typeof spring.onStart === 'function') {
          spring.onStart(getCallbackProps(spr))
        }
      },
      // Called when the spring is at rest
      onSpringAtRest: (spr: SPRING): void => {
        if (spring.onRest && typeof spring.onRest === 'function') {
          spring.onRest(getCallbackProps(spr))
        }
      },
      onSpringUpdate: (spr: SPRING): void => {
        let val = spr.getCurrentValue()

        if (!isColorProperty(property)) {
          // For transforms, layout and other props
          const { input, output } = options.mapValues

          // Get the unit from the value
          const unit =
            parseValue(output[0])[2] || parseValue(output[1])[2] || ''

          // Output ranges
          const t1 = Number(parseValue(output[0])[1]) || 1

          const t2 = Number(parseValue(output[1])[1]) || 1.5

          // Map the values from input range to output range
          val = String(mapValues(val, input[0], input[1], t1, t2)).concat(unit)
        } else if (isColorProperty(property)) {
          // For color props only
          const { colors, range } = options.interpolateColor

          // Interpolate hex values with an input range
          if (range && (Array.isArray(range) && range.length === 2)) {
            // Value is converted to RGB scale

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

        id = window.requestAnimationFrame(() => {
          // Interpolations are batched first because they may re-initialise the 'transform' property.

          // Callback should receive unitless values (units can be appended afterwards using the options)
          interpolate(
            // Pass style object of the element
            // We can either use setState to update the element style or directly mutate the DOM element
            el.style,
            !isColorProperty(property)
              ? Number(parseValue(String(val))[1]) || val
              : val,
            {
              // Map values from one range to another range
              mapValues: _R.MathUtil.mapValueInRange,

              // Interpolate hex colors with or without an input range
              interpolateColor: _R.util.interpolateColor,

              // Convert degrees and radians
              radians: _R.util.radiansToDegrees,
              degrees: _R.util.degreesToRadians,

              px, // Convert to pixel
              deg, // Convert to degrees
              rad, // Convert to radians
              grad, // Convert to gradians
              turn, // Convert to turn
              em, // Convert to em
              rem // Convert to rem
            }
          )

          if (type === 'transform') {
            if (!el.style.transform.includes(property)) {
              // If interpolation callback initializes 'transform' property, then simply append the required property.
              el.style.transform = el.style.transform.concat(
                `${property}(${val})`
              )
            } else {
              el.style.transform = `${property}(${val})`
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

  // Set a new value and start the animation
  spring.setValue = spring.setEndValue

  // Set a new value and velocity, and start the animation
  spring.setValueVelocity = ({
    value,
    velocity
  }: {
    value: number,
    velocity: number
  }): void => spring.setVelocity(velocity).setValue(value)

  // Stop the animation
  spring.stop = () => {
    spring.setAtRest()
    // or
    // spring.setCurrentValue(spring.getCurrentValue())
  }

  // Change the position of an element without starting the animation
  // This is useful for moving elements to a different position with the value (without calling the animation).
  // After moving to a different position, use spring.setValue(value) to start the animation from that position.
  // A good example is dragging of the elements
  spring.moveTo = (val: number): void => spring.setCurrentValue(val).stop()

  // Immediately start the animation with a value
  spring.startAt = (val: number): void => spring.setValue(val)

  // Reset the animation
  spring.reset = () => spring.setCurrentValue(-1)

  // Reverse direction of the animation
  spring.reverse = () => spring.setValue(-spring.getCurrentValue())

  // Change the position of an element
  spring.seek = (val: number): void => spring.setValue(val)

  // Start the animation
  spring.start = () =>
    spring.setValue(spring.getEndValue() - spring.getCurrentValue())

  // Infinite iterations
  spring.infinite = (
    startValue: number,
    endValue: number,
    duration: number
  ): void => {
    // Go forward
    spring.setValue(startValue)

    timeoutId = setTimeout(() => {
      // Go back again
      spring.setValue(endValue)
    }, duration || 1200)
  }

  // This ensures that we don't cause a memory leak when the setState calls are batched inside the interpolations
  // If we need to update the state inside the interpolation method, then this method MUST be called inside the componentWillUnmount() hook.
  spring.remove = () => {
    // Deregister the spring
    spring.removeAllListeners()
    // Clear the timeout for infinite iterations
    timeoutId && clearTimeout(timeoutId)
    // Cancel the animation
    id && window.cancelAnimationFrame(id)
  }

  // This determines whether the spring exceeded the end value
  spring.exceeded = () => spring.isOvershooting()

  // Spring state
  spring.state = () => ({
    // Current oscillation value
    currentValue: spring.getCurrentValue(),
    // Value at which spring will be at rest
    endValue: spring.getEndValue(),
    // Current velocity
    velocity: spring.getVelocity(),
    // Is at rest ?
    springAtRest: spring.isAtRest(),
    // Is oscillating ?
    isOscillating: spring.isOvershootClampingEnabled(),
    // Exceeded the end value
    exceeded: spring.exceeded()
  })

  // Promise based API for cancelling/deregistering a spring
  spring.oncancel = () => {
    let res = (args) => {}

    function createPromise() {
      return window.Promise && new Promise((resolve) => (res = resolve))
    }

    const promise = createPromise()

    // Deregister the spring (also removes all the listeners)
    spring.destroy()

    timeoutId && clearTimeout(timeoutId)

    id && window.cancelAnimationFrame(id)

    res({ msg: 'Animation cancelled.' })

    return promise
  }

  return spring
}
