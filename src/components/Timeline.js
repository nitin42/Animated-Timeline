// @flow

import * as React from "react";

import { createTimeline, animated } from "../core";

import invariant from "invariant";

import { appendLifecycleHooks } from "../utils/lifecycle";
import { noop } from "../utils/noop";
import { getPropsFromMain } from "../utils/getProps";
import { timeBasedExecMethods } from "../utils/methods";
import { defaultCommonProps, defaultPropTypes } from "../props";

import type { attributes, AnimationEngine, TimelineProps } from "../types";

// Timeline component is used to create sequencing animations with controls for time-based execution
// capabilities. The Timeline class takes the animation attributes and instantiates a new timeline
// object which returns two helpers, 'Animated' and 'AnimationTimeline', when calling the instance method init() on i.
// 'Animated' is the main instance which collects all the values to animate a single or a group elements. It also provides
// simple start/stop, reverse, reset and restart methods to control time-based execution of animation.
// It supports chaining of values when animating multiple elements via .value({}).

// On the other hand, 'AnimationTimeline' is a React component which represents the timeline of an
// animation. It is used to manage the lifecycle of the current animation and also accepts props to
// dynamically start, stop, reverse, reset, restart and change the animation's current time.

export class Timeline {
  attributes: attributes;
  speed: number | string;
  inst: AnimationEngine;

  constructor(attributes: attributes) {
    this.attributes = attributes || {};

    // Changes the animation speed for all the elements bounded to the same instance
    this.speed = this.attributes.speed || 1;

    this.inst = createTimeline({ ...this.attributes });

    // We calculate the engine time by using the speed coefficient and hence set the animation instance time in the 'frame' loop
    this.inst.speed = this.speed;
  }

  createTimelineSyncComp = () => {
    const main = this.inst;

    const callbackProps = getPropsFromMain(main);

    class TimelineSync extends React.Component<TimelineProps> {
      static defaultProps = {
        ...defaultCommonProps()
      };

      static propTypes = {
        ...defaultPropTypes()
      };

      componentDidMount = () => {
        if (this.props.lifecycle) {
          appendLifecycleHooks(main, this.props.lifecycle);
        }

        timeBasedExecMethods(main, this.props, callbackProps, { init: true });
      };

      componentDidUpdate = () => {
        // Invoke controls for time-based execution methods
        timeBasedExecMethods(main, this.props, callbackProps, { init: false });
      };

      render = () => {
        // TimelineSync component can be present anywhere in the tree, so either render nothing or wrap the children
        return this.props.children || null;
      };
    }

    return TimelineSync;
  };

  // Initialise the timeline
  init = () => {
    return {
      // Animate is the main object which is used to collect values for animating the elements using refs or selectors
      // Properties supported on Animate - (play, pause, restart, reverse)
      Animated: this.inst,
      // React component that represents the animation timeline
      AnimationTimeline: this.createTimelineSyncComp()
    };
  };
}
