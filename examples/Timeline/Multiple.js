import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
  iterations: Infinity,
  direction: 'alternate',
  duration: 1200,
  easing: 'easeInOutSine'
})

export class MultipleElements extends React.Component {
  componentDidMount() {
    t
      .animate({
        translateX: helpers.transition({
          from: 0,
          to: 90
        })
      })
      .start()
  }

  render() {
    return (
      <React.Fragment>
        <t.div style={boxStyles} />
        <t.p>Multiple Elements</t.p>
      </React.Fragment>
    )
  }
}
