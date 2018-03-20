import React, { Component } from 'react'

import { Animated } from '../src'

const boxStyles = { width: '20px', height: '20px', backgroundColor: 'pink' }

// Animation attributes
const attributes = {
  direction: 'alternate',
  easing: 'easeInOutSine',
  duration: 2000,
  loop: 2,
}

// Create the timeline instance with animation attributes
const timeline = new Animated.Timeline(attributes)

// Initialise
// Returns the main animate instance which is used to animate the elements
// And a Timeline component which represents the timeline of an animation (use this to play, pause, performing interrupts, reverse and restarting the animation)
const { Animate, Timeline } = timeline.init()

export class TimelineBasic extends Component {
  componentDidMount() {
    // Add values for animating the node (this.one)
    Animate.values({
      // Pass a ref to the node, or a className like '.one' or an id '#one'
      // or an array of elements like [this.one, '.one', '#one']
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
    }).play() // Start the animation
  }

  render() {
    return (
      <React.Fragment>
        <Timeline
          // Animation lifecycle
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
