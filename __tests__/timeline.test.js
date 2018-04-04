import { Timeline } from '../src'

describe('Timeline', () => {
  it('Should create a timeline instance', () => {
    const props = {
      delay: 200,
      direction: 'alternate',
      speed: 0.2,
      duration: 1000
    }

    const timeline = Timeline(props)

    expect(typeof timeline).toEqual('object')
    expect(timeline).toMatchSnapshot()
    expect(timeline.delay).toBe(200)
    expect(timeline.direction).toBe('alternate')
  })
})
