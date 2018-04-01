import React, { Component } from 'react'

import { Timeline, helpers } from '../src'

import { boxStyles } from './styles'

const { transition } = helpers

const Animated = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: 1,
})

export class Sequence extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: '10turn',
    })
      .value({
        elements: this.two,
        translateX: transition({ from: 10, to: 120 }),
        opacity: transition({ from: 0.2, to: 0.8 }),
        rotate: '10turn',
      })
      .start()
  }

  render() {
    return (
      <div>
        <div ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={boxStyles} />
      </div>
    )
  }
}