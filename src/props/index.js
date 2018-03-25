// @flow

import { noop } from "../utils/noop";

import type { seekCtrl } from "../types";

export const defaultCommonProps = () => ({
  // controls for time-based execution
  start: false,
  stop: false,
  reverse: false,
  reset: false,
  restart: false,

  seek: (ctrl: seekCtrl) => ctrl.default(1),

  // Animation lifecycle
  lifecycle: {
    onUpdate: noop,
    onStart: noop,
    onComplete: noop,
    callFrame: noop
  }
});
