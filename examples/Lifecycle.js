import React, { Component } from 'react'

import { Timeline, helpers } from '../src'

import { boxStyles } from './styles'

const { transition } = helpers

const Animated = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: 1,
  speed: 0.2,
})

export class Lifecycle extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: '20turn',
    }).start()

    Animated.onComplete = ({ completed }) => {
      if (completed) {
        // Reverse the direction
        Animated.reverse()
        //
        // Start the animation again
        Animated.restart()
      }
    }

    Animated.onStart = inst => {
      console.log('Animation started')
    }
  }

  render() {
    return <div ref={one => (this.one = one)} style={boxStyles} />
  }
}
