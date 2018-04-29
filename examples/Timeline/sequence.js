import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../src'

const t = createTimeline({
	direction: 'alternate',
	speed: 0.7,
	easing: 'easeInOutSine',
	iterations: Infinity,
})

const animate = (one, two) => {
	t
		.sequence([
			t.animate({
				el: one,
				translateX: helpers.transition({
					from: 20,
					to: 10,
				}),
				rotate: {
					value: 720,
				},
				scale: helpers.transition({
					from: 2,
					to: 1,
				}),
			}),

			t.animate({
				el: two,
				translateY: helpers.transition({
					from: 100,
					to: 50,
				}),
				height: '30px',
			}),
		])
		.start()
}

export class SequenceTimeline extends React.Component {
	componentDidMount() {
		animate('#one', '#two')
	}

	render() {
		return (
			<React.Fragment>
				<div id="one" style={boxStyles} />
				<div id="two" style={boxStyles} />
			</React.Fragment>
		)
	}
}
