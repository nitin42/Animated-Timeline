import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  speed: 1,
  iterations: Infinity,
  direction: 'alternate',
  easing: 'easeInOutSine',
})

export class BasicTimeline extends React.Component {
  componentDidMount() {
    timeline.animate({
      element: '#one',
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).start()
  }

  render() {
    return (
      <div id='one' style={boxStyles} />
    )
  }
}
