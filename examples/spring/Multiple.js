import React from 'react'

import { Spring } from '../../src'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 4, tension: 2 })

export class SpringMultiple extends React.Component {
  componentDidMount() {
    spring
      .animate({
        element: this.one,
        property: 'scale',
        options: {
          mapValues: {
            input: [0, 1],
            output: [1, 1.5]
          }
        }
      })
      .animate({
        element: this.two,
        property: 'rotate',
        options: {
          mapValues: {
            input: [0, 1],
            output: ['180deg', '360deg']
          }
        }
      })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div
          ref={(one) => (this.one = one)}
          onMouseUp={() => spring.setValue(0)}
          onMouseDown={() => spring.setValue(1)}
          style={boxStyles}
        />
        <div ref={(two) => (this.two = two)} style={boxStyles} />
      </div>
    )
  }
}
