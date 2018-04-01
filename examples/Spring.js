import React from 'react'

import { createSpring } from '../src/spring'

import { boxStyles } from './styles'

const spring = createSpring(4, 2)

const spring2 = createSpring(4, 2)

const spring3 = createSpring(4, 2)

const spring4 = createSpring(4, 2)

const spring5 = createSpring(4, 2)

export class Spring extends React.Component {
  state = {
    scale: 1,
    value: 0
  }

  componentDidMount() {
    spring.init(this.state.scale, '#one', 'scale', {
      mapValues: {
        from: [0, 1], // Input range
        to: [1, 1.5], // Output range
      },
    })

    // spring2.init(1, '#two', 'rotate', {
    //   mapValues: {
    //     from: [0, 1],
    //     to: [180, 360]
    //   }
    // })
    //
    // spring3.init(1, '#three', 'translateY', {
    //   mapValues: {
    //     from: [0, 1],
    //     to: [0, 40]
    //   }
    // })
    //
    // spring4.init(1, '#four', 'translateX', {
    //   mapValues: {
    //     from: [0, 1],
    //     to: [0, 50]
    //   }
    // })
  }

  handleChange = e => {
    spring.seek(e.target.value)
    spring2.seek(e.target.value)
    spring3.seek(e.target.value)
    spring4.seek(e.target.value)

    this.setState({
      value: e.target.value
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%'}}>
        <div
          id="one"
          onMouseUp={() => {
            spring.setValue(0)
          }}
          onMouseDown={() => {
            spring.setValue(1)
          }}
          style={boxStyles}
        />
        {/* <div
          id="two"
          onMouseUp={() => {
            spring2.setValue(0)
          }}
          onMouseDown={() => {
            spring2.setValue(1)
          }}
          style={boxStyles}
        />
        <div
          id="three"
          onMouseUp={() => {
            spring3.setValue(0)
          }}
          onMouseDown={() => {
            spring3.setValue(1)
          }}
          style={boxStyles}
        />
        <div
          id="four"
          onMouseUp={() => {
            spring4.setValue(0)
          }}
          onMouseDown={() => {
            spring4.setValue(1)
          }}
          style={boxStyles}
        /> */}
        {/* <input type="range" min="0" max="50" value={this.state.value} onChange={this.handleChange} /> */}
      </div>
    )
  }
}
