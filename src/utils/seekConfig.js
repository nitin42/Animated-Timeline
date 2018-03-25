// @flow

import invariant from "invariant";

import type { AnimationEngine, lifecycleHookProps, seekCtrl } from "../types";

export const seekConfig = (
  instance: AnimationEngine,
  callbackProps: lifecycleHookProps
): seekCtrl => ({
  // By default we sync the animation progress value with the user defined value.
  // TODO: There is a bug when synchronizing the engine time with the speed coefficient. We loose the current animation progress and hence animation starts again from the start point. So 'seek' will work though with varying speed but it won't synchronize with the current animation progress when speed coefficient's value is less than 0.6.
  default: value => instance.seek(instance.duration * (Number(value) / 100)),
  custom: callback => {
    invariant(
      typeof callback === "function",
      `Expected callback to be a function instead got a ${typeof callback}.`
    );
    // Also pass the animation engine instance to the user defined callback
    instance.seek(callback(callbackProps));
  }
});
