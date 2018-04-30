import React, { Component } from 'react'

import { Animate, helpers } from '../../build/animated-timeline.min.js'

import { boxStyles } from '../styles'

export class AnimateAdvance extends Component {
  state = { value: 0 }

  handleChange = e => this.setState({ value: e.target.value })

  render() {
    return (
      <div>
        <Animate
          timingProps={{
            duration: 2000
          }}
          animationProps={{
            translateX: helpers.transition({ from: 0, to: 200 }),
            scale: helpers.transition({ from: 2, to: 4 }),
            rotate: helpers.transition({ from: '360deg', to: '180deg' }),
            opacity: helpers.transition({ from: 0.2, to: 0.8 })
          }}
          lifecycle={{
            onUpdate: ({ progress }) => {
              this.state.value = progress
            }
          }}
          seekAnimation={({ duration }) => duration - this.state.value * 20}
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
