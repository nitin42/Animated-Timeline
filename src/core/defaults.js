// @flow

import type { AnimationEngine } from '../types'

type dummy = (inst: AnimationEngine) => void

type defaultInstanceParams = {
  onUpdate: dummy,
  onComplete: dummy,
  onStart: dummy,

  // Change this to iterations
  iterations: number | string,
  direction: string,
  autoplay: boolean,
  offset: number
}

type defaultTweensParams = {
  duration: number,
  delay: number,
  easing: string,
  elasticity: number,
  round: number
}

const noop = (inst: AnimationEngine): void => {}

export const getDefaultInstanceParams = (): defaultInstanceParams => ({
  onUpdate: noop,
  onComplete: noop,
  onStart: noop,

  iterations: 1,
  direction: 'normal',
  autoplay: true,
  offset: 0
})

export const getDefaultTweensParams = (): defaultTweensParams => ({
  duration: 1000,
  delay: 0,
  easing: 'linear',
  elasticity: 500,
  round: 0
})

export const validTransforms = [
  'translateX',
  'translateY',
  'translateZ',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'scaleX',
  'scaleY',
  'scaleZ',
  'skewX',
  'skewY',
  'perspective'
]
