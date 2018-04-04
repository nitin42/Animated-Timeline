import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'alternate',
  speed: 0.7,
  easing: 'easeInOutSine',
  iterations: Infinity
})

export class SequenceTimeline extends React.Component {
  componentDidMount() {
    timeline.animate({
      element: this.one,
      translateX: helpers.transition({
        from: 20,
        to: 10
      }),
      rotate: {
        value: 360,
      },
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).animate({
      element: this.two,
      translateY: helpers.transition({
        from: 100,
        to: 50
      }),
      elasticity: 5000
    })

    timeline.start()
  }

  render() {
    return (
      <div>
        <div ref={one => this.one = one} style={boxStyles} />
        <div ref={two => this.two = two} style={boxStyles} />
      </div>
    )
  }
}
