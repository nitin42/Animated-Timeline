// @flow

import PropTypes from "prop-types";

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

export const defaultPropTypes = () => ({
  start: PropTypes.bool,
  stop: PropTypes.bool,
  reverse: PropTypes.bool,
  reset: PropTypes.bool,
  restart: PropTypes.bool,

  seek: PropTypes.func,

  lifecycle: PropTypes.shape({
    onUpdate: PropTypes.func,
    onStart: PropTypes.func,
    onComplete: PropTypes.func,
    callFrame: PropTypes.func
  })
});
