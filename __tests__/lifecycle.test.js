import mockEngine from 'engine-fork'

import { appendLifecycleHooks } from '../src/utils/lifecycle'
import { noop } from '../src/utils/noop'

const mockObj = mockEngine()

const hooks = {
  onStart: noop,
  onComplete: noop,
  onUpdate: noop,
  tick: noop
}

describe('Append lifecycle hooks', () => {
  it('should add lifecycle hooks to the main instance', () => {
    appendLifecycleHooks(mockObj, hooks)

    expect(typeof mockObj.begin).toBe('function')
    expect(typeof mockObj.update).toBe('function')
    expect(typeof mockObj.complete).toBe('function')
    expect(typeof mockObj.run).toBe('function')
  })
})
