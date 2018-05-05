import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringPromise extends React.Component {
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
          style={boxStyles}
          onMouseUp={() => s.setValue(0)}
          onMouseDown={() => s.setValue(1)}
        />
        <button onClick={() => s.oncancel().then(res => console.log(res))}>
          Cancel
        </button>
      </div>
    )
  }
}
