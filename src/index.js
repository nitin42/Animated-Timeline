import { createCurve } from './utils/createCurve'
import { hx } from './utils/nameToHex'
import { Keyframes } from './utils/keyframes'
import { start, times, startAfter, startBefore } from './utils/properties'
import { Timeline } from './components/Timeline'

// Helpers can be shared across instances of Timeline and Playback components and are used in creating animation values. (from - to, changin color values, creating bezier curves, sequencing by a offset value)
export const helpers = {
  createCurve,
  hx,
  start,
  times,
  startAfter,
  startBefore
}

export {
  Timeline,
  Keyframes,
}
