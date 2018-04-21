import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity
})

export class Finish extends React.Component {
  timer = null

  componentDidMount() {
    timeline
      .animate({
        element: this.finish,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()
  }

  render() {
    return (
      <div
        ref={finish => (this.finish = finish)}
        style={boxStyles}
        onClick={e => timeline.finish()}
      />
    )
  }
}
