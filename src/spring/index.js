import _R from 'rebound'

import {
  getAnimatables,
  getCSSValue,
  getAnimationType,
  getOriginalTargetValue,
  validateValue,
} from '../core/engine'

/**

API for spring system:

// Create a new spring with friction and tension
const spring = createSpring({
  friction: 10,
  tension: 2
})

// Initialise the spring with properties
spring.init(
  initial_value_of_the_property_being_animated,
  target_or_selector_or_element_which_you_want_to_animate,
  property to animate or a function that will perform the style updates,
  options (mapValues, mapColors)
)

// Update the value
spring.setValue(2)

// Methods

// Stop the motion
spring.stop()

// Start the motion (called when a new value is set using setValue)
spring.start()

// Reset the value
spring.reset()

// Restart from the previous value
spring.restart()

// Reverse the values
spring.reverse()

// Change the motion with values dynamically
spring.seek()

// Procedure:

1. Get the initial value for the property

2. Get the element (refs, classes or ids). It can be an array.

  * If its a single element, then check the type of the element (is it ref. or a selector)

3. Get the property value.

  * If its a string, then apply the transform for the that single property

  * If its a function, then apply schedule an update using rAF for that function. The function will be receiving the value until  equlibirium is achieved.

  * Get the options (mapValues or interpolateColor)



















*/


export function createSpring(friction, tension) {
  const springSystem = new _R.SpringSystem()
  let spring = springSystem.createSpring(friction, tension)
  let id = null

  spring.init = (state, element, prop, options={
    mapValues: {
      from: [],
      to: []
    }
  }) => {
    let ref = null
    let el = null
    let type = null

    const { from, to } = options.mapValues

    if (typeof element !== 'string') {
      ref = element
    } else if (typeof element === 'string') {
      el = document.querySelector(element)

      if (getAnimationType(el, prop) === 'transform') {
        type = 'transform'
      } else if (getAnimationType(el, prop) === 'css') {
        type = 'css'
      }

    } else {
      throw new Error('Not a valid element.')
    }
    // if (typeof prop !== 'function' && type !== 'css') {
    //   el.style['transform'] = `${prop}(${state})`
    // } else {
    //   el.style[prop] = state
    // }

    spring.addListener({
      onSpringUpdate: (spr) => {
        let val = spr.getCurrentValue();
        if (from.length !== 0 && to.length !== 0 && !prop.includes('color')) {
          val = _R.MathUtil.mapValueInRange(val, from[0], from[1], to[0], to[1]);
        } else if (prop.includes('color') || prop.includes('Color')) {
          val = _R.util.interpolateColor(val, '#f2a4eb', '#4c364a')
        }

        if (typeof prop !== 'function') {
          if (prop.includes('rotate') || prop.includes('skew')) val = String(val).concat('deg')

          if (prop.includes('translate')) val = String(val).concat('px')

        }

        id = window.requestAnimationFrame(() => {
          if (typeof prop !== 'function') {
            if (type === 'transform') {
              el.style['transform'] = `${prop}(${val})`
            } else if (type === 'css') {
              el.style[prop] = `${val}`
            }
          } else {
            prop(val)
          }
        })
      }
    })
  }

  spring.stop = () => spring.setCurrentValue(spring.getCurrentValue())

  spring.reset = () => {
    spring.setCurrentValue(-1)
  }

  spring.reverse = () => {
    spring.setEndValue(-(spring.getCurrentValue()))
  }

  spring.seek = (val) => {
    spring.setEndValue(val)
  }

  spring.setValue = spring.setEndValue

  return spring
}
