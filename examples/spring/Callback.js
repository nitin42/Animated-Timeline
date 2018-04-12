import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringCallback extends React.Component {
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
    
    spring.onRest = (inst) => {
      // Run infinite times
      this.id = spring.infinite(0, 1, 2000)
		}
		
		spring.onStart = (inst) => {
			console.log('Motion started...')
		}
  }
  
  componentWillUnmount() {
    this.id && clearTimeout(this.id)
  }

	render() {
		return (
			<div style={{ margin: '0 auto', width: '50%' }}>
				<div
					ref={one => (this.one = one)}
					onMouseUp={() => {
						spring.setValue(0)
          }}
					onMouseDown={() => {
						spring.setValue(1)
					}}
					style={boxStyles}
				/>
			</div>
		)
	}
}
