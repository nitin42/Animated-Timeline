import React, { Component } from 'react'

import { Timeline, Keyframes, helpers} from '../src'
import { boxStyles } from './styles'

const { start, hx } = helpers

const timeline = new Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  loop: true,
  speed: 0.2
})

const { Animated, AnimationTimeline } = timeline.init()

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
    }).start()
  }

  render() {
    return (
      <React.Fragment>
        <AnimationTimeline
          lifecycle={{
            complete: ({ completed }) => {
              console.log('Done: ' + completed)
            }
          }}
        />
        <div ref={one => (this.one = one)} style={boxStyles} />
      </React.Fragment>
    )
  }
}
