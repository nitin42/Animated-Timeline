// @flow

import invariant from 'invariant'
import * as React from 'react'
import _R from 'rebound'

import { getAnimationType } from '../core/engine'
import { batchMutation } from '../core/batchMutations'
import { DOMELEMENTS } from '../utils/engineUtils'

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
  // Is overshoot clamping enabled ?
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

// Options passed to interpolation callback function
type interpolateOptions = {
  // Map values from one range to another range
  mapValues: (
    value: number, // Spring value
    f1: number, // From range one
    f2: number, // From range two
    t1: number, // Target range one
    t2: number // Target range two
  ) => void,
  // Interpolate hex colors with or without an input range
  interpolateColor: (
    value: number, // Spring value
    c1: string, // Hex one
    c2: string, // Hex two
    f1?: number, // Input range one
    f2?: number // Input range two
  ) => void,
  // Convert to degree
  radiansToDegrees: (radians: number) => {},
  // Convert to radian
  degreesToRadians: (degrees: number) => {},
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

type interpolation = (
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

// For data binding
const createElement = (
  element: string,
  instance: SPRING
): React.ComponentType<any> => {
  // $FlowFixMe
  class SpringElement extends React.Component<void, void> {
    target: HTMLElement | null

    componentDidMount() {
      // Assignment to forwardref.current means this will throw an error for legacy ref API
      // TODO: Refactor
      // $FlowFixMe
      instance.element =
        this.props.forwardref === null
          ? this.target
          : this.props.forwardref.current
    }

    addRef = target => {
      this.target = target
    }

    render(): React.Node {
      // $FlowFixMe
      const { forwardref, ...rest } = this.props

      // $FlowFixMe
      return React.createElement(element, {
        ...rest,
        ref: forwardref === null ? this.addRef : forwardref
      })
    }
  }

  // $FlowFixMe
  return React.forwardRef((props, ref) => (
    <SpringElement {...props} forwardref={ref} />
  ))
}

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

  Object.assign(
    spring,
    DOMELEMENTS.reduce((getters: Object, alias: string): Object => {
      getters[alias.toLowerCase()] = createElement(alias.toLowerCase(), spring)
      return getters
    }, {})
  )

  // Map values from one range to another range
  const springMap = _R.MathUtil.mapValueInRange

  // Interpolate color (hex value) using the value received from instance.getCurrentValue()
  const springInterpolateColor = _R.util.interpolateColor

  // rAF
  let id = null

  // Timeout id for running infinite iterations of an animation
  let timeoutId: TimeoutID

  spring.animate = ({
    el, // Can be ref or selector (id or classname). Use this property only when chaining .animate({}) calls (in other cases, you'll be relying on data binding)
    property, // Property to be animated
    map = { inputRange: [0, 1], outputRange: [1, 1.5] },
    blend = { colors: ['#183a72', '#85c497'], range: [] },
    interpolation = (style, value, options) => {},
    shouldOscillate = true // Flag to toggle oscillations in-between
  }: {
    el?: element,
    // $FlowFixMe
    property: any,
    map?: {
      inputRange: Array<number>, // Input ranges
      outputRange: Array<any> // Output ranges
    },
    blend?: {
      colors: Array<any>, // Input color hex codes
      range?: Array<number> // Input range to mix the colors
    },
    interpolation?: interpolation,
    shouldOscillate?: boolean
  }) => {
    invariant(
      !Array.isArray(el) || typeof el === 'string' || typeof el === 'object',
      typeof spring.element !== undefined,
      'Can only pass a selector (id or class) or a reference to the property "el" or use data binding instead.'
    )

    invariant(
      typeof property === 'string',
      `Expected property to be a string but instead got a ${typeof property}.`
    )

    invariant(
      typeof interpolation === 'function',
      `Expected interpolate to be a function but instead got a ${typeof interpolation}.`
    )

    if (!shouldOscillate) spring.setOvershootClampingEnabled(true)

    // Reference to the element which will be animated
    let element

    // Property type (css or transform)
    let type = ''

    // type: HTMLElement
    if (typeof el === 'object') {
      // must be a 'ref'
      element = el
    } else if (typeof el === 'string') {
      // id or classname
      element = document.querySelector(el)
    } else if (spring.element !== undefined) {
      // Data binding
      element = spring.element
    } else {
      throw new Error(`Received an invalid element type ${typeof element}.`)
    }

    if (getAnimationType(element, property) === 'transform') {
      type = 'transform'
    } else if (getAnimationType(element, property) === 'css') {
      type = 'css'
    }

    // Set the initial styles of the animation property of the element we want to animate
    // The values are derived from the options (map or blend)
    setInitialStyles(element, {
      property,
      value: isColorProperty(property) ? blend.colors[0] : map.outputRange[0],
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
          const { inputRange, outputRange } = map

          // Get the unit from the value
          const unit =
            parseValue(outputRange[0])[2] || parseValue(outputRange[1])[2] || ''

          // Output ranges
          const t1 = Number(parseValue(outputRange[0])[1]) || 1

          const t2 = Number(parseValue(outputRange[1])[1]) || 1.5

          // Map the values from input range to output range
          val = String(springMap(val, inputRange[0], inputRange[1], t1, t2)).concat(unit)
        } else if (isColorProperty(property)) {
          // For color props only
          const { colors, range } = blend

          // Interpolate hex values with an input range
          if (range && (Array.isArray(range) && range.length === 2)) {
            // Value is converted to RGB scale

            val = springInterpolateColor(
              val,
              colors[0],
              colors[1],
              range[0],
              range[1]
            )
          } else {
            // Ignore the input range
            val = springInterpolateColor(val, colors[0], colors[1])
          }
        }

        id = window.requestAnimationFrame(() => {
          // Interpolations are batched first because they may re-initialise the 'transform' property.

          // Callback should receive unitless values (units can be appended afterwards using the options)
          interpolation(
            // Pass style object of the element
            // We can either use setState to update the element style or directly mutate the DOM element
            element.style,
            !isColorProperty(property)
              ? Number(parseValue(String(val))[1]) || val
              : val,
            {
              // Map values from one range to another range
              mapValues: _R.MathUtil.mapValueInRange,

              // Interpolate hex colors with or without an input range
              interpolateColor: _R.util.interpolateColor,

              // Convert degrees and radians
              radiansToDegrees: _R.util.radiansToDegrees,
              degreesToRadians: _R.util.degreesToRadians,

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
            if (!element.style.transform.includes(property)) {
              // If interpolation callback initializes 'transform' property, then simply append the required property.
              element.style.transform = element.style.transform.concat(
                `${property}(${val})`
              )
            } else {
              element.style.transform = `${property}(${val})`
            }
          } else if (type === 'css') {
            element.style[property] = `${val}`
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
    spring.setValue(startValue)

    timeoutId = setTimeout(() => {
      spring.setValue(endValue)
    }, duration || 1000)
  }

  // This ensures that we don't cause a memory leak
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
    let res = args => {}

    function createPromise() {
      return window.Promise && new Promise(resolve => (res = resolve))
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
