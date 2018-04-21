import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine',
  speed: 0.25
})

export class Lifecycle extends React.Component {
  state = {
    value: 0
  }

  componentDidMount() {
    timeline
      .animate({
        element: this.one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()

    timeline.onStart = ({ began }) => {
      if (began) {
        console.log('Started animation!')
      }
    }

    timeline.onComplete = ({ completed, controller: { reverse, restart } }) => {
      if (completed) {
        console.log('Completed... starting again!')
        reverse()
        restart()
      }
    }

    timeline.onUpdate = ({ progress }) => {
      this.setState({ value: Math.floor(Number(progress)) })
    }
  }

  render() {
    return (
      <div ref={one => (this.one = one)} style={boxStyles}>
        {this.state.value}
      </div>
    )
  }
}
