# Timeline API

Using the `Timeline` API, you can create interactive animations with loops, callbacks, promises, variables, timer APIs and animation lifecycle hooks.

To animate an element using the `Timeline` API, you will need to specify properties for **timing model** like `duration`, `delay`, `iterations` and **animation model** like `transform`, `color`, `opacity` etc. You can read more about the timing and animation properties [here.](./properties.md)

## Examples

* [Basic](../examples/Timeline/basic.js)

* [Sequencing](../examples/Timeline/sequence.js)

* [Offset based animations](../examples/Timeline/timing.js)

* [Staggered animation](../examples/Timeline/SStaggered.js)

* [Multiple elements with one Timeline instance](../examples/Timeline/Multiple.js)

* [Seeking the animation position](../examples/Seeking/basic.js)

* [Promise based API](../examples/Promise/index.js)

* [Using animation lifecycle hooks](../examples/Lifecycle/index.js)

* [Keyframes](../examples/Keyframes/index.js)

* [Finish the animation immediately](../examples/Extra/Finish.js)

* [Changing speed in-between the running animation](../examples/Extra/speed.js)

## `createTimeline`

`createTimeline` function accepts an object of timing properties (optional) and creates a timeline object which is use to animate the elements by synchronising visual changes to the document with time.

```js
const t = createTimeline()

// or

const t = createTimeline({ ...timingProps })
```

**Specifying properties for timing model**

```js
import { createTimeline } from 'animated-timeline'

const t = createTimeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})
```

