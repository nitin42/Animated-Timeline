import { animated } from '../src/core/engine'
import { easings } from '../src/core/easing'

import { createEasingCurve } from '../src/utils/createEasingCurve'

describe('Create bezier curve', () => {
  it('Should create a custom bezier curve with a name', () => {
    createEasingCurve('SampleCurve', [0.21, 0.34, 0.45, -0.98])

    expect(typeof easings['SampleCurve']).toBe('function')
    expect(easings['SampleCurve']).toBeTruthy()
  })
})
