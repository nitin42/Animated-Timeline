// @flow

import type { AnimationEngine, lifecycle } from '../types'

// Below are the props that a lifecycle hook receives:
// {
//   // Animation completed or not
//   completed: Boolean,
//
//   // Current progress of animation
//   progress: Number,
//
//   // Time taken
//   duration: Number,
//
//   // Remaining loops
//   remaining: Number,
//
//   // Is reversed?
//   reversed: Boolean,
//
//   // Current time in the frame
//   currentTime: Number,
//
//   // Has begin?
//   began: Boolean,
//
//   // Is paused?
//   paused: Boolean,
//
//   // Controller to start, stop, reverse and restart the animation again
//   controller: {
//     start: Function
//     stop: Function,
//     restart: Function,
//     reset: Function,
//     reverse: Function
//   }
// }

// Append animation lifecycle hooks to the main instance of animation engine.
export const appendLifecycleHooks = (
  instance: AnimationEngine,
  lifecycle: lifecycle
): void => {
  if (lifecycle.onStart) {
    // Invoked when the animation has started
    // If there is any delay, it will be invoked after that delay timeout
    instance.onStart = lifecycle.onStart
  }

  if (lifecycle.onUpdate) {
    // This is invoked whenever a new update is performed. Eg - Using 'seek' or 'events' or 'state updates'
    instance.onUpdate = lifecycle.onUpdate
  }

  if (lifecycle.onComplete) {
    // This is fired when the animation is completed
    instance.onComplete = lifecycle.onComplete
  }
}
