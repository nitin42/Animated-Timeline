import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

const props = {
  property: 'translateX',
  options: {
    mapValues: {
      input: [0, 1],
      output: ['0px', '30px']
    }
  }
}

export class SpringControls extends React.Component {
  state = {
    value: 0
  }

  componentDidMount() {
    spring.animate({
      element: this.one,
      ...props
    })
  }

  handleChange = (e) => {
    const value = e.target.value

    spring.seek(value)

    this.setState({ value })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div
          ref={(one) => (this.one = one)}
          onMouseUp={() => {
            spring.setValue(0)
          }}
          onMouseDown={() => {
            spring.setValue(1)
          }}
          style={boxStyles}
        />
        <input
          type="range"
          min="0"
          max="50"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button onClick={() => spring.reset()}>Reset</button>
        <button onClick={() => spring.start()}>Start</button>
        <button onClick={() => spring.stop()}>Stop</button>
        <button onClick={() => spring.reverse()}>Reverse</button>
      </div>
    )
  }
}
