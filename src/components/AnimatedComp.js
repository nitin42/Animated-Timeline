import React from 'react'

import { animated } from '../core'
import { noop } from '../utils/noop'

export class Basic extends React.Component {
  // Animated instance
  ctrl = null

  // Stores all the elements which will be animated
  elements = []

  static defaultProps = {
    // controls for time-based execution
    start: true,
    stop: false,
    reverse: false,
    reset: false,
    restart: false,

    // Animation lifecycle
    lifecycle: {
      onUpdate: noop,
      onStart: noop,
      onComplete: noop,
      callFrame: noop
    },

    // Animation attributes
    attributes: {
      autoplay: true
    }
  }

  componentDidMount() {
    this.ctrl = animated({
      elements: this.elements,
      // Add all the user defined animation attributes
      ...this.props.attributes,
      // Our .start() methods overrides this and vice-versa
      autoplay: true,
      // Append lifecycle hooks to the main instance
      ...this.props.lifecycle,
    })

    // These controls are optional here but can be used before we start the animation.
    if (this.props.stop) this.ctrl.stop()

    if (this.props.start) this.ctrl.start()
  }

  componentDidUpdate() {
    // Time based execution methods
    // These are activated only when the input value is updated

    if (this.props.stop) this.ctrl.stop()

    if (this.props.start) this.ctrl.start()

    if (this.props.reset) this.ctrl.reset()

    if (this.props.restart) this.ctrl.restart()

    if (this.props.reverse) this.ctrl.reverse()

    if (this.props.seek) {
      const config = {
        // By default we sync the animation progress value with the user defined value.
        // TODO: There is a bug when synchronizing the engine time with the varying speed. We loose the current animation progress and hence animation starts again from the start point. So 'seek' will work though with varying speed but it won't synchronize with the current animation progress when speed coefficient's value is not 1.
        default: (value) =>
          this.ctrl.seek(this.ctrl.duration * (Number(value) / 100)),
        custom: (callback) => {
          invariant(
            typeof callback === 'function',
            `Expected callback to be a function instead got a ${typeof callback}.`
          )
          // Also pass the animation engine instance to the user defined callback
          this.ctrl.seek(callback())
        },
      }

      this.props.seek(config)
    }
  }

  addElements = element => {
    this.elements = [...this.elements, element]
  }

  resolveChildren = () => {
    let { children } = this.props

    if (!Array.isArray(children)) {
      children = [children]
    }

    return children.map((child, i) =>
      React.cloneElement(child, { key: i, ref: this.addElements })
    )
  }

  render() {
    return this.resolveChildren()
  }
}
