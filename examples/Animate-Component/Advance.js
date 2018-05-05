import React, { Component } from 'react'

import { Animate, helpers } from '../../build/animated-timeline.min.js'

import { boxStyles } from '../styles'

const timingProps = {
  duration: 2000
}

const animationProps = {
  translateX: helpers.transition({ from: 0, to: 200 }),
  scale: helpers.transition({ from: 2, to: 4 }),
  rotate: helpers.transition({ from: '360deg', to: '180deg' }),
  opacity: helpers.transition({ from: 0.2, to: 0.8 })
}

export class AnimateAdvance extends Component {
  state = { value: 0 }

  handleChange = e => this.setState({ value: e.target.value })

  onUpdate = props => {
    this.state.value = props.progress
  }

  seekAnimation = props => props.duration - this.state.value * 20

  render() {
    return (
      <div>
        <Animate
          timingProps={timingProps}
          animationProps={animationProps}
          lifecycle={{
            onUpdate: this.onUpdate
          }}
          seekAnimation={this.seekAnimation}
        >
          <div style={boxStyles} />
        </Animate>
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
