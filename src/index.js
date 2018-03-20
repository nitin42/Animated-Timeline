import Engine from 'engine-fork'

import { createCurve } from './utils/createCurve'
import { hx } from './utils/nameToHex'
import { Keyframes } from './utils/keyframes'
import { start, times, startAfter, startBefore } from './utils/properties'
import { Playback } from './components/Playback'
import { Timeline } from './components/Timeline'

export const Animated = {
  createCurve,
  hx,
  start,
  times,
  startAfter,
  startBefore,
  Playback,
  Timeline,
  Keyframes,
  velocity: Engine.speed,
  suspend: Engine.remove
}
