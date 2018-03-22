// @flow

// Animation engine instance
export type AnimationEngine = Object

// Animation attributes
export type attributes = Object

// Controls for time-based execution (start, stop, reverse, reset, restart)
export type ctrl = () => void

// Time-based execution methods
export type controller = {
  start: ctrl,
  stop: ctrl,
  restart: ctrl,
  reverse: ctrl,
  reset: ctrl,
}

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
  controller: controller,
}

// Lifecycle hook signature
export type fn = (props: lifecycleHookProps) => void

// Animation lifecycle hooks
export type lifecycle = {
  onStart: fn,
  tick: fn,
  onUpdate: fn,
  onComplete: fn,
}
