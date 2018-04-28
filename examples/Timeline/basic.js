import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers, Keyframes } from '../../src'

const t = Timeline({
  iterations: 3,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

export class BasicTimeline extends React.Component {
  componentDidMount() {
    t
      .animate({
        element: this.one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()

    console.log(t)
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
