import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringInterpolate extends React.Component {
	state = {
		rotate: 0,
		backgroundColor: '#a8123a',
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
					rotate: mapValues(value, 1, 1.5, 0, 120),
					backgroundColor: interpolateColor(value, '#4a79c4', '#a8123a', 20, 120),
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
						spring.setValueVelocity({ value: 0, velocity: 10 })
					}}
					onMouseDown={() => {
						spring.setValueVelocity({ value: 1, velocity: 20 })
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
