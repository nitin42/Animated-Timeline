import React from 'react'

import hx from 'colornames'

import { Basic, helpers } from '../src'

export class AnimatedBasic extends React.Component {
  state = {
    stop: false
  }

  render() {
    return (
      <Basic
        attributes={{
          translateX: helpers.start({ from: 10, to: 400 }),
          speed: 0.4,
          opacity: helpers.start({
            from: 0.9,
            to: 0.4
          }),
          backgroundColor: helpers.start({
            from: hx('cyan'),
            to: hx('pink')
          }),
          elasticity: 900,
          rotate: {
            value: 132,
            direction: 'alternate'
          }
        }}
        start={!this.state.stop}
        stop={this.state.stop}
      >
        <div
          style={{ width: '200px', height: '200px', backgroundColor: 'red' }}
          onClick={e => {
            this.setState(state => ({ stop: !state.stop }))
          }}
        />
      </Basic>
    )
  }
}
