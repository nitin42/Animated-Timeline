import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity,
})

export class Finish extends React.Component {
  timer = null

  componentDidMount() {
    timeline.animate({
      element: '#one',
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).animate({
      element: '#two',
      rotate: '360deg',
      offset: helpers.startBefore(1200)
    }).start()
  }

  render() {
    return (
      <div id='one' style={boxStyles} onClick={e => timeline.finish()} />
    )
  }
}
