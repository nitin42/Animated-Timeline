import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const t = Timeline({
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
    t
      .animate({
        element: this.one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()

    t.onStart = ({ began }) => {
      if (began) {
        console.log('Started animation!')
      }
    }

    t.onComplete = ({ completed, controller: { reverse, restart } }) => {
      if (completed) {
        console.log('Completed... starting again!')
        reverse()
        restart()
      }
    }

    t.onUpdate = ({ progress }) => {
      this.setState({ value: Math.floor(Number(progress)) })
    }
  }

  componentWillUnmount() {
    // Clear the subscriptions
    t.clear()
  }

  render() {
    return (
      <div ref={(one) => (this.one = one)} style={boxStyles}>
        <p style={{ textAlign: 'center' }}>{this.state.value}</p>
      </div>
    )
  }
}
