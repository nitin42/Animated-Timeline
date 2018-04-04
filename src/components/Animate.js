import React from 'react'
import PropTypes from 'prop-types'

import { animated } from '../core/engine'
import { noop } from '../utils/noop'
import { createMover } from '../core/createMover'

/**
 * Animate component is used to perform playback based animations with a declarative API.
 *
 * Features -
 *
 * 1. Animate children by defining timing and animation model props
 * 2. Control the animation execution at any progress
 * 3. Seek the animation to change the animation position along its timeline
 * 4. Lifecycle hooks, which gets executed during different phases of an animation
 *
 * Tradeoffs -
 *
 * 1. Cannot perform sequence based animations and timing based animations
 * 2. Promise based APIs for oncancel and onfinish events are not available
 * 3. Controls for time-based execution are directly not available on the instance, and they are accessible only via flags
 *
 */
export class Animate extends React.Component {
  // Animated instance
  ctrl = null

  // seek the animation
  seek = null

  // Stores all the elements which will be animated
  elements = []

  static propTypes = {
    autoplay: PropTypes.bool,

    timingProps: PropTypes.object,
    animationProps: PropTypes.object,

    lifecyle: PropTypes.shape({
      onUpdate: PropTypes.func,
      onStart: PropTypes.func,
      onComplete: PropTypes.func,
    }),

    seekAnimation: PropTypes.oneOfType([ PropTypes.number, PropTypes.func, PropTypes.string ]),

    stop: PropTypes.bool,
    start: PropTypes.bool,
    reset: PropTypes.bool,
    restart: PropTypes.bool,
    reverse: PropTypes.bool,

    interactiveMode: PropTypes.bool
  }

  static defaultProps = {
    // Autoplay the animation
    autoplay: true,

    // Animation lifecyle
    lifecycle: {
      // Called when the animation is updating
      onUpdate: noop,
      // Called when the animation has started
      onStart: noop,
      // Invoked when the animation is completed
      onComplete: noop,
    },

    // Change the animation position along its timeline
    seekAnimation: 0,

    // Control the animation execution
    start: false,
    stop: false,
    reset: false,
    restart: false,
    reverse: false,

    // If set to 'true', then we can interactively change the animation position with an input value or callback function
    interactiveMode: false
  }

  componentDidMount() {
    this.ctrl = animated({
      // Animate all the children
      element: this.elements,
      // Timeline model props
      ...this.props.timingProps,
      // Animation model props
      ...this.props.animationProps,
      autoplay: this.props.autoplay || true,
    })

    // Add lifecyle hooks to the animated instance
    this.addLifecycle(this.props.lifecycle, this.ctrl)

    // Animation controls (start, stop, reset, reverse, restart)
    this.enableControls(this.props, this.ctrl)

    // This ensures that we mutate the instance fields (duration, progres, ...) in a separate mode rather than changing it when the animation starts when the component mounts
    if (this.props.interactiveMode) {
      // Change animation position by seeking the animation
      this.seekAnimation()
    }
  }

  componentDidUpdate() {
    // Update the animation state using the controls
    this.enableControls(this.props, this.ctrl)

    // Update the animation position in timeline on changing the input value
    this.seekAnimation()
  }

  componentWillUnmount() {
    // Cancel the animation (doesn't remove the nodes)
    this.ctrl && this.cancel(this.elements)
  }

  enableControls = (props, ctrl) => {
    if (props.stop) ctrl.stop()
    if (props.start) ctrl.start()
    if (props.reverse) ctrl.reverse()
    if (props.reset) ctrl.reset()
    if (props.restart) ctrl.restart()
  }

  addLifecycle = (lifecycle, ctrl) => {
    if (lifecycle.onStart) ctrl.onStart = lifecycle.onStart
    if (lifecycle.onComplete) ctrl.onComplete = lifecycle.onComplete
    // NOTE: Do not call setState inside onUpdate hook because React prevents infinite loops
    if (lifecycle.onUpdate) ctrl.onUpdate = lifecycle.onUpdate
  }

  addElements = element => {
    this.elements = [...this.elements, element]
  }

  resolveChildren = () => {
    let { children } = this.props

    if (!Array.isArray(children)) children = [children]

    return children.map((child, i) =>
      React.cloneElement(child, { key: i, ref: this.addElements })
    )
  }

  seekAnimation = () => {
    if (this.props.seekAnimation) {
      this.seek = createMover(this.ctrl)

      this.seek(this.props.seekAnimation)
    }
  }

  cancel = elements => {
    // Cancel the animation of all active elements
    this.ctrl.oncancel(elements).then(res => res)
  }

  render() {
    return this.resolveChildren()
  }
}
