import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity,
  speed: 0.5
})

const animate = (one, two) => {
  timeline
    .sequence([
      timeline.animate({
        element: one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      timeline.animate({
        element: two,
        rotate: '360deg',
        offset: helpers.startBefore(1200)
      })
    ])
    .start()
}

export class ChangeSpeed extends React.Component {
  timer = null

  componentDidMount() {
    animate('#speed-one', '#speed-two')

    // Change the speed after 3s
    setTimeout(() => {
      timeline.getAnimations().forEach((animation) => {
        animation.setSpeed(0.2)
      })
    }, 3000)
  }

  render() {
    return (
      <React.Fragment>
        <div id="speed-one" style={boxStyles} />
        <div id="speed-two" style={boxStyles} />
      </React.Fragment>
    )
  }
}
