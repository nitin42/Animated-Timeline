import React from 'react'

import { animated } from '../core/engine'
import { noop } from '../utils/noop'

class Animate extends React.Component {
  // Animated instance
  ctrl = null

  // Stores all the elements which will be animated
  elements = []

  static defaultProps = {
    autoplay: true,
    // Timeline model
    timingProps: {
      duration: 1000,
      delay: 0,
      easing: 'linear',
      elasticity: 500,
      round: 0
    },
    // Animation model
    animationsProps: {
      iterations: 1,
      direction: 'normal',
      autoplay: true,
      offset: 0
    },
    lifecycle: {
      onUpdate: noop,
      onStart: noop,
      onComplete: noop
    },
    // Overrides the autoplay
    shouldStart: true,
    shouldStop: false
  }

  componentDidMount() {
    this.ctrl = animated({
      elements: this.elements,
      // Add all the user defined animation attributes
      ...this.props.timingProps,
      ...this.props.animationProps,
      // Our .start() methods overrides this and vice-versa
      autoplay: this.props.autoplay
    })

    // Lifecycle hooks are instance properties, so they should live separately from the timing model props and animation model props.
    if (this.props.lifecycle.onStart) this.ctrl.onStart = this.props.lifecycle.onStart
    if (this.props.lifecycle.onComplete) this.ctrl.onComplete = this.props.lifecycle.onComplete
    if (this.props.lifecycle.onUpdate) this.ctrl.onUpdate = this.props.lifecycle.onUpdate

    // Animation status flags
    if (this.props.shouldStop) this.ctrl.stop()
    if (this.props.shouldStart) this.ctrl.start()
  }

  componentDidUpdate() {
    if (this.props.shouldStop) this.ctrl.stop()

    if (this.props.shouldStart) this.ctrl.start()
  }

  componentWillUnmount() {
    this.ctrl && this.ctrl.stop()
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

  render() {
    return this.resolveChildren()
  }
}

export { Animate }