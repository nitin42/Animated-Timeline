import React from 'react'

import { Spring } from '../../src'

import { boxStyles } from './../styles'

const spring = Spring({ bounciness: 26, speed: 4 })

export class SpringSystem extends React.Component {
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
          onMouseUp={() => spring.setValue(0)}
          onMouseDown={() => spring.setValue(1)}
          style={boxStyles}
        />
      </div>
    )
  }
}
