import React, { Component } from 'react'

import { Timeline, helpers } from '../src'
import { boxStyles } from './styles'

const { hx, start, startBefore, random, currentValue } = helpers

const timeline = new Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: 1,
  speed: 0.2
})

const { Animated } = timeline.init()

export class TimelineOffset extends Component {
  state = { stop: false, value: 30 }

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
        value: random(0, 400),
      },
    })

    Animated.value({
      elements: this.two,
      translateY: 300,
      elasticity: 900,
      rotate: {
        value: 360,
        easing: 'easeInOutSine',
      },
      // Start animating this before the previous animation ends
      offset: startBefore(1100),
    })

    Animated.start()
  }

  render() {
    return (
      <React.Fragment>
        <div className="one" ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
