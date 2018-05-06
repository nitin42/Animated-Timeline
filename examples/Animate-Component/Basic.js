import React, { Component } from 'react'

import { Animate, helpers } from '../../build/animated-timeline.min.js'

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink',
  marginTop: 30
}

const timingProps = {
  duration: 1000,
  direction: 'alternate',
  iterations: Infinity
}

// Properties for animation model
const animationProps = {
  rotate: '360deg',
  scale: 2
}

export class AnimateBasic extends Component {
  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <Animate timingProps={timingProps} animationProps={animationProps}>
          <div style={styles} />
        </Animate>
      </div>
    )
  }
}
