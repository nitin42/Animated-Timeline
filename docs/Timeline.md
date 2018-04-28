# Timeline API

Using the `Timeline` API, you can create interactive animations using loops, callbacks, promises, variables, timer APIs and animation lifecycle hooks.

To animate an element using the `Timeline` API, you will need to specify properties for **timing model** like `duration`, `delay`, `iterations` and **animation model** like `elements` for animating an element or an array of elements, `transform`, `color`, `opacity` etc.

You can read more about the timing and animation properties [here.](./properties.md)


## Examples

* [Basic](../examples/Timeline/basic.js)

* [Sequencing](../examples/Timeline/sequence.js)

* [Offset based animations](../examples/Timeline/timing.js)

* [Seeking the animation position](../examples/Seeking/basic.js)

* [Promise based API](../examples/Promise/index.js)

* [Using animation lifecycle hooks](../examples/Lifecycle/index.js)

* [Keyframes](../examples/Keyframes/index.js)

* [Finish the animation immediately](../examples/Extra/Finish.js)

* [Changing speed in-between the running animation](../examples/Extra/speed.js)

## Timeline

`Timeline` function returns a timeline instance which is use to animate the element.

**Specifying properties for timing model**

```js
import { Timeline } from 'animated-timeline'

const t = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})
```

**Specifying properties for animation model**

```js
import { Timeline, helpers } from 'animated-timeline'

const t = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

class App extends React.Component {
  componentDidMount() {
    t.animate({
      element: this.one,
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).start()
  }

  render() {
    return <div ref={(one) => (this.one = one)} />
  }
}
```

> You can also pass a selector to `element` property like '#one' or '.one' along with refs.

To animate multiple elements, use the property `multipleEl` instead of `element`.

```js

class App extends React.Component {
  componentDidMount() {
    t.animate({
      multipleEl: ['#one', '#two'],
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }).start()
  }

  render() {
    return (
      <React.Fragment>
        <div id='one' />
        <div id='two' />
      </React.Fragment>
    )
  }
}
```

### Sequence based animations

To perform sequence based animations, use `Timeline({...props}).sequence([ t1, t2 ])`

```js
import { Timeline, helpers } from 'animated-timeline'

const t = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

const animate = (one, two) => {
  t.sequence([
    t.animate({
      element: one,
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }),

    t.animate({
      element: two,
      rotate: '360deg'
    })
  ]).start()
}

class App extends React.Component {
  componentDidMount() {
    animate(this.one, this.two)
  }

  render() {
    return (
      <React.Fragment>
        <div ref={(one) => (this.one = one)} />
        <div ref={(two) => (this.two = two)} />
      </React.Fragment>
    )
  }
}
```

### Timing based animations

Use property `offset` to perform timing based animations.

```js
import { Timeline, helpers } from 'animated-timeline'

const t = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

const animate = (one, two) => {
  t.sequence([
    t.animate({
      element: one,
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }),

    t.animate({
      element: two,
      rotate: '360deg',
      // Start this animation at 2 seconds after the previous animation ends.
      offset: helpers.startAfter(2000)
    })
  ]).start()
}

class App extends React.Component {
  componentDidMount() {
    animate(this.one, this.two)
  }

  render() {
    return (
      <React.Fragment>
        <div ref={(one) => (this.one = one)} />
        <div ref={(two) => (this.two = two)} />
      </React.Fragment>
    )
  }
}
```

