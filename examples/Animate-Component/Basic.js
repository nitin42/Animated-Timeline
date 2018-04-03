import React, { Component } from 'react'

import { Animate, helpers } from '../../src'

import { boxStyles } from '../styles'

export class AnimateBasic extends Component {
  render() {
    return (
      <div>
        <Animate
          timingProps={{
            duration: 3000
          }}
          animationProps={{
            translateX: helpers.transition({ from: 0, to: 200 }),
            rotate: {
              value: helpers.transition({ from: 360, to: 180 }),
            },
            backgroundColor: helpers.transition({
              from: '#f48c42',
              to: '#844462'
            }),
          }}
        >
          <div style={boxStyles} />
        </Animate>
      </div>
    )
  }
}
