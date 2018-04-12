import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringInterpolate extends React.Component {
	state = {
		rotate: 0,
		backgroundColor: '#4a79c4',
	}

	componentDidMount() {
		spring.animate({
			element: this.one,
			property: 'scale',
			options: {
				mapValues: {
					from: [0, 1],
					to: [1, 1.5],
				},
			},
			interpolate: (style, value, { mapValues, interpolateColor }) => {
				this.setState({
					rotate: mapValues(value, 1, 1.5, 0, 80),
					backgroundColor: interpolateColor(value, '#4a79c4', '#a8123a'),
				})
			},
		})
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					ref={one => (this.one = one)}
					onMouseUp={() => {
						spring.startWithVelocity({ value: 0, velocity: 2000 })
					}}
					onMouseDown={() => {
						spring.startWithVelocity({ value: 1, velocity: 1200 })
					}}
					style={{
						...boxStyles,
						transform: `rotate(${this.state.rotate}deg)`,
						backgroundColor: this.state.backgroundColor,
					}}
				/>
			</div>
		)
	}
}
