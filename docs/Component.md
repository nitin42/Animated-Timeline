# Component API

`animated-timeline` provides an `Animate` component to animate the elements with a declarative API.

## Examples

[Check out the examples for using the component API](../examples/Animate-Component).

## Usage

```js
import React, { Component } from 'react'

import { Animate, helpers } from 'animated-timeline'

export function App() {
  return (
    <Animate
      timingProps={{
        duration: 1000,
        direction: 'alternate',
        iterations: Infinity
      }}
      animationProps={{
        rotate: {
          value: helpers.transition({ from: 360, to: 180 }),
          duration: 3000
        },
        scale: helpers.transition({ from: 1, to: 2 })
      }}>
      <div style={styles} />
    </Animate>
  )
}
```

## Props

### `timingProps`

Accepts an object of timing properties like `duration`, `delay`, `iterations` etc. Check out [this]() list of available timing properties.

```js
<Animate
  timingProps={{ delay: 200, duration: 4000, speed: 0.6, iterations: 12 }}
/>
```

### `animationProps`

Accepts an object of animation properties like `rotation`, `scale`, `width` and all other css and transform properties. Check out [this]() list of all the properties.

```js
<Animate animationProps={{ rotate: 360, scale: 1 }} />
```

### `autoplay`

Autoplay the animation. Default value is `true`.

```js
<Animate autoplay={false}>
```

### `seekAnimation`

Accepts a number or a callback function that returns a number.

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

function callback(duration) {
  return duration - state.value * 20
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

You can use `onUpdate` lifecycle hook to mutate the state by syncing it with the animation progress while seeking the animation. Below is an example -

```js
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

`onStart` is invoked when the animation starts.

```js
function App() {
  return (
    <Animate
      lifecycle={{
        onComplete: (props) => {
          if (props.completed) {
            console.log('Animation completed!')

            console.log('Restarting the animation...')

            // Reverse the direction
            props.controller.reverse()

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
    start: Function, // Start the animation
    stop: Function, // Stop the animation
    restart: Function, // Restart the animation
    reverse: Function, // Reverse the animation
    reset: Function // Reset the animation
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

### `restart`

Restart the animation. Default is `false`

```js
state = { restart: false }

<Animate restart={state.restart} />
```
