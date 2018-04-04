import { helpers } from '../src'

const available_transforms = ["translateX", "translateY", "translateZ", "rotate", "rotateX", "rotateY", "rotateZ", "scale", "scaleX", "scaleY", "scaleZ", "skewX", "skewY", "perspective"]

describe('Available transforms', () => {
  it('should return an array of available transforms', () => {
    const transforms = helpers.getAvailableTransforms()

    expect(Array.isArray(transforms)).toBe(true)
    expect(transforms).toEqual(available_transforms)
  })
})
