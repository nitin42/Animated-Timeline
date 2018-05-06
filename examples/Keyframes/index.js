import React from 'react'

import {
  createTimeline,
  Keyframes,
  helpers
} from '../../build/animated-timeline.min.js'

import { boxStyles } from '../styles'

const t = createTimeline({
  duration: 3000,
  elasticity: 1900,
  easing: 'easeInOutSine',
  direction: 'alternate',
  iterations: Infinity
})

const x = new Keyframes()
  .add({
    value: 1
  })
  .add({
    value: 10,
    offset: 0.25
  })
  .add({
    value: 20,
    offset: 0.5
  })
  .add({
    value: 30,
    offset: 1
  })

export class KeyframesExample extends React.Component {
  componentDidMount() {
    t
      .animate({
        borderRadius: x.frames,
        backgroundColor: helpers.transition({
          from: '#f989a7',
          to: '#f9b570'
        })
      })
      .start()
  }

  render() {
    return <t.div style={boxStyles} />
  }
}
