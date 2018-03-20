import mockInstance from 'engine-fork'

import { createCurve } from '../src/utils/createCurve'

describe('Create bezier curve', () => {
  it('Should create a custom bezier curve with a name', () => {
    createCurve('SampleCurve', [0.21, 0.34, 0.45, -0.98])
    
    expect(typeof mockInstance.easings['SampleCurve']).toBe('function')
    expect(mockInstance.easings['SampleCurve']).toBeTruthy()
  })
})
