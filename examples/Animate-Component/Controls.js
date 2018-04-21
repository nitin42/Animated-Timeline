import React, { Component } from 'react'

import { Animate, helpers } from '../../src'

export class AnimateControls extends Component {
  state = {
    start: false,
    reset: false,
    reverse: false,
    restart: false
  }

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
          timingProps={{
            duration: 1000,
            direction: 'alternate',
            iterations: Infinity
          }}
          animationProps={{
            rotate: {
              value: helpers.transition({ from: 360, to: 180 })
            },
            scale: helpers.transition({ from: 1, to: 2 })
          }}
          start={this.state.start}
          stop={!this.state.start}
          reverse={this.state.reverse}
          reset={this.state.reset}
          restart={this.state.restart}
        >
          <div style={styles} />
        </Animate>
        <button
          onClick={e => this.setState(state => ({ start: !state.start }))}
        >
          Start
        </button>
        <button
          onClick={e => this.setState(state => ({ reverse: !state.reverse }))}
        >
          Reverse
        </button>
        <button
          onClick={e => this.setState(state => ({ reset: !state.reset }))}
        >
          Reset
        </button>
        <button
          onClick={e => this.setState(state => ({ restart: !state.restart }))}
        >
          Restart
        </button>
      </div>
    )
  }
}
