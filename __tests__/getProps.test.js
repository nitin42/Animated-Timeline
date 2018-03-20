import mockInstance from 'engine-fork'

import { getPropsFromMain } from '../src/utils/getProps'

describe('Get props', () => {
  it('Get callback props from the main instance', () => {
    const props = getPropsFromMain(mockInstance)

    expect(typeof props).toBe('object')
    expect(Object.keys(props).length).toBe(9)
    // Values are still undefined because we don't invoke the hooks here 😄
    expect(props).toMatchSnapshot()
  })
})
