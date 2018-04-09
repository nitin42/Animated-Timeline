// @flow

import invariant from 'invariant'

// Animation attributes
type attributes = Object

type keyframes = Array<attributes>

// API Inspired from https://github.com/mattdesl/keyframes
export function Keyframes() {
  this.frames = []
}

Keyframes.prototype.value = function(values: attributes): keyframes {
  invariant(
    typeof values === 'object',
    `Expected values to be an object instead got a ${typeof values}.`
  )

  this.frames.push(values)

  // Allow chaining of multiple values
  return this
}
