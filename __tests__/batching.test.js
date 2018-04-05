import { batchMutation, batchRead } from '../src/core/batchMutations'

describe('Batch style mutations', () => {
  it('should schedule a job at turn of next frame using rAF', () => {
    const mutation = (el) => el.style.transform = 'rotate(23.deg)'

    const el = {
      style: {
        transform: ''
      }
    }

    const writeId = batchMutation(() => mutation(el))

    expect(typeof writeId).toBe('function')
  })

  it('should schedule a job at turn of next frame using rAF', () => {
    const reads = (el) => el.style.transform

    const el = {
      style: {
        transform: 'scale(2)'
      }
    }

    const readId = batchRead(() => reads(el))

    expect(typeof readId).toBe('function')
  })
})
