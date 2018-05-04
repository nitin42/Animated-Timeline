// @flow

import invariant from 'invariant'

import { createTimeline } from './engine'

/**
 * Creates a new 'Animated' instance with timeline properties (delay, duration, iterations) and bridges both the models,
 * Animation and Timeline. 'Animated' is then used to collect the animatable properties or can be chained for performing sequence
 * based animation or offset based animations similar to web animation API
 *
 * Eg-
 *
 * const Animated = createTimeline({
 *    ...timelineprops
 * })
 *
 * Animated.value({ ...animationprops })
 */

export const Timeline = (timingProps: Object): Object => {
  timingProps = timingProps || {}

  return createTimeline(timingProps)
}
