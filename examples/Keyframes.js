import React, { Component } from 'react'

import { Timeline, Keyframes } from '../src'

import { boxStyles } from './styles'

const Animated = Timeline({
  easing: 'easeInOutSine',
  iterations: 1,
})

const x = new Keyframes()
  .value({
    value: 200,
    duration: 4000,
    delay: 1000,
    elasticity: 200,
  })
  .value({
    value: 0,
    offset: 0.4,
    duration: 6000,
  })

export class KeyframeExample extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: x.frames,
      rotate: {
        value: 180,
        duration: 2000
      },
    }).start()
  }

  render() {
    return <div ref={one => (this.one = one)} style={boxStyles} />
  }
}
