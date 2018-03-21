import invariant from 'invariant'

// Create config for 'seek' method on main Animate instance
export const createSeekConfig = (main, props) => ({
  // By default we sync the animation progress value with the user defined value.
  default: value => main.seek(main.duration * (value / 100)),
  custom: callback => {
    invariant(
      typeof callback === 'function',
      `Expected callback to be a function instead got a ${typeof callback}.`
    )
    // Also pass the animation engine instance to the user defined callback
    main.seek(callback(props))
  },
})
