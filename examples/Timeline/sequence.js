import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const t = Timeline({
  direction: 'alternate',
  speed: 0.7,
  easing: 'easeInOutSine',
  iterations: Infinity
})

const animate = ({ one, two }) => {
  t
    .sequence([
      t.animate({
        element: one,
        translateX: helpers.transition({
          from: 20,
          to: 10
        }),
        rotate: {
          value: 720
        },
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      t.animate({
        element: two,
        translateY: helpers.transition({
          from: 100,
          to: 50
        }),
        elasticity: 5000
      })
    ])
    .start()
}

export class SequenceTimeline extends React.Component {
  componentDidMount() {
    animate({ one: '#one', two: '#two' })
  }

  render() {
    return (
      <React.Fragment>
        <div id="one" style={boxStyles} />
        <div id="two" style={boxStyles} />
      </React.Fragment>
    )
  }
}
