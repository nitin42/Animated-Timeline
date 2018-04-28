# Animated Timeline

> Create playback based animations in React 💫


## Table of contents

* [Introduction](#introduction)

* [Another animation library ?](#another-animation-library)

* [Features](#features-%EF%B8%8F)

* [Performance](#performance)

* [Install](#install)

* [Browser support](#browser-support-%EF%B8%8F)

* [Usage](#usage)

* [Animation types](#animation-types)

* [Animation values](#animation-values)

* [Documentation](#documentation)

* [Todos](#todos)

## Introduction 👋🏻

**animated-timeline** is an animation library for React which makes it painless to create playback based animations.

## Another animation library ? 👀

Nope! Though you can use it as a library or extract some part of this project as `animated-timeline` provides playback based APIs to perform animations and some other utilities like changing the animation position along its timeline, APIs for performing spring based animations etc but the main goal of this project is to -

* provide utilities to create animation tools.

* create a fitting abstraction on top of this project.

* provide APIs for composing animations that transition from one state to another, use loops, callbacks and timer APIs to create interactive animations.

## Concepts

`animated-timeline` combines both the models, timing and animation so as to harmonize timing and visual changes to the document.

### Timing model

Timing model manages the time and keeps track of current progress in a timeline.

### Animation model

Animation model, on the other hand, describes how an animation could look like at any give time or it can be thought of as state of an animation at a particular point of time.


## Features ☄️

* Controls for time-based execution of an animation

* Create sequence based animations

* Change the animation position along the timeline by seeking the animation

* Keyframes

* Promise based APIs

* Interactive animations based on changing inputs

* Spring physics and bounciness

## Performance 🔥

* Style mutations and style reads are batched to speed up the performance and avoid document reflows.

* Uses `will-change` but in an optimal way to avoid high memory consumption

## Install 👨🏼‍💻

```
npm install animated-timeline
```

or if you use yarn

```
yarn add animated-timeline
```

> Note - This project is not experimental and doesn't require a polyfill. See [browser usage](#browser-usage).

**This project also depends on `react` and `react-dom` so make sure you've them installed.**

## Browser support ⚙️

| Chrome | Safari | IE / EDGE | Firefox | Opera |
| ------ | :----: | --------: | ------: | ----: |
| 24+    |   6+   |       10+ |     32+ |   15+ |

## Usage 🎮

`animated-timeline` provides three ways to do animations:

* [Component API](./docs/Component.md)

* [Timeline API](./docs/Timeline.md)

* [Spring physics API](./docs/Spring.md)

**Example usage with component API**

```js
import React from 'react'
import { Animate, helpers } from 'animated-timeline'

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink',
}

function App() {
  return (
    <Animate
      timingProps={{
        duration: 1000
      }}
      animationProps={{
        rotate: helpers.transition({ from: 360, to: 180 })
      }}>
      <div style={styles} />
    </Animate>
  )
}
```

<p align="center">
  <img src="./media/Animate.gif" />
</p>

[Read the detailed API reference for Component API](./docs/Component.md)

**Example usage with `Timeline` API**

```js
import React from 'react'
import { Timeline, helpers } from 'animated-timeline'

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink'
}

const t = Timeline({
  direction: 'alternate',
  iterations: 1
})

class App extends React.Component {
  componentDidMount() {
    t.animate({
      elements: this.one,
      opacity: helpers.transition({ from: 0.2, to: 0.8 }),
      rotate: helpers.transition({ from: 360, to: 180 })
    }).start()
  }

  render() {
    return <div ref={(one) => (this.one = one)} style={styles} />
  }
}
```

> **Note** - You can also use selectors like '.xyz' or '#xyz' along with refs or an array of elements via property `multilpeEl`.

[Read the detailed API reference for `Timeline` API](./docs/Timeline.md)

**Example usage with spring physics**

```js
import React from 'react'

import { Spring } from 'animated-timeline'

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink'
}

const spring = Spring({ friction: 4, tension: 2 })

// or

// const spring = Spring({ bounciness: 14, speed: 12 })


class SpringSystem extends React.Component {
  componentDidMount() {
    spring.animate({
      element: this.one,
      property: 'scale',
      options: {
        mapValues: {
          input: [0, 1], // Input values via setValue()
          output: [1, 1.5]
        }
      }
    })
  }

  render() {
    return (
      <div
        ref={(one) => (this.one = one)}
        onMouseUp={() => spring.setValue(0)}
        onMouseDown={() => spring.setValue(1)}
        style={styles}
      />
    )
  }
}
```

<p align="center">
  <img src="./media/spring.gif" />
</p>

[Read the detailed API reference for spring physics](./docs/Spring.md)

## Animation types 🌀

### Sequence based animations

[See example code for sequence based animations](./examples/Timeline/sequence.js)

<p align="center">
  <img src="./media/sequence.gif" />
</p>

### Timing based animations

[See example code for timing based animations](./examples/Timeline/timing.js)

<p align="center">
  <img src="./media/timing.gif" />
</p>

### Keyframes

[**See example code for keyframes**](./examples/Keyframes/index.js)

<p align="center">
  <img src="./media/keyframes.gif" />
</p>

### Changing the animation position

You can also change the animation position along its timeline using an input value.

[See example code](./examples/Seeking/basic.js)

<p align="center">
  <img src="./media/mover.gif" />
</p>

### Spring based animations

[See examples for spring based animations](./examples/Spring)

<p align="center">
  <img src="./media/spring.gif" />
</p>

### More examples

See more examples for -

* [Animation lifecycle](./examples/Lifecycle/index.js)

* [Using promise based APIs to control `initialisation` and `cancellation` events for an animation](./examples/Promise/index.js)

* [Animations using timer APIs](./examples/Extra/speed.js)

## Animation values


* For transforms

```js
t.animate({
  element: '.one',
  scale: 1,
  rotateX: '360deg' // or 360
})
```

* For css properties

```js
t.animate({
  element: '.one',
  width: '20px'
})
```

* Defining values using objects

```js
t.animate({
  element: '.one',
  rotate: {
    value: 360, // 360deg
    duration: 3000,
    delay: 200,
    direction: 'alternate'
  }
})
```

Check out [this](./docs/properties) list to see which properties you can use when defining the animation values using objects.

* `from` - `to` based animation values

```js
import { Timeline, helpers } from 'animated-timeline'

Timeline({ duration: 2000, delay: 200 }).animate({
  element: '.one',
  scale: helpers.transition({ from: 2, to: 1})
})
```

* Timing based animation values

```js
import { Timeline, helpers } from 'animated-timeline'

Timeline({ duration: 2000 }).animate({ element: '.one',
scale: 2 }).animate({ element: '.two', scale: 1, offset: helpers.startAfter(2000)})
```

## Documentation

[Check out the detailed documentation for `animated-timeline`.](./docs)

## Todos 😴

* [ ] ReasonML port of the core engine

* [ ] timing model based on scroll position and gestures ?
