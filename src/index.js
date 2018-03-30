import { createCurve } from './utils/createCurve'
import { Keyframes } from './core/keyframes'
import { transition, times, startAfter, startBefore } from './utils/properties'
import { getEasings } from './utils/getEasings'
import { getTransforms } from './core/engine'
import { Timeline } from './core/timeline'
import { createMover } from './core/createMover'
import { Animate } from './components/Animate'

// Helpers can be shared across instances of Timeline and Playback components and are used in creating animation values. (from - to, changin color values, creating bezier curves, sequencing by a offset value)
export const helpers = {
  createCurve,
  transition,
  times,
  startAfter,
  startBefore,
  getEasings,
  getTransforms
}

export { Timeline, Keyframes, Animate, createMover }
