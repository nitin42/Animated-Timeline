# Component API

`animated-timeline` provides an `Animate` component to animate the elements using a declarative API.

## Examples

* [Basic example](../examples/Animate-Component/Basic.js)

* [Advance example](../examples/Animate-Component/Advance.js)

* [Playback controls](../examples/Animate-Component/Controls.js)

## Example usage

```js
import React from 'react'

import { Animate } from 'animated-timeline'

// Properties for timing model
const timingProps = {
  duration: 1000,
  direction: 'alternate',
  iterations: Infinity
}

// Properties for animation model
const animationProps = {
  rotate: '360deg',
  scale: 2
}

function App() {
  return (
    <Animate timingProps={timingProps} animationProps={animationProps}>
      <div>Hello World</div>
    </Animate>
  )
}
```

<p align='center'>
  <img src='../media/basic-2.gif' />
</p>

[Learn more about animation and timing model](../README.md#concepts)

## Props

### `timingProps`

Accepts an object of timing properties like `duration`, `delay`, `iterations` etc.

Check out [this](./properties.md#timing-properties) list of available timing properties.

```js
<Animate
  timingProps={{ delay: 200, duration: 4000, speed: 0.6, iterations: 12 }}
/>
```

### `animationProps`

Accepts an object of animation properties like `rotation`, `scale`, `width` and all other css and transform properties.

Check out [this](./properties.md#animation-properties) list of all the animation properties.

```js
<Animate animationProps={{ rotate: 360, scale: 1 }} />
```

### `autoplay`

Autoplay the animation. Default value is `true`.

```js
<Animate autoplay={false}>
```

### `seekAnimation`

Use this prop to change the animation position along its timeline with an input value. Accepts a number or a callback function that returns a number.

```js
state = { value: 10 }

function App() {
  return (
    <Animate seekAnimation={state.value}>
      <h1>Hello World</h1>
    </Animate>
  )
}
```

or with a callback function

```js
state = { value: 10 }

function callback(props) {
  return props.duration - state.value * 20
}

function App() {
  return (
    <Animate seekAnimation={callback}>
      <h1>Hello World</h1>
    </Animate>
  )
}
```

### `lifecycle`

An object with following methods -

#### `onStart`

`onStart` is invoked when the animation starts.

```js
function App() {
  return (
    <Animate
      lifecycle={{
        onStart: (props) => {
          if (props.began) {
            console.log('Animation started!')
          }
        }
      }}>
      <h1>Hello World</h1>
    </Animate>
  )
}
```

#### `onUpdate`

`onUpdate` is invoked when the animation updates (called each frame).

```js
function App() {
  return (
    <Animate
      lifecycle={{
        onUpdate: (props) => {
          props.progress - state.value * 10
        }
      }}>
      <h1>Hello World</h1>
    </Animate>
  )
}
```

You can use `onUpdate` lifecycle hook to update an input value by syncing it with the animation progress while seeking the animation. Below is an example -

```js
import React from 'react'
import { Animate } from 'animated-timeline'

class App extends React.Component {
  state = {
    value: 0
  }

  render() {
    return (
      <React.Fragment>
        <Animate
          {...timingProps}
          {...animationProps}
          lifecycle={{
            onUpdate: (props) => {
              this.state.value = props.progress
            }
          }}
          seekAnimation={({ duration }) => duration - this.state.value * 20}>
          <div style={styles} />
        </Animate>
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={(e) => this.setState({ value: e.target.value })}
        />
      </React.Fragment>
    )
  }
}
```

<img src='../media/mover.gif' />

#### `onComplete`

`onComplete` is invoked when the animation completes.

```js
function App() {
  return (
    <Animate
      lifecycle={{
        onComplete: (props) => {
          if (props.completed) {
            console.log('Animation completed!')

            console.log('Restarting the animation...')

            // Restart the animation
            props.controller.restart()
          }
        }
      }}>
      <h1>Hello World</h1>
    </Animate>
  )
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

### `start`

Start the animation. Default is `false`

```js
state = { start: false }

<Animate start={state.start} />
```

### `stop`

Stop the animation. Default is `false`

```js
state = { start: false }

<Animate stop={!state.start} />
```

### `reset`

Reset the animation. Default is `false`

```js
state = { reset: false }

<Animate reset={state.reset} />
```

### `reverse`

Reverse the animation. Default is `false`

```js
state = { reverse: false }

<Animate reverse={state.reverse} />
```

### `finish`

Finish the animation immediately. Default is `false`

```js
state = { finish: false }

<Animate finish={state.finish} />
```

### `restart`

Restart the animation. Default is `false`

```js
state = { restart: false }

<Animate restart={state.restart} />
```

## Extra

### Using Keyframes with `Animate` component

```js
import { Animate, Keyframes } from 'animated-timeline'

const x = new Keyframes()
  .add({
    value: 10,
    duration: 1000
  })
  .add({
    value: 50,
    duration: 2000,
    offset: 0.8
  })
  .add({
    value: 0,
    duration: 3000
  })

function App() {
  return (
    <Animate
      timingProps={{
        duration: 4000,
      }}
      animationProps={{
        // Add frames to the property `translateX`
        translateX: x.frames
      }}
    />
      <div style={some_styles}
    </Animate>
  )
}
```

[Read more about the `Keyframes` API](Keyframes.md)

### Using `helpers` object with `Animate` component

```js
import { Animate, helpers } from 'animated-timeline'

function App() {
  return (
    <Animate
      timingProps={{
        duration: 4000,
      }}
      animationProps={{
        translateX: helpers.transition({
          from: 50,
          to: 100
        })
      }}
    />
      <div style={some_styles}
    </Animate>
  )
}
```

[Read more about the `helpers` object](./helpers.md)

## FAQs

* **I need to do something when an animation ends**

Use `onComplete` lifecycle hook

* **How can I sync an animation progress value with an input value ?**

Use `onUpdate` lifecycle hook

```js
<Animate
  {...props}
  lifecycle={{
    onUpdate: ({ progress }) => {
      // do something here with the `progress` value
      // onUpdate is called each frame
    }
  }}
```

* **I need to control the animation with changing input**

Use `seekAnimation` prop.

```js
<Animate seekAnimation={input_value} />
```

## Trade-offs

*  You cannot perform sequence based animations. Use [`Timeline API`](./Timeline.md) instead.

* Promise based APIs for oncancel and onfinish events are not available. Use [`Timeline API`](./Timeline.md) instead.

* Controls for time-based execution are directly not available on the instance, and they are accessible only via flags

See next ▶️

[Timeline API](./Timeline.md)

[Spring API](./Spring.md)

[Keyframes API](./Keyframes.md)

[helpers object](./helpers.md)

[Animation properties](./properties.md)
