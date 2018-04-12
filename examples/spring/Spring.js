import React from 'react'

import { SpringSys } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = SpringSys(4, 2)

const spring2 = SpringSys(10, 2)

export class SpringSystem extends React.Component {
	state = {
		scale: 1,
		value: 0,
		rotate: '0deg',
		backgroundColor: '#f77499',
		translateX: 0,
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
			interpolate: (style, val, { mapValues, interpolateColor }) => {
				this.setState({
					rotate: `${mapValues(val, 1, 1.5, 180, 360)}deg`,
					translateX: mapValues(val, 1, 1.5, 15, 19),
					backgroundColor: interpolateColor(val, '#f77499', '#85c497'),
				})
			},
		})
		
		spring2.animate({
			element: this.two,
			property: 'rotate',
			options: {
				mapValues: {
					from: [0, 1],
					to: [0, 180]
				}
			},
      interpolate: (style, val, { mapValues, interpolateColor }) => {
        style.backgroundColor = interpolateColor(val, '#f77499', '#85c497', 0, 200)
      }
		})
		
		spring2.onRest = (spr) => {
			spring2.infinite(0, 1, 1000)
		}
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					id="one"
					ref={one => (this.one = one)}
					onMouseUp={() => {
						spring.setValue(0)
          }}
					onMouseDown={() => {
						spring.setValue(1)
					}}
					style={{
						...boxStyles,
						backgroundColor: this.state.backgroundColor,
						transform: `rotate(${this.state.rotate}) translateX(${this.state.translateX}px)`,
					}}
				>
        </div>
				<div
					ref={two => (this.two = two)}
					style={boxStyles}
					onMouseUp={() => spring2.setValue(0)}
					onMouseDown={() => spring2.setValue(1)}
				/>
				{/* <div id='three' style={boxStyles} /> */}
			</div>
		)
	}
}
