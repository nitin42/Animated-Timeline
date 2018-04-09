import React from 'react'

import { createSpring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = createSpring(4, 2)

export class SpringSystem extends React.Component {
	state = {
		scale: 1,
		value: 0,
	}

	componentDidMount() {
		spring.animate('#one', this.state.scale, 'scale', {
      mapValues: {
        from: [0, 1],
        to: [1, 1.5]
      }
    }, this.update)
  }
  
  update = (style, val, { mapValues, interpolateColor }) => {
    val = mapValues(val, 1, 1.5, 180, 360)
    style.transform = `rotate(${val}deg)`
    val = mapValues(val, 180, 360, 10, 20)
    val = mapValues(val, 10, 20, 1, 3)
    val = interpolateColor(val, '#baed9e', '#f28ec2')
    style.backgroundColor = val    
  }

	handleChange = e => {
		spring.seek(e.target.value)

		this.setState({
			value: e.target.value,
		})
	}

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					id="one"
					onMouseUp={() => {
						spring.setValue(0)
					}}
					onMouseDown={() => {
						spring.setValue(1)
					}}
					style={boxStyles}
				/>
				{/* <input type="range" min="0" max="50" value={this.state.value} onChange={this.handleChange} /> */}
			</div>
		)
	}
}
