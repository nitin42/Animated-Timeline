import React, { Component } from 'react'
import hx from 'colornames'

import { Timeline, helpers } from '../src'
import { boxStyles } from './styles'

const { start } = helpers

const timeline = new Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true,
  duration: 4000,
})

const { Animated } = timeline.init()

export class TimelineBasic extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      backgroundColor: start({
        from: hx('cyan'),
        to: hx('red'),
      }),
      rotate: {
        value: 360,
        easing: 'easeInOutSine',
      },
    }).value({
      elements: this.two,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      backgroundColor: start({
        from: hx('cyan'),
        to: hx('red'),
      }),
      rotate: {
        value: 360,
        easing: 'easeInOutSine',
      },
    }).start()
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one => (this.one = one)} style={boxStyles} /><br/>
        <div ref={two => (this.two = two)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
