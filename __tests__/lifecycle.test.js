import { animated } from '../src/core'

import { appendLifecycleHooks } from '../src/utils/lifecycle'
import { noop } from '../src/utils/noop'

const mockInst = animated()

const hooks = {
  onStart: noop,
  onComplete: noop,
  onUpdate: noop,
  tick: noop
}

describe('Append lifecycle hooks', () => {
  it('should add lifecycle hooks to the main instance', () => {
    appendLifecycleHooks(mockInst, hooks)
    
    const { onStart, onUpdate, onComplete, callFrame } = mockInst

    expect(typeof onStart).toBe('function')
    expect(typeof onUpdate).toBe('function')
    expect(typeof onComplete).toBe('function')
    expect(typeof callFrame).toBe('function')
  })
})
