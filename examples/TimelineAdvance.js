import React, { Component } from 'react'

import { Timeline, Keyframes, helpers } from '../src'
import { boxStyles } from './styles'

const { createCurve, start, hx } = helpers

// Creates a custom bezier curve with a curve name
// Get your control points from here - https://matthewlein.com/tools/ceaser
const SampleCurve = createCurve('SampleCurve', [0.05, -0.33, 0.15, -0.98])

const timeline = new Timeline({
  direction: 'alternate',
  // Use our custom easing curve created above
  easing: SampleCurve,
  duration: 4000,
  loop: true,
  speed: 0.2
})

const { Animated, AnimationTimeline } = timeline.init()

export class TimelineAdvance extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 20 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      backgroundColor: start({
        from: hx('cyan'),
        to: hx('red'),
      }),
      rotate: {
        value: 360,
        duration: 1800,
        easing: 'easeInOutSine',
      },
    }).start()
  }

  render() {
    return (
      <React.Fragment>
        <AnimationTimeline />
        <div ref={one => (this.one = one)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
