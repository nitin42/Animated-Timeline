import invariant from 'invariant'

// Inspired by https://github.com/mattdesl/keyframes
export function Keyframes() {
  // Store keyframes for each property
  this.frames = []
}

Keyframes.prototype.add = function (values) {
  invariant(
    typeof values === 'object',
    `Expected values to be an object instead got a ${typeof values}.`
  )

  this.frames.push(values)
  return this
}
