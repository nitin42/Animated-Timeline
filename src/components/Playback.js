import React from 'react'
import Engine from 'engine-fork'

import { noop } from '../utils/noop'

export class Playback extends React.Component {
  ctrl = null
  nodes = []
  targets = []

  static defaultProps = {
    lifecycle: {
      update: noop,
      start: noop,
      done: noop,
      draw: noop,
      delay: noop
    },
    autoplay: false,
    loop: false,
    rotate: ''
  }

  componentDidMount() {
    const { rotate, ...rest } = this.props.attributes

    this.ctrl = Engine({
      // Resolve this using the children by traversing them and adding them here as nodes using the unique ref
      nodes: !this.props.targets ? this.targets : this.props.targets,
      autoplay: this.props.autoplay,
      ...this.props.lifecycle,
      loop: this.props.loop,
      ...rest,
      rotate: `${rotate}turn`,
    })

    this.resolveChildren()
  }

  addTarget = newTarget => {
    this.targets = [...this.targets, newTarget]
  }

  resolveChildren() {
    let { children } = this.props

    if (!Array.isArray(children)) {
      children = [children]
    }

    return children.map((child, i) =>
      React.cloneElement(child, { key: i, ref: this.addTarget })
    )
  }

  componentDidUpdate() {
    if (this.props.play) this.ctrl.play()
    if (this.props.pause) this.ctrl.pause()
    if (this.props.seek) {
      const obj = {
        default: (value) => {
          this.ctrl.seek(this.ctrl.duration * (value / 100))
        },
        custom: (fn) => {
          this.ctrl.seek(fn())
        }
      }

      this.props.seek(obj)
    }
  }

  render() {
    return this.resolveChildren()
  }
}
