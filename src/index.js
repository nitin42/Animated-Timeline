import { createEasingCurve } from './utils/createEasingCurve'
import { Keyframes } from './core/keyframes'
import { transition, times, startAfter, startBefore } from './utils/properties'
import { getAvailableEasings } from './utils/getEasings'
import { getAvailableTransforms } from './core/engine'
import { Timeline } from './core/timeline'
import { createMover } from './core/createMover'
import { Animate } from './components/Animate'

// Helpers can be shared across instances of Timeline and Playback components and are used in creating animation values. (from - to, changin color values, creating bezier curves, sequencing by a offset value)
export const helpers = {
  createEasingCurve,
  transition,
  times,
  startAfter,
  startBefore,
  getAvailableEasings,
  getAvailableTransforms
}

export { Timeline, Keyframes, Animate, createMover }
