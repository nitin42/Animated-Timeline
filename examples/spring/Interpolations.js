import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 15, tension: 3 })

export class SpringInterpolate extends React.Component {
  state = {
    translateX: '',
    backgroundColor: '#a8123a'
  }

  componentDidMount() {
    s.animate({
      property: 'border-radius',
      map: {
        inputRange: [0, 1],
        outputRange: ['1px', '40px']
      },
      interpolation: (style, value, options) =>
        this.handleInterpolations(value, options),
      shouldOscillate: true
    })
  }

  componentWillUnmount() {
    s.remove()
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
        <s.div
          onMouseUp={() => s.setValue(0)}
          onMouseDown={() => s.setValue(1)}
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
