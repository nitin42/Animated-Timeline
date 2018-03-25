import { seekConfig } from "./seekConfig";

import type {
  AnimationEngine,
  TimelineProps,
  BasicCompProps,
  lifecycleHookProps,
  init
} from "../types";

// Time based execution methods

export const timeBasedExecMethods = (
  instance: AnimationEngine,
  props: TimelineProps | BasicCompProps,
  callbackProps: lifecycleHookProps,
  { init }: init
): void => {
  if (props.start) instance.start();

  if (props.stop) instance.stop();

  if (props.reverse) instance.reverse();

  // 'reset' and 'restart' are only activated when the input value is updated (setState)
  if (!init) {
    if (props.reset) instance.reset();

    if (props.restart) instance.restart();
  }

  if (props.seek) {
    props.seek(seekConfig(instance, callbackProps));
  }
};
