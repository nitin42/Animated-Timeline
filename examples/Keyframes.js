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

const x = new Animated.Keyframes().add({
  value: 500,
  duration: 3000,
  elasticity: 900,
}).add(
  { value: 1000, duration: 1000 }
).add({
  value: 500,
  duration: 3000,
  elasticity: 900,
}).add(
  { value: 1000, duration: 1000 }
)

const y = new Animated.Keyframes().add({
  value: 200,
  duration: 3000,
  elasticity: 900,
}).add(
  { value: 1000, duration: 1000 }
).add({
  value: 30,
  duration: 3000,
  elasticity: 900,
}).add(
  { value: 20, duration: 1000 }
)

export class TimelineKeyframes extends Component {
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
    })
      .values({
        nodes: this.two,
        translateX: x.frames,
        translateY: y.frames,
        offset: Animated.startAfter(1800),
        backgroundColor: Animated.start({
          from: Animated.hx('mistyrose'),
          to: Animated.hx('green'),
        })
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
        <br />
        <div ref={two => (this.two = two)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
