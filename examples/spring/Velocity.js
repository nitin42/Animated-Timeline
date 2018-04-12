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
					from: [0, 1],
					to: [1, 1.5],
				},
			}
		})
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					ref={one => (this.one = one)}
					onMouseUp={() => {
						spring.startWithVelocity({ value: 0, velocity: 20 })
          }}
					onMouseDown={() => {
						spring.startWithVelocity({ value: 1, velocity: 10 })
					}}
					style={boxStyles}
				/>
			</div>
		)
	}
}
