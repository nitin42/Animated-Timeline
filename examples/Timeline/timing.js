import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const timeline = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity
})

export class Timing extends React.Component {
  componentDidMount() {
    timeline.animate({
      element: this.one,
      translateY: helpers.transition({
        from: 100,
        to: 50
      }),
    }).animate({
      element: this.two,
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
    }).start()
  }

  render() {
    return (
      <div>
        <div ref={one => this.one = one} style={boxStyles}/>
        <div ref={two => this.two = two} style={boxStyles} />
      </div>
    )
  }
}
