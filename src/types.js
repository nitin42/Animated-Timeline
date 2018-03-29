// @flow

import * as React from "react";

// Animation engine instance
export type AnimationEngine = Object;

// Animation attributes
export type attributes = Object;

// Controls for time-based execution (start, stop, reverse, reset, restart)
export type ctrl = () => void;

// Time-based execution methods
export type controller = {
  start: ctrl,
  stop: ctrl,
  restart: ctrl,
  reverse: ctrl,
  reset: ctrl
};

// Props dispatched to lifecycle hooks
export type lifecycleHookProps = {
  completed: boolean,
  progress: number,
  duration: number,
  remaining: number,
  reversed: boolean,
  currentTime: number,
  began: boolean,
  paused: boolean,
  controller: controller
};

// Lifecycle hook type signature
export type fn = (props: lifecycleHookProps) => void;

// Animation lifecycle hooks
export type lifecycle = {
  onStart: fn,
  onUpdate: fn,
  onComplete: fn
};

// User defined callback that receives the instance of animation engine and returns a number input for seek method.
export type callback = (engine: AnimationEngine) => number;

// Default function for synchronizing the animation progress and input value.
export type defaultFn = (value: number | string) => void;

// Custom method (user defined) to change animation duration or progress value.
export type customFn = (cb: callback) => void;

// Timeline component props
export type TimelineProps = {
  start: boolean,
  stop: boolean,
  reset: boolean,
  restart: boolean,
  reverse: boolean,
  children?: React.Node,
  lifecycle: lifecycle
};

// Init flag is used when initialising the time-based controls when the component mounts
export type init = {
  init: boolean
};

// Basic animation component
export type Basic = {
  // Animation status flags
  start: boolean,
  stop: boolean,
  reset: boolean,
  restart: boolean,
  reverse: boolean,

  // Children nodes
  children?: React.Node,

  // Change animation time dynamically
  setTime: (number | string) | customFn,

  // Animation lifecycle
  lifecycle: lifecycle,

  // Autoplay the animation
  autoplay: boolean,

  // Animation attributes
  attributes: Object
};
