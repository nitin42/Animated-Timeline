import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers, createMover } from '../../src'

const t = Timeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

const seekAnimation = createMover(t)

export class SeekBasic extends React.Component {
  state = { value: 0 }

  componentDidMount() {
    t.animate({
      element: this.one,
      scale: helpers.transition({
        from: 4,
        to: 2
      })
    })

    seekAnimation(0)
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })

    seekAnimation(this.state.value)

    // or with a callback function

    // This will seek the animation from the reverse direction
    // seekAnimation(({ duration }) => duration - this.state.value * 10)
  }

  render() {
    return (
      <div>
        <div ref={(one) => (this.one = one)} style={boxStyles} />
        <div style={{ marginTop: '40' }}>
          <input
            type="range"
            min="0"
            max="100"
            value={this.state.value}
            onChange={this.handleChange}
          />
          <button onClick={() => t.stop()}>Pause</button>
          <button onClick={() => t.start()}>Play</button>
        </div>
      </div>
    )
  }
}
