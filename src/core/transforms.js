// @flow

import { filterArray, stringContains } from '../utils/engineUtils'

// Get the transform unit
export const getTransformUnit = (propName: string): void | string => {
  if (stringContains(propName, 'translate') || propName === 'perspective')
    return 'px'
  if (stringContains(propName, 'rotate') || stringContains(propName, 'skew'))
    return 'deg'
}

// Get the transform value (scale, transform, rotate)
export const getTransformValue = (
  el: HTMLElement,
  propName: string
): number | string => {
  // Get the default unit for transform
  const defaultUnit = getTransformUnit(propName)
  // Get the default value for transform
  const defaultVal = stringContains(propName, 'scale') ? 1 : 0 + defaultUnit
  // CSS transform string `scale(1)`, `transform(200)`, etc
  const str = el.style.transform
  if (!str) return defaultVal
  let match = []
  let props = []
  let values = []
  const rgx = /(\w+)\((.+?)\)/g
  while ((match = rgx.exec(str))) {
    props.push(match[1]) // Prop name `scale`
    values.push(match[2]) // Prop value `1`
  }
  // Get the value for corresponding propName (scale, transform)
  const value = values.filter((val, i) => props[i] === propName)
  // Transform value or return the default value
  return value.length ? value[0] : defaultVal
}

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