Read more about the `offset` property and timing based functions [here](./helpers#timing-based-animations)

### Seeking the animation

You can change an animation position along its timeline using `createMover` function. `createMover` accepts a timeline instance and creates a function that moves or changes an animation position.

```js
import React from 'react'

import { Timeline, helpers, createMover } from 'animated-timeline'

const t = Timeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

const seekAnimation = createMover(t)

class App extends React.Component {
  state = { value: 0 }

  componentDidMount() {
    t.animate({
      element: '#one',
      scale: helpers.transition({
        from: 4,
        to: 2
      })
    })
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value
    })

    seekAnimation(this.state.value)

    // or with a callback function

    // This will seek the animation from the reverse direction
    // seekAnimation(({ duration }) => duration - this.state.value * 10)
  }

  render() {
    return (
      <div>
        <div id='one' />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    )
  }
}
```

<p>
  <img src='../media/mover.gif' />
</p>

### Animation lifecycle

Lifecycle hooks gets executed during different phases of an animation.

**`onStart`**

`onStart` is invoked when the animation starts.

```js
const t = Timeline({...props})

t.animate({...props}).start()

t.onStart = (props) => {
  console.log(`Animation started: ${props.began}`)
}
```

**`onUpdate`**

`onUpdate` is invoked when the animation updates (called each frame).

```js
const t = Timeline({...props})

t.animate({...props}).start()

t.onUpdate = (props) => {
  console.log('Updating...')
}
```

You can use `onUpdate` lifecycle hook to update an input value by syncing it with the animation progress while seeking the animation. Below is an example -

```js
import React from 'react'
import { Timeline, createMover } from 'animated-timeline'

const t = Timeline({ duration: 2000 }) 

const seekAnimation = createMover(t)

class App extends React.Component {
  state = {
    value: 0
  }

  componentDidMount() {
    t.animate({
      element: '#one',
      scale: {
        value: 2,
        duration: 4000
      }
    }).start()

    t.onUpdate = ({ progress }) => {
      this.state.value = progress
    }
  }

  render() {
    return (
      <React.Fragment>
        <div id='one' />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={(e) => {
            this.setState({ value: e.target.value })
            seekAnimation(this.state.value)
          }}
        />
      </React.Fragment>
    )
  }
}
```

**`onComplete`**

`onComplete` is invoked when the animation completes.

```js
const t = Timeline({...props})

t.animate({...props}).start()

t.onComplete = (props) => {
  console.log(`Animation completed: ${props.completed}`)
}
```

The above three lifecycle hooks receive the following props -

```js
{
  completed: boolean, // Animation completed or not
  progress: number, // Current animation progress
  duration: number, // Current animation duration
  remaining: number, // Remaining iterations
  reversed: boolean, // Is the animation direction reversed ?
  currentTime: number, // Current time of animation
  began: boolean, // Animation started or not
  paused: boolean, // Is animation paused ?
  controller: {
    start: () => void, // Start the animation
    stop: () => void, // Stop the animation
    restart: () => void, // Restart the animation
    reverse: () => void, // Reverse the animation
    reset: () => void // Reset the animation
  }
}
```

## Promise API

**onfinish**

`onfinish` is resolved after the animation is finished.

```js
const t = Timeline({ ...props })

t.animate({ ...props }).start()

t.onfinish.then((res) => console.log(res))
```

**oncancel**

`oncancel` accepts an element (ref or selector) and is resolved when an animation is interrupted. It removes the current element which is being animated from the timeline.

```js
const t = Timeline({ ...props })

t.animate({ ...props }).start()

t.oncancel('.one').then((res) => console.log(res))
```

[Check out the detailed examples of using promise API](../examples/Promise/index.js)

## Altering timing model

In some cases, you might want to alter the timing model i.e the timing properties. For example - changing the speed of an animation after 3 seconds.

In those cases, you will be using `getAnimations()` method. `getAnimations()` method returns an array of running animations. Below is an example -

```js
import React from 'react'

import { Timeline, helpers } from 'animated-timeline'

const t = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity,
  speed: 0.5
})

const animate = (one, two) => {
  t.sequence([
    t.animate({
      element: one,
      scale: helpers.transition({
        from: 2,
        to: 1
      })
    }),

    t.animate({
      element: two,
      rotate: '360deg',
      offset: helpers.startBefore(1200)
    })
  ]).start()
}

class App extends React.Component {
  componentDidMount() {
    animate('#speed-one', '#speed-two')

    // Change the speed after 3s
    setTimeout(() => {
      t.getAnimations().forEach((animation) => {
        animation.setSpeed(0.2)
      })
    }, 3000)
  }

  render() {
    return (
      <React.Fragment>
        <div id="speed-one" />
        <div id="speed-two" />
      </React.Fragment>
    )
  }
}
```

## Changing animation speed

To change the animation speed, use the method `setSpeed` which is accessible via a timeline instance.

```js
const t = Timeline({
  duration: 200,
  speed: 0.6
})

t.setSpeed(0.9)
```

## Animation controls

**`start()`**

Starts an animation

```js
const t = Timeline({ ...props })

t.start()
```

**`stop()`**

Stops an animation

```js
Timeline({ ...props }).stop()
```

**`finish()`**

Immediately finish an animation

```js
Timeline({ ...props }).finish()
```

Checkout [this](../examples/Extra/Finish.js) example for `finish()` control.

**`reset()`**

Resets an animation

```js
Timeline({ ...props }).reset()
```

**`reverse()`**

Reverse an animation

```js
Timeline({ ...props }).reverse()
```

**`restart()`**

Restart an animation

```js
Timeline({ ...props }).restart()
```

**`clear()`**

Clear all the subscription

```js
Timeline({ ...props }).clear()
```

Use `clear()` to clear the subscriptions when updating the component state inside the `onUpdate` lifecycle hook.


## Utilities

Some utility functions which are accessible via timeline instance.

**`getAnimationTime()`**

Returns the total running time of an animation.

```js
Timeline({...props}).getAnimationTime()
```

**`getAnimationTimeByElement()`**

Returns the total running time of an animation by element.

```js
Timeline({...props}).getAnimationTimeByElement()
```

**`getCurrentTime()`**

Returns the current time of an animation

```js
Timeline({ ...props }).getCurrentTime()
```

**`getCurrentTimeByElement`**

Returns the current time of an animation by element.

```js
Timeline({...props}).getCurrentTimeByElement()
```

**`getAnimationProgress()`**

Returns the current animation progress.

```js
Timeline({...props}).getAnimationProgress()
```

**`getAnimationProgressByElement()`**

Returns the current animation progress by element.

```js
Timeline({...props}).getCurrentProgressByElement()
```

**`getComputedTiming()`**

Returns an object of timing properties -

```js
{
  activeTime, // Time in which animation will be active
  currentTime, // Current time of animation
  progress, // Current animation progress
  currentIteration // Current iterations of an animation
}
```

**`getAnimations()`**

Returns an array of running animations.

```js
Timeline({...props}).getAnimations().forEach(animation => {
  animation.setSpeed(0.5)
})
```

## API

### `Timeline`

Accepts an object of timing properties (optional) and creates a timeline object.

```js
const t = Timeline()

// or

// const t = Timeline({ duration: 200 })
```

### `animate`

`animate` method is available on timeline object. It accepts an object of animation properties and element to animate.

```js
const t = Timeline()

t.animate({
  element: '#one',
  scale: 2,
  rotate: '360deg'
})
```

### `sequence`

`sequence` method is available on timeline object. It accepts an array of timeline objects.

```js
const t = Timeline()

t.sequence([
  t.animate({ element: '#id-one' }),

  t.animate({ element: '#id-two' })
]).start()
```

### `createMover`

A function that accepts a timeline instance and returns a function that moves or changes the animation position. The returned function can be passed a number or a callback that returns a number.

```js
const t = Timeline()

const seekAnimation = createMover(t)
```

**Using number**

```js
seekAnimation(40)
```

**Using callback function**

```js
const state = {
  value: 10
}

function callback({ progress }) {
  return state.value - progress * 10
}
```

The callback function receives the following properties -

```js
{
  duration, // Animation duration
  iterations, // Total iterations
  progress, // Animation progress
  offset, // Offset value (for timing based animations)
  delay, // Animation delay
  currentTime // Current time of an animation
}
```