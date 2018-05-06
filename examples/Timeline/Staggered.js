import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
  iterations: Infinity,
  direction: 'alternate',
  duration: 2000,
  easing: 'easeInOutSine'
})

export class Staggered extends React.Component {
  componentDidMount() {
    t
      .animate({
        scale: helpers.transition({
          from: 2,
          to: 1
        }),
        delay: (element, i) => i * 750
      })
      .start()
  }

  renderNodes = n => {
    let children = []

    for (let i = 0; i < n; i++) {
      children.push(React.createElement(t.div, { style: boxStyles, key: i }))
    }

    return children
  }

  render() {
    return <React.Fragment>{this.renderNodes(3)}</React.Fragment>
  }
}
