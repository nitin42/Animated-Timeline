import { Keyframes } from '../src'

describe('Keyframes', () => {
  it('Should return array of frames', () => {
    const { frames } = new Keyframes()
      .add({
        value: 500,
        duration: 3000,
        elasticity: 900,
      })
      .add({ value: 1000, duration: 1000 })
      .add({
        value: 500,
        duration: 3000,
        elasticity: 900,
      })
      .add({ value: 1000, duration: 1000 })

    expect(Array.isArray(frames)).toBe(true)
    expect(frames).toMatchSnapshot()
  })
})
