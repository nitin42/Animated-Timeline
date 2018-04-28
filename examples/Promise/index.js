import React from 'react'

import { boxStyles } from '../styles'

import { Timeline, helpers } from '../../src'

const t = Timeline({
	speed: 1,
	iterations: 1,
	direction: 'alternate',
	easing: 'easeInOutSine',
	speed: 0.25,
})

export class PromiseAPI extends React.Component {
	componentDidMount() {
		t
			.animate({
				scale: helpers.transition({
					from: 2,
					to: 1,
				}),
			})
			.start()

		t.onfinish.then(res => console.log(res))
	}

	cancelAnimation = () => t.oncancel('#one').then(res => console.log(res))

	render() {
		return <t.div style={boxStyles} id="one" onClick={this.cancelAnimation} />
	}
}
