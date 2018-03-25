// @flow

import invariant from "invariant";

// Animation attributes
type attributes = Object;

type keyframes = Array<attributes>;

// Inspired by https://github.com/mattdesl/keyframes
export function Keyframes() {
  // Store keyframes for each property
  this.frames = [];
}

Keyframes.prototype.value = function(values: attributes): keyframes {
  invariant(
    typeof values === "object",
    `Expected values to be an object instead got a ${typeof values}.`
  );

  this.frames.push(values);

  // Allow chaining of multiple values
  return this;
};
