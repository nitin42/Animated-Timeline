import engine from 'engine-fork'
import invariant from 'invariant'

// Creates a custome easing function using the bezier curve control points
// https://github.com/gre/bezier-easing
export function createCurve(name, points) {
  invariant(
    typeof name === 'string',
    `Expected easing curve name to be a string instead got a ${typeof name}.`
  )

  invariant(
    Array.isArray(points),
    `Expected points to be an array instead got a ${typeof points}.`
  )

  engine.easings[name] = engine.bezier(points[0], points[1], points[2], points[3])

  return name
}
