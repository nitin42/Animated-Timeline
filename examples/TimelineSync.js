import React, { Component } from 'react'

import { Animated } from '../src'

const boxStyles = { width: '200px', height: '200px', backgroundColor: 'pink' }

// Custom bezier curve can be created here - https://matthewlein.com/tools/ceaser
Animated.createCurve('ReactCurve', [0.05, -0.33, 0.15, -0.38])

const timeline = new Animated.Timeline({
  attributes: {
    direction: 'alternate',
    easing: 'ReactCurve',
    duration: 4000,
    delay: 2000,
  },
})

const { Animate, Timeline } = timeline.init()

export class TimelineSyncExample extends Component {
  componentDidMount() {
    Animate.values({
      nodes: this.one,
      translateX: Animated.start({ from: 500, to: 20 }),
      opacity: Animated.start({ from: 0.4, to: 0.9 }),
      backgroundColor: Animated.start({
        from: Animated.hx('cyan'),
        to: Animated.hx('red'),
      }),
      rotate: {
        value: 360,
        duration: 1800,
        easing: 'easeInOutSine',
      },
    })
      .values({
        nodes: this.two,
        translateX: Animated.start({ from: 500, to: 20 }),
        opacity: Animated.start({ from: 0.4, to: 0.9 }),
        backgroundColor: Animated.start({
          from: '#6bc4a5',
          to: Animated.hx('orange'),
        }),
        offset: 600,
        rotate: {
          value: 360,
          duration: 1800,
          easing: 'easeInOutSine',
        },
      })
      .values({
        nodes: this.three,
        translateX: 500,
        backgroundColor: Animated.hx('hot pink'),
        offset: 800,
        rotate: {
          value: 360,
          duration: 1800,
          easing: 'easeInOutSine',
        },
      })
      .play()
  }

  render() {
    return (
      <React.Fragment>
        <Timeline
          lifecycle={{
            complete: ({ controller }) => {
              console.log('Done..')
            },
            start: inst => {},
            update: this.props.update,
            frame: inst => {},
          }}
          play={this.props.play}
          pause={!this.props.play}
          seek={ctrl => ctrl.default(this.props.value)}
        />
        <div ref={one => (this.one = one)} style={boxStyles} />
        <br />
        <div ref={two => (this.two = two)} style={boxStyles} />
        <br />
        <div
          className="three"
          ref={three => (this.three = three)}
          style={boxStyles}
        />
        <button
          onClick={e => Animate.restart()}
          style={{ border: '2px solide pink', padding: '2px' }}
        >
          Replay
        </button>
        <button
          onClick={e => Animate.reverse()}
          style={{ border: '2px solide pink', padding: '2px' }}
        >
          Reverse
        </button>
      </React.Fragment>
    )
  }
}
