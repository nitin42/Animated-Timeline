// @flow

import { bezier, easings } from "../core";
import invariant from "invariant";

type curveName = "string";

type controlPoints = Array<number> | Array<string>;

// Creates a custome easing function using the bezier curve control points
// https://github.com/gre/bezier-easing
export function createCurve(name: curveName, points: controlPoints): curveName {
  invariant(
    typeof name === "string",
    `Expected easing curve name to be a string instead got a ${typeof name}.`
  );

  invariant(
    Array.isArray(points),
    `Expected points to be an array instead got a ${typeof points}.`
  );

  easings[name] = bezier(points[0], points[1], points[2], points[3]);

  return name;
}
