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
    play,
    pause,
    restart,
    reverse,
    reset,
  } = main

  const controller = {
    start: play,
    stop: pause,
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
