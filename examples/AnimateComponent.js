import React, { Component } from 'react'

import { Animate, helpers } from '../src'

import { boxStyles } from './styles'

export class AnimateExample extends Component {
  render() {
    return (
      <div>
        <Animate
          timingProps={{
            duration: 1000,
          }}
          animationProps={{
            rotate: {
              value: helpers.transition({ from: 360, to: 180 }),
            },
          }}
          lifecycle={{
            onComplete: ({ completed, controller: { restart, reverse } }) => {
              if (completed) {
                restart()
                reverse()
              }
            },
          }}
        >
          <div
            style={boxStyles}
            onClick={e => this.setState(state => ({ start: !state.start }))}
          />
        </Animate>
      </div>
    )
  }
}
