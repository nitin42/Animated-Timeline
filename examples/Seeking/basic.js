import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers, createMover } from '../../src'

const timeline = Timeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine',
})

const seekAnimation = createMover(timeline)

export class SeekBasic extends React.Component {
  state = { value: 0 }

  componentDidMount() {
    timeline.animate({
      element: '#one',
      scale: helpers.transition({
        from: 4,
        to: 2
      })
    }).start()
  }

  handleChange = e => {
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
        <div id='one' style={boxStyles} />
        <div style={{ marginTop: '40'}}>
          <input type="range" min="0" max="100" value={this.state.value} onChange={this.handleChange} />
        </div>
      </div>
    )
  }
}
