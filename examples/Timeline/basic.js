import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine',
})

export class BasicTimeline extends React.Component {
  componentDidMount() {
    timeline.animate({
      element: this.one,
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).start()
  }

  render() {
    return (
      <div ref={one => this.one = one} style={boxStyles} />
    )
  }
}
