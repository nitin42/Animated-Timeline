import React, { Component } from 'react'

import { Animated } from '../src'

const boxStyles = { width: '200px', height: '200px', backgroundColor: 'pink' }

// Create a custom bezier curve with a curve name
// Get your control points from here - https://matthewlein.com/tools/ceaser
Animated.createCurve('ReactCurve', [0.05, -0.33, 0.15, -0.38])

const attributes = {
  direction: 'alternate',
  // Use our custom easing curve created above
  easing: 'ReactCurve',
  duration: 4000,
  loop: 2,
  delay: 1000,
}

const timeline = new Animated.Timeline(attributes)

const { Animate, Timeline } = timeline.init()

export class TimelineAdvance extends Component {
  componentDidMount() {
    Animate.values({
      nodes: this.one,
      translateX: Animated.start({ from: 500, to: 20 }),
      opacity: Animated.start({ from: 0.4, to: 0.9 }),
      backgroundColor: Animated.start({
        from: Animated.hx('cyan'),
        to: Animated.hx('red'),
      }),
      rotate: {
        value: 360,
        duration: 1800,
        easing: 'easeInOutSine',
      },
    }).play()
  }

  render() {
    return (
      <React.Fragment>
        <Timeline />
        <div ref={one => (this.one = one)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
