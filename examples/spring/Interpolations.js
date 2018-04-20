import React from 'react'

import { Spring } from '../../src/spring'

import { boxStyles } from './../styles'

const spring = Spring({ friction: 15, tension: 3 })

const props = {
  property: 'border-radius',
  options: {
    mapValues: {
      input: [0, 1],
      output: ['3px', '40px']
    }
  }
}

export class SpringInterpolate extends React.Component {
  state = {
    translateX: '',
    backgroundColor: '#a8123a',
  }

  componentDidMount() {
    spring.animate({
      element: this.one,
      ...props,
      interpolate: (
        style,
        value,
        { mapValues, interpolateColor, rad, radians, em }
      ) => {
        this.handleInterpolations(value, {
          mapValues,
          interpolateColor,
          rad,
          radians,
          em
        })
      },
      shouldOscillate: true
    })
  }

  componentWillUnmount() {
    spring.remove()
  }

  handleInterpolations = (
    value,
    { mapValues, interpolateColor, rad, radians, em }
  ) => {
    this.setState({
      translateX: em(mapValues(value, 3, 40, 0, 1)),
      backgroundColor: interpolateColor(value, '#4a79c4', '#a8123a', 0, 60)
    })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div
          ref={(one) => (this.one = one)}
          onMouseUp={() => {
            spring.setValue(0)
          }}
          onMouseDown={() => {
            spring.setValue(1)
          }}
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
