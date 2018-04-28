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

You can change an animation position along its timeline using `createMover` function. `createMover` creates a function that moves/changes an animation position.

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