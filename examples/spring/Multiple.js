import React from 'react'

import { Spring } from '../../build/animated-timeline.min.js'

import { boxStyles } from './../styles'

const s = Spring({ friction: 4, tension: 2 })

export class SpringMultiple extends React.Component {
  constructor(props) {
    super(props)

    this.one = React.createRef()
    this.two = React.createRef()
  }

  componentDidMount() {
    s
      .animate({
        el: this.one.current,
        property: 'scale',
        map: {
          input: [0, 1],
          output: [1, 1.5]
        }
      })
      .animate({
        el: this.two.current,
        property: 'rotate',
        map: {
          input: [0, 1],
          output: ['180deg', '360deg']
        }
      })
  }

  render() {
    return (
      <div style={{ margin: '0 auto', width: '50%' }}>
        <div
          ref={this.one}
          onMouseUp={() => s.setValue(0)}
          onMouseDown={() => s.setValue(1)}
          style={boxStyles}
        />
        <div ref={this.two} style={boxStyles} />
      </div>
    )
  }
}
