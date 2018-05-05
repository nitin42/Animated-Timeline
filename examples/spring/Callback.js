import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringCallback extends React.Component {
  componentDidMount() {
    s.animate({
      property: 'scale',
      map: {
        inputRange: [0, 1],
        outputRange: [1, 1.5]
      }
    })

    s.onRest = (inst) => s.infinite(0, 1, 2000)

    s.onStart = (inst) => console.log('Motion started...')
  }

  componentWillUnmount() {
    s.remove()
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
