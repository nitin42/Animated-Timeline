import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ bounciness: 26, speed: 4 })

export class SpringBounciness extends React.Component {
  state = {
    rotate: '0deg',
    translateX: ''
  }

  componentDidMount() {
    s.animate({
      property: 'scale',
      map: {
        inputRange: [0, 1],
        outputRange: [1, 1.5]
      },
      interpolation: (style, value, options) =>
        this.handleInterpolations(value, options),
      shouldOscillate: true
    })
  }

  handleInterpolations = (value, options) => {
    this.setState({
      translateX: options.em(options.mapValues(value, 1, 1.5, 0, 1)),
      rotate: options.deg(options.mapValues(value, 1, 1.5, 0, 360))
    })
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
          style={{
            ...boxStyles,
            transform: `translateX(${this.state.translateX}) rotate(${
              this.state.rotate
            })`
          }}
        />
      </div>
    )
  }
}
