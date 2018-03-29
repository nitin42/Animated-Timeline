// @flow

import { easings } from "../core/easing";

type easing = string;

type easingNames = Array<easing>;

export const getEasings = (): easingNames => {
  const names = [];

  Object.keys(easings).forEach((easing: easing) => names.push(easing));

  return names;
};
