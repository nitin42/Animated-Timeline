import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringBlend extends React.Component {
  componentDidMount() {
    s.animate({
      property: 'backgroundColor',
      blend: {
        colors: ['#4a79c4', '#a8123a'],
        range: [0, 200]
      }
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <s.div
          style={boxStyles}
          onMouseUp={() => s.setValue(20)}
          onMouseDown={() => s.setValue(140)}
        />
      </div>
    )
  }
}
