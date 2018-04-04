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

export class PromiseAPI extends React.Component {
  componentDidMount() {
    timeline.animate({
      element: '#one',
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).start()

    timeline.onfinish.then(res => console.log(res))
  }

  cancelAnimation = () => timeline.oncancel('#one').then(res => console.log(res))

  render() {
    return (
      <div id='one' style={boxStyles} onClick={this.cancelAnimation}/>
    )
  }
}