Check out [this](./properties.md#timing-properties) list of all the timing properties.

**`createTimeline().animate({ ...animationProps })`**

`animate` accepts an object of animation properties and one or more elements when performing sequence based animations or timing based animations.

```js
const t = createTimeline()

t.animate({
  scale: 2,
  rotate: '360deg'
})
```

**Specifying properties for animation model**

```js
import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

class App extends React.Component {
  componentDidMount() {
    t
      .animate({
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()
  }

  render() {
    return <t.div />
  }
}
```

Check out [this](./properties.md#animation-properties) list of all the animation properties.

### Sequence based animations

**`createTimeline().sequence([t1, t2, ...])`**

`.sequence([t1, t2, ...])` takes an array of animation properties for different elements and creates a sequence based animation.

When performing sequence based animations, data binding won't work. You will have to specify the element explicitly using `el` property when animating only one element or `multipleEl` when animating multiple elements.

```js
import React from 'react'

import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

const one = React.createRef()

const two = React.createRef()

const animate = (one, two) => {
  t
    .sequence([
      t.animate({
        el: one.current,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      t.animate({
        el: two.current,
        rotate: '360deg'
      })
    ])
    .start()
}

class App extends React.Component {
  componentDidMount() {
    animate()
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one} />
        <div ref={two} />
      </React.Fragment>
    )
  }
}
```

> Along with the refs, you can also use selectors (id or class name) for specifying the element.

### Timing based animations

Use property `offset` to perform timing based animations.

When performing timing based animations, data binding won't work. You will have to specify the element explicitly using `el` property when animating only one element or `multipleEl` when animating multiple elements.

```js
import React from 'react'

import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

const one = React.createRef()

const two = React.createRef()

const animate = (one, two) => {
  t
    .sequence([
      t.animate({
        el: one.current,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      t.animate({
        el: two.current,
        rotate: '360deg',
        // Start this animation at 2 seconds after the previous animation ends.
        offset: helpers.startAfter(2000)
      })
    ])
    .start()
}

class App extends React.Component {
  componentDidMount() {
    animate()
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one} />
        <div ref={two} />
      </React.Fragment>
    )
  }
}
```

Read more about the `offset` property and timing based functions [here](./helpers#timing-based-animations)

### Animating multiple elements

**With data binding**

```js
import React from 'react'

import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  iterations: Infinity,
  direction: 'alternate',
  duration: 2000,
  easing: 'easeInOutSine'
})

class MultipleElem extends React.Component {
  componentDidMount() {
    t
      .animate({
        scale: helpers.transition({
          from: 2,
          to: 1
        }),
        delay: (element, i) => i * 750
      })
      .start()
  }

  renderNodes = n => {
    let children = []

    for (let i = 0; i < n; i++) {
      children.push(
        React.createElement(t.div, {
          style: { width: 50, height: 50, backgroundColor: 'mistyrose' },
          key: i
        })
      )
    }

    return children
  }

  render() {
    return <React.Fragment>{this.renderNodes(3)}</React.Fragment>
  }
}
```

**With `multipleEl` property**

```js
import React from 'react'

import { boxStyles } from '../styles'

import { createTimeline, helpers } from '../../build/animated-timeline.min.js'

const t = createTimeline({
  iterations: Infinity,
  direction: 'alternate',
  duration: 2000,
  easing: 'easeInOutSine'
})

export class Staggered extends React.Component {
  componentDidMount() {
    t
      .animate({
        multipleEl: ['.two', 'one'],
        rotate: helpers.transition({
          from: 180,
          to: 360
        })
      })
      .start()
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="one"
          style={{ width: 50, height: 50, backgroundColor: 'mistyrose' }}
        />
        <p className="two">Hello World</p>
      </React.Fragment>
    )
  }
}
```

### Seeking the animation

**`createMover(timeline_instance)`**

You can change an animation position along its timeline using `createMover` function. `createMover` function accepts a timeline instance and creates a function that moves or changes an animation position.

```js
import React from 'react'

import { createTimeline, helpers, createMover } from 'animated-timeline'

const t = createTimeline({
  speed: 1,
  iterations: 1,
  direction: 'alternate',
  easing: 'easeInOutSine'
})

// Pass the timeline instance
const seekAnimation = createMover(t)

class App extends React.Component {
  state = { value: 0 }

  componentDidMount() {
    t.animate({
      scale: helpers.transition({
        from: 4,
        to: 2
      })
    })
  }

  handleChange = e => {
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
      <React.Fragment>
        <t.div />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </React.Fragment>
    )
  }
}
```

<p>
  <img src='../media/mover.gif' />
</p>

The callback function passed to `seekAnimation` receives the following properties -

```js
{
  duration: number, // Animation duration
  iterations: number, // Total iterations
  progress: number, // Animation progress
  offset: number, // Offset value (for timing based animations)
  delay: number, // Animation delay
  currentTime: number // Current time of an animation
}
```

### Animation lifecycle

Animation lifecycle hooks gets executed during different phases of an animation. They are accessible directly via the timeline instance.

**`onStart`**

`onStart` is invoked when the animation starts.

```js
const t = createTimeline({ ...props })

t.animate({ ...props }).start()

t.onStart = props => {
  console.log(`Animation started: ${props.began}`)
}
```

**`onUpdate`**

`onUpdate` is invoked when the animation updates (called each frame).

```js
const t = createTimeline({ ...props })

t.animate({ ...props }).start()

t.onUpdate = props => {
  console.log('Updating...')
}
```

You can use `onUpdate` lifecycle hook to update an input value by syncing it with the animation progress while seeking the animation. Below is an example -

```js
import React from 'react'

import { createTimeline, createMover } from 'animated-timeline'

const t = createTimeline({ duration: 2000 })

const seekAnimation = createMover(t)

class App extends React.Component {
  state = {
    value: 0
  }

  componentDidMount() {
    t
      .animate({
        scale: {
          value: 2,
          duration: 4000
        }
      })
      .start()

    t.onUpdate = ({ progress }) => {
      this.state.value = progress
    }
  }

  render() {
    return (
      <React.Fragment>
        <t.div />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={e => {
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
const t = createTimeline({ ...props })

t.animate({ ...props }).start()

t.onComplete = props => {
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
    reset: () => void, // Reset the animation
    finish: () => void // Finish the animation immediately
  }
}
```

## Promise API

**`onfinish`**

`onfinish` is resolved when the animation is finished.

```js
const t = createTimeline({ ...props })

t.animate({ ...props }).start()

t.onfinish.then(res => console.log(res))
```

**`oncancel`**

`oncancel` function accepts an element (via selector or ref) and is resolved when an animation is interrupted / cancelled. It removes the element which is being animated from the timeline.

```js
const t = createTimeline({ ...props })

t.animate({ ...props }).start()

t.oncancel('.one').then(res => console.log(res))
```

[Check out the detailed examples of using promise API](../examples/Promise/index.js)

## Altering timing model

**`getAnimations()`**

You can also alter the timing model i.e the timing properties. For example - changing the speed of an animation after 3 seconds or changing the duration. In those cases, you will be using `getAnimations()` method.

`getAnimations()` is accessible via the timeline instance. It returns an array of running animations.

```js
import React from 'react'

import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: Infinity,
  speed: 0.5
})

const animate = (one, two) => {
  t
    .sequence([
      t.animate({
        el: one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      }),

      t.animate({
        el: two,
        rotate: '360deg',
        offset: helpers.startBefore(1200)
      })
    ])
    .start()
}

class App extends React.Component {
  componentDidMount() {
    animate('#speed-one', '#speed-two')

    // Change the speed after 3s
    setTimeout(() => {
      t.getAnimations().forEach(animation => {
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

**`setSpeed(speed)`**

To change the animation speed, use the method `setSpeed` which is accessible via the timeline instance.

```js
const t = createTimeline({
  duration: 200,
  speed: 0.6
})

t.setSpeed(0.9)
```

## Animation playback controls

**`start()`**

Starts an animation

```js
const t = createTimeline({ ...props })

t.start()
```

**`stop()`**

Stops an animation

```js
createTimeline({ ...props }).stop()
```

**`finish()`**

Immediately finish an animation

```js
createTimeline({ ...props }).finish()
```

Checkout [this](../examples/Extra/Finish.js) example for `finish()` control.

**`reset()`**

Resets an animation

```js
createTimeline({ ...props }).reset()
```

**`reverse()`**

Reverse an animation

```js
createTimeline({ ...props }).reverse()
```

**`restart()`**

Restart an animation

```js
createTimeline({ ...props }).restart()
```

**`cancel()`**

cancel the animation

```js
createTimeline({ ...props }).cancel()
```

Use `cancel()` to cancel the animation when updating the state inside `onUpdate` lifecycle hook.

## Utilities

**`getAnimationTime()`**

Returns the total running time of an animation.

```js
createTimeline({ ...props }).getAnimationTime()
```

**`getAnimationTimeByElement(element)`**

Returns the total running time of an animation by element.

```js
createTimeline({ ...props }).getAnimationTimeByElement('.one')
```

**`getCurrentTime()`**

Returns the current time of an animation

```js
createTimeline({ ...props }).getCurrentTime()
```

**`getCurrentTimeByElement(element)`**

Returns the current time of an animation by element.

```js
createTimeline({ ...props }).getCurrentTimeByElement('.one')
```

**`getAnimationProgress()`**

Returns the current animation progress.

```js
createTimeline({ ...props }).getAnimationProgress()
```

**`getAnimationProgressByElement(element)`**

Returns the current animation progress by element.

```js
createTimeline({ ...props }).getCurrentProgressByElement('.one')
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
createTimeline({ ...props })
  .getAnimations()
  .forEach(animation => {
    animation.setSpeed(0.5)
  })
```

See next ▶️

[Component API](./Component.md)

[Spring API](./Spring.md)

[Keyframes API](./Keyframes.md)

[helpers object](./helpers.md)

[Animation properties](./properties.md)
