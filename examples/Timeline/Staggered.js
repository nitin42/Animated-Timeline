import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
	iterations: Infinity,
	direction: 'alternate',
	duration: 2000,
	easing: 'easeInOutSine',
})

export class Staggered extends React.Component {
	componentDidMount() {
		t.animate({
      multipleEl: ['#one', '#two', '#three'],
			scale: helpers.transition({
				from: 2,
				to: 1,
			}),
      delay: this.staggered
		}).start()
	}

  // Delay by 150ms
  staggered = (element, i) => i * 150

	render() {
		return (
			<div>
        <div id='one' style={boxStyles} />
        <div id='two' style={boxStyles} />
        <div id='three' style={boxStyles} />
      </div>
		)
	}
}
