## Changing the animation progress

You can change the animation progress (or duration) value using the `AnimationTimeline` component.

```js
import React, { Component } from "react";

import { Timeline, helpers } from "animated-timeline";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  duration: 2000
});

const { Animated, AnimationTimeline } = timeline.init();

class App extends Component {
  state = {
    value: 0
  };

  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      rotate: {
        value: 360,
        easing: "easeInOutSine"
      }
    });
  }

  handleChange = e => this.setState({ value: e.target.value });

  render() {
    return (
      <AnimationTimeline seek={ctrl => ctrl.default(this.state.value)}>
        <div
          ref={one => (this.one = one)}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "pink"
          }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </AnimationTimeline>
    );
  }
}
```

<p align="center">
  <img src="../media/basic-3.gif" />
</p>

`seek` prop accepts a function with an argument `ctrl`. `ctrl` is an object which is used to sync the animation progress value with the input value, in our case `this.state.value` is the input value. It provides two methods - `default` and `custom`.

* `default` - The default method accepts an input value which will be synced with the animation progress value automatically. This is the built-in, so you don't need to worry about it.

* `custom` - In some cases, you will need to sync the animation progress with a different offset. In those cases, you can pass a callback to the `custom` method like so -

```js
function callback({ progress }) {
  const value = 50
  const offset = 5

  return ((value * offset) * (progress / 100))
}

<AnimationTimeline seek={ctrl => ctrl.custom(callback)}>
```

<p align="center">
  <img src="../media/basic-8.gif" />
</p>

**Note** - The callback function should return a number value.

The callback function receives following parameters -

```js
{
  // Animation completed or not
  completed: Boolean,

  // Current progress of animation
  progress: Number,

  // Time taken
  duration: Number,

  // Remaining loops
  remaining: Number,

  // Is reversed?
  reversed: Boolean,

  // Current time in the frame
  currentTime: Number,

  // Has begin?
  began: Boolean,

  // Is paused?
  paused: Boolean,

  // Controller to start, stop, reverse and restart the animation again
  controller: {
    start: Function
    stop: Function,
    restart: Function,
    reset: Function,
    reverse: Function
  }
}
```

> Note - Animation lifecycle hooks also receive the same parameters.
