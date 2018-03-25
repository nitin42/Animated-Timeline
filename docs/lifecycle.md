## Animation lifecycle hooks

You can also manage the animation lifecycle and execute some logic in different phases of your animation. For example - after an animation has been completed, we will reverse it direction and restart the animation again.

```js
import React, { Component } from "react";

import { Timeline, helpers } from "animated-timeline";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  speed: 0.09
});

const { Animated, AnimationTimeline } = timeline.init();

export class App extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      rotate: {
        value: 360,
        easing: "easeInOutSine"
      }
    }).start();
  }

  render() {
    return (
      <React.Fragment>
        <AnimationTimeline
          lifecycle={{
            onComplete: ({ completed }) => {
              console.log("Completed: " + completed);
              console.log("Starting again...");

              if (completed) {
                // Reverse the direction
                Animated.reverse();

                // Restart the animation
                Animated.restart();
              }
            }
          }}
        />
        <div
          ref={one => (this.one = one)}
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "pink"
          }}
        />
      </React.Fragment>
    );
  }
}
```

<p align="center">
  <img src="../media/basic-4.gif" />
</p>

Each lifecycle hook receives the following parameters -

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

### Lifecycle methods

#### onStart(props)

`onStart` is called when the animation starts. If there is any delay, then it will be invoked after that delay timeout.

```js
<AnimationTimeline
  lifecycle={{
    onStart: props => {
      console.log("Animation started!");
    }
  }}
/>
```

#### onUpdate(props)

`onUpdate` is invoked whenever there is any new update (state updates, events). Avoiding calling `setState` here because React limits the number of nested updates to prevent infinite loops.

**Common use case** - Sync the animation progress with the input value.

```js
<AnimationTimeline
  lifecycle={{
    onUpdate: ({ progress }) => {
      inputValue = isNaN(progress) ? 10 : progress;
    }
  }}
/>
```

#### onComplete(props)

`onComplete` is invoked when the animation is done.

```js
<AnimationTimeline
  lifecycle={{
    onComplete: ({ completed }) => {
      if (completed) {
        // reverse the direction
        Animation.reverse();

        // Restart the animation again
        Animation.restart();
      }
    }
  }}
/>
```

> React Native has `finished` property instead of completed to check if the animation has completed or not.

#### callFrame(props)

`callFrame` is called every frame.
