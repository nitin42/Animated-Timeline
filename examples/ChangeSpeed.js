import React, { Component } from 'react'

import { Timeline, helpers } from '../src'

import { boxStyles } from './styles'

const { transition } = helpers

const Animated = Timeline({
  direction: 'alternate',
  iterations: 1,
})

export class ChangeSpeed extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      opacity: transition({ from: 0.2, to: 0.8 }),
      rotate: {
        value: transition({ from: 360, to: 180 }),
      },
    }).start()

    Animated.getAnimations().forEach(animation => {
      animation.speed = 0.09
    })
  }

  render() {
    return (
      <div
        ref={one => (this.one = one)}
        style={{ margin: '0 auto', width: '50%', ...boxStyles }}
      />
    )
  }
}
