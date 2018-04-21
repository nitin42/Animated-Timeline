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
          input: [0, 1],
          output: [1, 1.5]
        }
      }
    })

    spring.onRest = inst => spring.infinite(0, 1, 2000)

    spring.onStart = inst => console.log('Motion started...')
  }

  componentWillUnmount() {
    spring.remove()
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div
          ref={one => (this.one = one)}
          onMouseUp={() => spring.setValue(0)}
          onMouseDown={() => spring.setValue(1)}
          style={boxStyles}
        />
      </div>
    )
  }
}
