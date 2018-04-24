import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers, Keyframes } from '../../src'

const timeline = Timeline({
  iterations: 3,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

export class BasicTimeline extends React.Component {
  componentDidMount() {
    timeline
      .animate({
        element: this.one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()
  }

  render() {
    return (
      <div
        ref={(one) => (this.one = one)}
        style={boxStyles}
        onClick={(e) => timeline.stop()}
      />
    )
  }
}
