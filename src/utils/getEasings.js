import { easings } from '../core'

export const getEasings = () => {
  const names = []

  Object.keys(easings).forEach(easing => names.push(easing))

  return names
}
