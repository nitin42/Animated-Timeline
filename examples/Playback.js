import React from 'react'

import { Animated } from '../src/Seek'

const boxStyles = { width: '200px', height: '200px', backgroundColor: 'pink' }

export class PlaybackExample extends React.Component {
  render() {
    return (
      <Animated.Playback
        // animation attributes
        attributes={{
          translateY: 500,
          direction: 'alternate',
          easing: 'easeOutQuint',
          elasticity: 900,
          rotate: 3,
          delay: 200,
        } || this.props.attributes}
        // You decide when to play
        // Default: Autoplays the animation
        play={this.props.play}
        // // You decide when to pause an animation
        pause={!this.props.play}
        // Iterations
        loop={this.props.loop}
        // Seek the nodes which are being animated throughout the animated
        seek={this.props.seek}
        // Lifecyle of an animation
        lifecycle={{
          // This is called when a new update is performed
          // Eg - Seek
          update: ({ progress }) => {
            this.state.value = progress
          },
          // This is called when the animation completes
          complete: ({ completed, duration, paused }) => {
            // completed: Boolean
            // duration: Number (time taken in animation)
            // paused: Boolean
            this.setState(prevState => ({ completed, play: !prevState.play }))
          },
          // This is called each frame
          run: inst => {
            // This is called every frame
            // You can track the current iteration
          },
          // Called after the animation has been started
          // If there is any delay, then it is invoked after the delay
          begin: inst => {
            // Called after the animation delay is over
          },
        }}
      >
        <div style={boxStyles} />
      </Animated.Playback>
    )
  }
}
