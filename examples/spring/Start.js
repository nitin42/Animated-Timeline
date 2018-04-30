import React from 'react'

import { Spring } from '../../src'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringStart extends React.Component {
  componentDidMount() {
    spring
      .animate({
        property: 'scale',
        options: {
          mapValues: {
            input: [0, 1],
            output: [1, 1.5]
          }
        }
      })
      .startAt(1)
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <spring.div style={boxStyles} />
      </div>
    )
  }
}
