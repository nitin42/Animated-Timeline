import React, { Component } from 'react'

import { Animated } from '../src'

const boxStyles = { width: '20px', height: '20px', backgroundColor: 'pink' }

const attributes = {
  direction: 'alternate',
  easing: 'easeInOutSine',
  duration: 2000,
  loop: 2,
}

const timeline = new Animated.Timeline(attributes)

const { Animate, Timeline } = timeline.init()

export class TimelineOffset extends Component {
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
        easing: 'easeInOutSine',
      },
    }).values({
      nodes: this.two,
      translateY: 300,
      elasticity: 900,
      offset: Animated.startBefore(2300)
    })
    .play() // Start the animation
  }

  render() {
    return (
      <React.Fragment>
        <Timeline
          lifecycle={{
            complete: ({ completed }) => {
              console.log('Done: ' + completed)
            }
          }}
        />
        <div ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
