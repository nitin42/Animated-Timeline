// @flow

import type { AnimationEngine, lifecycleHookProps } from '../types'

export const getPropsFromMain = (main: AnimationEngine): lifecycleHookProps => {
  const {
    completed,
    progress,
    duration,
    remaining,
    reversed,
    currentTime,
    began,
    paused,
    start,
    stop,
    restart,
    reverse,
    reset,
  } = main

  const controller = {
    start,
    stop,
    restart,
    reverse,
    reset,
  }

  return {
    completed,
    progress,
    duration,
    remaining,
    reversed,
    currentTime,
    began,
    paused,
    controller,
  }
}
