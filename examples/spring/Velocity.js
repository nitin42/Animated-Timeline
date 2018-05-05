import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringVelocity extends React.Component {
  componentDidMount() {
    s.animate({
      property: 'scale',
      map: {
        inputRange: [0, 1],
        outputRange: [1, 1.5]
      }
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <s.div
          onMouseUp={() => s.setValueVelocity({ value: 0, velocity: 20 })}
          onMouseDown={() =>
            s.setValueVelocity({ value: 1, velocity: 30 })
          }
          style={boxStyles}
        />
      </div>
    )
  }
}
