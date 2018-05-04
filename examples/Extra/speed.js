import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity,
  speed: 0.75
})

const animate = (one, two) => {
  t
    .sequence([
      t.animate({
        el: one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      t.animate({
        el: two,
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
      t.getAnimations().forEach((animation) => {
        animation.setSpeed(0.65)
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
