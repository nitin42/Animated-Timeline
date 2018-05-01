import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringStart extends React.Component {
  componentDidMount() {
    s
      .animate({
        property: 'scale',
        map: {
          input: [0, 1],
          output: [1, 1.5]
        }
      })
      .startAt(1)
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <s.div style={boxStyles} />
      </div>
    )
  }
}
