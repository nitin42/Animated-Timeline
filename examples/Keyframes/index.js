import React from 'react'

import { Timeline, Keyframes, helpers } from '../../src'
import { boxStyles } from '../styles'

const t = Timeline({
	easing: 'easeInOutSine',
	direction: 'alternate',
})

const x = new Keyframes()
	.add({
		value: 50,
		duration: 1000,
	})
	.add({
		value: 90,
		duration: 2000,
		offset: 0.8,
	})
	.add({
		value: 0,
		duration: 3000,
	})

export class KeyframesExample extends React.Component {
	componentDidMount() {
		t
			.animate({
				translateX: x.frames,
			})
			.start()

			console.log(t)

	}

	render() {
		return <t.div style={boxStyles} />
	}
}
