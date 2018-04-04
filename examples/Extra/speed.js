import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'reverse',
  easing: 'easeInOutSine',
  iterations: Infinity,
  speed: 0.5
})

export class ChangeSpeed extends React.Component {
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

    // Change the speed after 3s
    setTimeout(() => {
      timeline.getAnimations().forEach(animation => {
        animation.setSpeed(1)
      })
    }, 3000)
  }

  render() {
    return (
      <div>
        <div id='one' style={boxStyles} />
        <div id='two' style={boxStyles} />
      </div>
    )
  }
}
