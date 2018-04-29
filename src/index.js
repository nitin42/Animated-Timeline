import { createEasingCurve } from './utils/createEasingCurve'
import { Keyframes } from './core/keyframes'
import { transition, times, startAfter, startBefore } from './utils/properties'
import { getAvailableEasings } from './utils/getEasings'
import { getAvailableTransforms } from './core/engine'
import { Timeline as createTimeline } from './core/timeline'
import { createMover } from './core/createMover'
import { Animate } from './components/Animate'
import { Spring } from './spring'

// Helpers can be shared across instances of Timeline and Playback components (from - to, changing color values, creating bezier curves, sequencing by a offset value)
export const helpers = {
  createEasingCurve,
  transition,
  times,
  startAfter,
  startBefore,
  getAvailableEasings,
  getAvailableTransforms
}

export { createTimeline, Keyframes, Animate, createMover, Spring }
