import React, { Component } from 'react'

import { Timeline, helpers } from '../src'

import { boxStyles } from './styles'

const { transition, startAfter, startBefore } = helpers

const Animated = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: 1,
})

// Similar to web animation API
export class Timing extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: '20turn',
    })
      .value({
        elements: this.two,
        translateX: transition({ from: 5, to: 12 }),
        opacity: transition({ from: 0.4, to: 0.8 }),
        rotate: '10turn',
        offset: startAfter(1200),
      })
      .value({
        elements: this.three,
        translateX: transition({ from: 2, to: 20 }),
        opacity: transition({ from: 0.3, to: 0.9 }),
        offset: startBefore(1400),
      })
      .start()
  }

  render() {
    return (
      <div>
        <div ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={boxStyles} />
        <div ref={three => (this.three = three)} style={boxStyles} />
      </div>
    )
  }
}
