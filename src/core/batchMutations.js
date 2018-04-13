// @flow

import fastdom from 'fastdom'

type id = Function | null

// Style updates
let writeId = null

// Style reads
let readId = null

// Scheduled jobs are stored in the queues which are emptied at the turn of next frame using rAF. This helps in reducing recalcs/sec and speed up the animation performance.

// Batch style mutations
export const batchMutation = (mutation: Function): id => {
  writeId = fastdom.mutate(() => {
    return mutation()
  })

  return writeId
}

// Batch style reads
export const batchRead = (reads: Function): id => {
  readId = fastdom.measure(() => {
    return reads()
  })

  return writeId
}

// In case we don't have the current node on which the mutations were applied, catch the exceptions.
export const exceptions = () => {
  fastdom.catch = error => {
    console.error(error)
  }
}

// Clear the scheduled jobs
export const emptyScheduledJobs = () => {
  fastdom.clear(readId)
  fastdom.clear(writeId)
}
