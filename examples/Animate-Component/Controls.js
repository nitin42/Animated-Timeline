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

const animationProps = {
  rotate: {
    value: helpers.transition({ from: 360, to: 180 })
  },
  scale: helpers.transition({ from: 1, to: 2 })
}

export class AnimateControls extends Component {
  state = {
    start: false,
    reset: false,
    reverse: false,
    restart: false,
    finish: false
  }

  handleStateUpdate = which => {
    this.setState(state => ({
      [which]: !state[which]
    }))
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <Animate
          timingProps={timingProps}
          animationProps={animationProps}
          start={this.state.start}
          stop={!this.state.start}
          reverse={this.state.reverse}
          reset={this.state.reset}
          finish={this.state.finish}
          restart={this.state.restart}
        >
          <div style={styles} />
        </Animate>
        <button onClick={e => this.handleStateUpdate('start')}>Start</button>
        <button onClick={e => this.handleStateUpdate('reverse')}>
          Reverse
        </button>
        <button onClick={e => this.handleStateUpdate('reset')}>Reset</button>
        <button onClick={e => this.handleStateUpdate('restart')}>
          Restart
        </button>
        <button onClick={e => this.handleStateUpdate('finish')}>finish</button>
      </div>
    )
  }
}
