// @flow

import invariant from 'invariant'

type moveArgs = number | Function

/**
 * Creates a function that moves/changes an animation position along its timeline.
 *
 * const seek = createMover(Animated: AnimationInstance)
 *
 * With a number value for animation time:
 * seek(120)
 *
 * With a callback function that returns an integer:
 * seek(({ progress }) => progress * 10)
 */
export const createMover = (instance: Object): Function => {
  invariant(
    instance !== undefined || instance !== null || instance === 'object',
    `Invalid timeline instance passed to createMover().`
  )

  const config = {
    // By default we sync the animation progress value with the user defined value.
    // TODO: There is a bug when synchronizing the engine time with the speed coefficient. We loose the current animation progress and hence animation starts again from the start point. So 'seek' will work though with varying speed but it won't synchronize with the current animation progress when speed coefficient's value is less than 0.6.
    default: (value: number | string): void =>
      instance.seek(instance.duration * (Number(value) / 100)),
    custom: (callback: Function): void => {
      invariant(
        typeof callback === 'function',
        `Expected callback to be a function instead got a ${typeof callback}.`
      )

      instance.seek(
        callback({
          duration: instance.duration,
          iterations: instance.iterations,
          progress: instance.progress,
          offset: instance.offset,
          delay: instance.delay,
          currentTime: instance.currentTime
        })
      )
    }
  }

  const seek = (arg: moveArgs): void => {
    invariant(
      typeof arg === 'number' ||
        typeof arg === 'function' ||
        typeof arg === 'string',
      `seek() expected a number or a callback function but instead got a ${typeof arg}`
    )

    if (typeof arg === 'number' || typeof arg === 'string') {
      return config.default(arg)
    } else if (typeof arg === 'function') {
      return config.custom(arg)
    }
  }

  return seek
}
