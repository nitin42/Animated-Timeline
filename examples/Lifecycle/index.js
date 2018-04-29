import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../src'

const t = createTimeline({
	speed: 1,
	iterations: 1,
	direction: 'alternate',
	easing: 'easeInOutSine',
	speed: 0.25,
})

export class Lifecycle extends React.Component {
	state = {
		value: 0,
	}

	componentDidMount() {
		t
			.animate({
				scale: helpers.transition({
					from: 2,
					to: 0.4,
				}),
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
		// Cancel the animation and clear all the subscriptions
		t.cancel()
	}

	render() {
		return (
			<t.div style={boxStyles}>
				<p style={{ textAlign: 'center' }}>{this.state.value}</p>
			</t.div>
		)
	}
}
