import React, { Component } from 'react'

import { Animate, helpers } from '../../src'

import { boxStyles } from '../styles'

export class AnimateBasic extends Component {
  render() {
    const styles = {
      width: '20px',
      height: '20px',
      backgroundColor: 'pink',
      marginTop: 30
    }

    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <Animate
          // Timing model props
          timingProps={{
            duration: 1000,
            direction: 'alternate',
            iterations: Infinity
          }}
          // Animation model props
          animationProps={{
            rotate: {
              value: helpers.transition({ from: 360, to: 180 })
            },
            scale: helpers.transition({ from: 1, to: 2 })
          }}
        >
          <div style={styles} />
        </Animate>
      </div>
    )
  }
}
