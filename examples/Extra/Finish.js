import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity
})

export class Finish extends React.Component {
  componentDidMount() {
    t
      .animate({
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()
  }

  render() {
    return <t.div style={boxStyles} onClick={e => t.finish()} />
  }
}
