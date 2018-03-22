// @flow

import * as React from 'react'

import engine from 'engine-fork'
import invariant from 'invariant'

import { appendLifecycleHooks } from '../utils/lifecycle'
import { noop } from '../utils/noop'
import { getPropsFromMain } from '../utils/getProps'

import type { attributes, AnimationEngine, lifecycle } from '../types'

// User defined callback that receives the instance of animation engine and returns a number input for seek method.
type callback = (engine: AnimationEngine) => number

// Default function for synchronizing the animation progress and input value.
type defaultFn = (value: number | string) => void

// Custom method (user defined) to change animation duration or progress value.
type customFn = (cb: callback) => void

// Seek config (for changing the animation progress or duration time)
type seekCtrl = {
  default: defaultFn,
  custom: customFn,
}

// Seek function as prop on Timeline component
type seekFn = (ctrl: seekCtrl) => void

// Timeline component props
type TimelineProps = {
  start: boolean,
  stop: boolean,
  reset: boolean,
  restart: boolean,
  reverse: boolean,
  // Can be used to wrap children (optional) or placed anywhere in the tree.
  children?: React.Node,
  seek: seekFn,
  lifecycle: lifecycle,
}

/**
Timeline component is used to create sequencing animations with control time-based execution capabilities.
The Timeline class takes the animation attributes and instantiates a new timeline object which provides two helpers, 'Animated' and 'AnimationTimeline'.

'Animated' is the main instance which collects all the values to animate a single or a group elements. It also provides simple start/stop, reverse, reset and restart methods to control time-based execution of animation. It supports chaining of values when animating multiple elements via .value({}).

On the other hand, 'AnimationTimeline' is a React component which represents the timeline of an animation. It is used to manage the lifecycle of the current animation and also accepts props to dynamically start, stop, reverse, reset, restart and change the animation's current time.
*/
export class Timeline {
  attributes: attributes
  speed: number | string
  inst: AnimationEngine

  constructor(attributes: attributes) {
    this.attributes = attributes || {}

    // Changes animation speed for all the elements
    this.speed = this.attributes.speed || 1

    // We use .play() to start the animation, so disable autoplay.
    if (!this.attributes.autoplay) {
      this.attributes.autoplay = false
    }

    this.inst = engine.timeline({ ...this.attributes })

    // We calculate the engine time by using the speed coefficient and hence set the animation instance time in the 'frame' loop
    this.inst.speed = this.speed

    this.assignProps()
  }

  assignProps = () => {
    // We still reuse the old properties in `engine-fork` dependency so it isn't safe to delete them.
    this.inst['value'] = this.inst['add']
    this.inst['start'] = this.inst['play']
    this.inst['stop'] = this.inst['pause']
  }

  createTimelineSyncComp = () => {
    let main = this.inst

    const props = getPropsFromMain(main)

    class TimelineSync extends React.Component<TimelineProps> {
      static defaultProps = {
        start: false,
        stop: false,
        reset: false,
        restart: false,
        reverse: false,

        seek: (ctrl: seekCtrl) => ctrl.default(1),

        lifecycle: {
          onUpdate: noop,
          onStart: noop,
          onComplete: noop,
          tick: noop,
        },
      }

      componentDidMount = () => {
        if (this.props.lifecycle) {
          appendLifecycleHooks(main, this.props.lifecycle)
        }
      }

      componentDidUpdate = () => {
        // These utilities are usable only when the inputs are updated.
        // But they are also available as methods on the main instance.
        // Invoking them early (or in componentDidMount) won't have any effect because we haven't collected the elements to animate (children length is 'zero')
        if (this.props.start) {
          main.start()
        }

        if (this.props.stop) {
          main.stop()
        }

        if (this.props.reset) {
          main.reset()
        }

        if (this.props.restart) {
          main.restart()
        }

        if (this.props.reverse) {
          main.reverse()
        }

        if (this.props.seek) {
          const config = {
            // By default we sync the animation progress value with the user defined value.
            // TODO: There is a bug when synchronizing the engine time with the varying speed. We loose the current animation progress and hence animation starts again from the start point. So 'seek' will work though with varying speed but it won't synchronize with the current animation progress when speed coefficient's value is not 1.
            default: (value: number | string) =>
              main.seek(main.duration * (Number(value) / 100)),
            custom: (callback: Function) => {
              invariant(
                typeof callback === 'function',
                `Expected callback to be a function instead got a ${typeof callback}.`
              )
              // Also pass the animation engine instance to the user defined callback
              main.seek(callback(props))
            },
          }

          this.props.seek(config)
        }
      }

      render = () => {
        // TimelineSync component can be present anywhere in the tree, so either render nothing or wrap the childrens.
        return this.props.children || null
      }
    }

    return TimelineSync
  }

  init = () => {
    return {
      // Animate is the main object which will collect values for animating the nodes
      // Properties supported on Animate - (play, pause, restart, reverse)
      Animated: this.inst,
      // React component that represents the animation timeline
      AnimationTimeline: this.createTimelineSyncComp(),
    }
  }
}
