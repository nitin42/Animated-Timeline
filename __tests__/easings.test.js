import { helpers } from '../src'

const { getAvailableEasings, createCurve } = helpers

describe('Easings', () => {
  it('Should return array of easings name available', () => {
    const easings = getAvailableEasings()

    expect(Array.isArray(easings)).toBe(true)
    // Considering we haven't created a new easing curve
    expect(easings.length).toBe(28)
  })
})
