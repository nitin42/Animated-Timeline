import React, { Component } from 'react'

import hx from 'colornames'

import { Timeline, helpers } from '../src'
import { boxStyles } from './styles'

const { start, startBefore, getEasings } = helpers

const timeline = new Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  speed: 0.2
})

const { Animated, AnimationTimeline } = timeline.init()

export class TimelineLifecycle extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 20 }),
      opacity: 0.8,
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
            // Called when the animation starts
            // If there is any delay, then it will be invoked after that delay timeout
            onStart: (obj) => {
              console.log("Started...");
            },
            // Invoked whenever there is any new update (state updates, events)
            // Avoiding calling setState here because React limits the number of nested updates to prevent infinite loops.
            // You can sync the animation progress with the input value here
            onUpdate: ({ progress }) => {
              // console.log("Updating...");
            },
            // Frame loop (called every frame)
            tick: (obj) => {
              // console.log("Loop...");
            },
            // Invoked when the animation is done
            onComplete: ({ completed }) => {
              // console.log('Completed: ' + completed);
              // console.log('Starting again...');
              if (completed) {
                // Reverse the direction
                Animated.reverse()
                // Restart the animation again
                Animated.restart()
              }
            }
          }}
        />
        <div className="one" ref={one => (this.one = one)} style={{ ...boxStyles}} />
      </React.Fragment>
    )
  }
}
