import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
	direction: 'alternate',
	speed: 0.7,
	easing: 'easeInOutSine',
	iterations: Infinity,
})

const one = React.createRef()

const two = React.createRef()

const animate = () => {
	t
		.sequence([
			t.animate({
				el: one.current,
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
				el: two.current,
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
		animate()
	}

	render() {
		return (
			<React.Fragment>
				<div ref={one} style={boxStyles} />
				<div ref={two} style={boxStyles} />
			</React.Fragment>
		)
	}
}
