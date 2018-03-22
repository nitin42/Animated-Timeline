// @flow

import type { AnimationEngine } from '../types'

// 'inst' is the animation engine instance
export const noop = (inst: AnimationEngine): AnimationEngine => inst
