import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringVelocity extends React.Component {
	componentDidMount() {
		spring.animate({
			element: this.one,
			property: 'scale',
			options: {
				mapValues: {
					input: [0, 1],
					output: [1, 1.5],
				},
			}
		})
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					ref={one => (this.one = one)}
					onMouseUp={() => spring.setValueVelocity({ value: 0, velocity: 20 })}
					onMouseDown={() => spring.setValueVelocity({ value: 1, velocity: 30 })}
					style={boxStyles}
				/>
			</div>
		)
	}
}
