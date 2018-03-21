import React from 'react'
import engine from 'engine-fork'
import invariant from 'invariant'

import { appendLifecycleHooks } from '../utils/lifecycle'
import { noop } from '../utils/noop'
import { getPropsFromMain } from '../utils/getProps'
import { createSeekConfig } from '../utils/seek'

export class Timeline {
  constructor(attributes) {
    this.attributes = attributes || {}

    // Changes animation speed for all the elements
    this.speed = this.attributes.speed || 1

    // We use .play() to start the animation, so disable autoplay.
    if (!this.attributes.autoplay) {
      this.attributes.autoplay = false
    }

    this.inst = engine.timeline({ ...this.attributes })

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

    // This components represents the current timeline of an animation.
    // It is used to control the animation (play, pause, reverse, restart).
    // We can also manage the animation lifecycle using this component.
    class TimelineSync extends React.Component {
      static defaultProps = {
        // These values also exists on the main Animate instance as methods
        seek: ctrl => ctrl.default(noop),

        lifecycle: {
          onUpdate: noop,
          onStart: noop,
          onComplete: noop,
          tick: noop,
        },
      }

      componentDidMount = () => {
        const { start, stop, reset, restart, reverse } = this.props

        start && main.start()
        stop && main.stop()
        reset && main.reset()
        restart && main.restart()
        reverse && main.reverse()

        if (this.props.lifecycle) {
          appendLifecycleHooks(main, this.props.lifecycle)
        }
      }

      componentDidUpdate() {
        // These utilities are usable only when the input is updated.
        // But they are also available as methods on the main instance.
        // Invoking them early (or in componentDidMount) won't have any effect because we haven't collected the elements to animate.
        const { start, stop, reset, restart, reverse } = this.props

        start && main.start()
        stop && main.stop()
        reset && main.reset()
        restart && main.restart()
        reverse && main.reverse()

        if (this.props.seek) {
          const config = createSeekConfig(main, props)

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
