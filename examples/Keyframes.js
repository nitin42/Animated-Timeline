import React, { Component } from 'react'
import hx from 'colornames'

import { Timeline, Keyframes, helpers } from '../src'
import { boxStyles } from './styles'

const { start, startAfter } = helpers

const timeline = new Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true,
  speed: 0.7
})

const { Animated } = timeline.init()

const x = new Keyframes().value({
  value: 500,
  duration: 3000,
  elasticity: 900,
}).value(
  { value: 1000, duration: 1000 }
).value({
  value: 500,
  duration: 3000,
  elasticity: 900,
}).value(
  { value: 1000, duration: 1000 }
)

const y = new Keyframes().value({
  value: 200,
  duration: 3000,
  elasticity: 900,
}).value(
  { value: 20, duration: 1000 }
)

export class TimelineKeyframes extends Component {
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
        easing: 'easeInOutSine',
      },
    })

    Animated.value({
        elements: this.two,
        translateX: x.frames,
        translateY: y.frames,
        offset: startAfter(1800),
        backgroundColor: start({
          from: hx('mistyrose'),
          to: hx('green'),
        })
      })

    Animated.start() // Start the animation
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={{ marginTop: '30px', ...boxStyles}} />
      </React.Fragment>
    )
  }
}
