import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ bounciness: 26, speed: 4 })

export class SpringSystem extends React.Component {
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
          onMouseUp={() => s.setValue(0)}
          onMouseDown={() => s.setValue(1)}
          style={boxStyles}
        />
      </div>
    )
  }
}
