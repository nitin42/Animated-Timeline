import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../src'

const t = createTimeline({
	direction: 'alternate',
	easing: 'easeInOutSine',
	iterations: Infinity,
})

export class Finish extends React.Component {
	componentDidMount() {
		t
			.animate({
				element: this.finish,
				scale: helpers.transition({
					from: 2,
					to: 1,
				}),
			})
			.start()
	}

	render() {
		return <div ref={finish => (this.finish = finish)} style={boxStyles} onClick={e => t.finish()} />
	}
}
