import _R from 'rebound'

import {
  getAnimatables,
  getCSSValue,
  getAnimationType,
  getOriginalTargetValue,
  validateValue,
} from '../core/engine'

/**

// Create a new spring with friction and tension
const spring = Spring({
  friction: 10,
  tension: 4
})

// Animate the element with spring motion
spring.animate(
  element: '',
  initValue: this.state.scale,
  property: 'scale',
  options: {
    mapValues: {
      from: [],
      to: []
    }
  },
  // This is called after 'setValue'. Use this callback to update styles using the newValue
  // Use mapValues/interpolateColor helpers to convert the values and update the styles
  onUpdate: (style, value, { mapValues, interpolateColor }) => {}
)

// Set new value and starts the motion
spring.setValue()

// Stop the motion
spring.stop()

// Change the motion with an input value
spring.seek()

// Reset the motion
spring.reset()

// Reverse the spring motion
spring.reverse()

// Restart the spring motion
spring.restart()

// Start the motion from a value
spring.startAt()
*/

export function createSpring(friction, tension) {
  const springSystem = new _R.SpringSystem()
  let spring = springSystem.createSpring(friction, tension)
  let id = null

  spring.animate = (element, state, prop, options={
    mapValues: {
      from: [],
      to: []
    }
  }, onUpdate) => {
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
          if (type === 'transform') {
            onUpdate(el.style, val, { mapValues: _R.MathUtil.mapValueInRange, interpolateColor: _R.util.interpolateColor})
            if (!el.style['transform'].includes(prop)) {
              el.style['transform'] = el.style['transform'].concat(`${prop}(${val})`)
            } else {
              el.style['transform'] = `${prop}(${val})`
            }
          } else if (type === 'css') {
            el.style[prop] = `${val}`
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
