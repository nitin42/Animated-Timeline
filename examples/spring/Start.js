import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringStart extends React.Component {
	componentDidMount() {
		spring.animate({
			element: this.one,
			property: 'scale',
			options: {
				mapValues: {
					from: [0, 1],
					to: [1, 1.5],
				},
			}
		}).startAt(1)
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					ref={one => (this.one = one)}
					style={boxStyles}
				/>
			</div>
		)
	}
}
