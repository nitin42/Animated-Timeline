import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringVelocity extends React.Component {
  componentDidMount() {
    spring.animate({
      property: 'scale',
      mapValues: {
        input: [0, 1],
        output: [1, 1.5]
      }
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <spring.div
          onMouseUp={() => spring.setValueVelocity({ value: 0, velocity: 20 })}
          onMouseDown={() =>
            spring.setValueVelocity({ value: 1, velocity: 30 })
          }
          style={boxStyles}
        />
      </div>
    )
  }
}
