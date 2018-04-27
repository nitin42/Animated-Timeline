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

export class PromiseAPI extends React.Component {
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

    t.onfinish.then((res) => console.log(res))
  }

  cancelAnimation = () =>
    t.oncancel(this.one).then((res) => console.log(res))

  render() {
    return (
      <div
        ref={(one) => (this.one = one)}
        style={boxStyles}
        onClick={this.cancelAnimation}
      />
    )
  }
}
