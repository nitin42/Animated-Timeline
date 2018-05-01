import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringControls extends React.Component {
  state = {
    value: 0
  }

  componentDidMount() {
    s.animate({
      property: 'translateX',
      map: {
        input: [0, 1],
        output: ['0px', '30px']
      }
    })
  }

  handleChange = (e) => {
    const value = e.target.value
    s.seek(value)
    this.setState({ value })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <s.div
          onMouseUp={() => s.setValue(0)}
          onMouseDown={() => s.setValue(1)}
          style={boxStyles}
        />
        <input
          type="range"
          min="0"
          max="50"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={() => s.reset()}>Reset</button>
        <button onClick={() => s.start()}>Start</button>
        <button onClick={() => s.stop()}>Stop</button>
        <button onClick={() => s.reverse()}>Reverse</button>
      </div>
    )
  }
}
