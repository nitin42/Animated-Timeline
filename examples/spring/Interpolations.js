import React from 'react'

import { Spring } from '../../src'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 15, tension: 3 })

export class SpringInterpolate extends React.Component {
  state = {
    translateX: '',
    backgroundColor: '#a8123a'
  }

  componentDidMount() {
    spring.animate({
      property: 'border-radius',
      options: {
        mapValues: {
          input: [0, 1],
          output: ['1px', '40px']
        }
      },
      interpolate: (style, value, options) =>
        this.handleInterpolations(value, options),
      shouldOscillate: true
    })
  }

  componentWillUnmount() {
    spring.remove()
  }

  handleInterpolations = (value, options) => {
    this.setState({
      translateX: options.em(options.mapValues(value, 3, 40, 0, 1)),
      backgroundColor: options.interpolateColor(
        value,
        '#4a79c4',
        '#a8123a',
        0,
        60
      )
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <spring.div
          onMouseUp={() => spring.setValue(0)}
          onMouseDown={() => spring.setValue(1)}
          style={{
            ...boxStyles,
            transform: `translateX(${this.state.translateX})`,
            backgroundColor: this.state.backgroundColor
          }}
        />
      </div>
    )
  }
}
