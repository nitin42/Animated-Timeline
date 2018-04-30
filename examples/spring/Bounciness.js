import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const spring = Spring({ bounciness: 26, speed: 4 })

export class SpringBounciness extends React.Component {
  state = {
    rotate: '0deg',
    translateX: ''
  }

  componentDidMount() {
    spring.animate({
      property: 'scale',
      mapValues: {
        input: [0, 1],
        output: [1, 1.5]
      },
      interpolate: (style, value, options) =>
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
    spring.remove()
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <spring.div
          onMouseUp={() => spring.setValue(0)}
          onMouseDown={() => spring.setValue(1)}
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
