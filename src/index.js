import Engine from 'engine-fork'

import { createCurve } from './utils/createCurve'
import { hx } from './utils/nameToHex'
import { start } from './utils/fromTo'
import { Playback } from './components/Playback'
import { Timeline } from './components/Timeline'

export const Animated = {
  // Creates a bezier curve for custom easing
  createCurve,
  // Color to hex code
  hx,
  // Start an animation from a certain point
  start,
  // Playback animation component
  Playback,
  // Timeline based animations
  Timeline,
  // Changing the animation tempo
  velocity: Engine.speed,
  // Susped animation
  suspend: Engine.remove
}
