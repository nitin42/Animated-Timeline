import React from 'react'

import { Animated } from '../src'

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
        }}
        play={this.props.play}
        pause={!this.props.play}
        loop={this.props.loop}
        seek={this.props.seek}
        lifecycle={{
          update: ({ progress }) => {
            this.state.value = progress
          },
          complete: ({ completed, duration, paused }) => {
            this.setState(prevState => ({ completed, play: !prevState.play }))
          },
          run: inst => {
          },
          begin: inst => {
          },
        }}
      >
        <div style={boxStyles} />
      </Animated.Playback>
    )
  }
}
