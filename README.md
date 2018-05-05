# Animated Timeline

![author](https://img.shields.io/badge/author-Nitin%20Tulswani-blue.svg) ![size](https://img.shields.io/badge/size-35.5%20KB-brightgreen.svg) [![Build Status](https://travis-ci.org/nitin42/Timeline.svg?branch=beta0)](https://travis-ci.org/nitin42/Timeline)

> Create playback based animations in React

## Table of contents

* [Introduction](#introduction)

* [Another animation library ?](#another-animation-library)

* [Features](#features)

* [Performance](#performance)

* [Install](#install)

* [Browser support](#browser-support)

* [Usage](#usage)

* [Animation types](#animation-types)

* [Animation values](#animation-values)

* [Documentation](#documentation)

* [Todos](#todos)

## Introduction

**animated-timeline** is an animation library (not really) for React which makes it painless to create playback based animations.

## Another animation library ?

Nope! Though you can use it as a library. The main goal of this project is to provide -

* utilities to create animation tools

* low-level APIs to create a fitting abstraction on top of this project

* APIs for composing animations that transition from one state to another, use loops, callbacks and timer APIs to create interactive animations

## Concepts

`animated-timeline` works on two models, timing and animation model.

### Timing model

Timing model manages the time and keeps track of current progress in a timeline.

### Animation model

Animation model, on the other hand, describes how an animation could look like at any give time or it can be thought of as state of an animation at a particular point of time.

Using both the models, we can synchronize the timing and visual changes to the document.

## Features

* Controls for time-based execution of an animation

* Create sequence based animations

* Timing based animations

* Change the animation position along the timeline by seeking the animation

* Keyframes

* Promise based APIs

* Interactive animations based on changing inputs

* Spring physics and bounciness

## Performance

Style mutations and style reads are batched internally to speed up the performance and avoid document reflows.

## Install

```
npm install animated-timeline
```

or if you use yarn

```
yarn add animated-timeline
```

**This project also depends on `react` and `react-dom` so make sure you've them installed.**

## Browser support

| Chrome | Safari | IE / EDGE | Firefox | Opera |
| ------ | :----: | --------: | ------: | ----: |
| 24+    |   6+   |       10+ |     32+ |   15+ |

## Usage

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
  backgroundColor: 'pink'
}

// Properties for timing model
const timingProps = {
  duration: 1000
}

// Properties for animation model
const animationProps = {
  rotate: helpers.transition({ from: 360, to: 180 })
}

function App() {
  return (
    <Animate timingProps={timingProps} animationProps={animationProps}>
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
import { createTimeline, helpers } from 'animated-timeline'

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink'
}

const t = createTimeline({
  direction: 'alternate',
  iterations: 1
})

class App extends React.Component {
  componentDidMount() {
    t
      .animate({
        opacity: helpers.transition({ from: 0.2, to: 0.8 }),
        rotate: helpers.transition({ from: 360, to: 180 })
      })
      .start()
  }

  render() {
    return <t.div style={styles} />
  }
}
```

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

const s = Spring({ friction: 4, tension: 2 })

// or

// const s = Spring({ bounciness: 14, speed: 12 })

class SpringSystem extends React.Component {
  componentDidMount() {
    s.animate({
      property: 'scale',
      map: {
        input: [0, 1],
        output: [1, 1.5]
      }
    })
  }

  render() {
    return (
      <s.div
        onMouseUp={() => s.setValue(0)}
        onMouseDown={() => s.setValue(1)}
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

## Animation types

### Sequence based animations

<p align="center">
  <img src="./media/sequence.gif" />
</p>

### Timing based animations

<p align="center">
  <img src="./media/timing.gif" />
</p>

### Staggered animation

<p align="center">
  <img src="./media/Staggered.gif" />
</p>

### Keyframes

<p align="center">
  <img src="./media/keyframes.gif" />
</p>

### Changing the animation position

You can also change the animation position along its timeline with an input value.

<p align="center">
  <img src="./media/mover.gif" />
</p>

### Spring based animations

<p align="center">
  <img src="./media/spring.gif" />
</p>

### More examples

* [Using animation lifecycle hooks](./examples/Lifecycle/index.js)

* [Using promise based APIs to manage `completion` and `cancellation` events for an animation](./examples/Promise/index.js)

* [Using timer APIs to perform Animation](./examples/Extra/speed.js)

## Animation values

* **For transforms**

```js
t.animate({
  scale: 1,
  rotateX: '360deg' // with or without unit
})
```

* **For css properties**

```js
t.animate({
  width: '20px'
})
```

* **Defining values using objects**

```js
t.animate({
  rotate: {
    value: 360, // 360deg
    duration: 3000,
    delay: 200,
    direction: 'alternate'
  }
})
```

Check out [this](./docs/properties) list to see which properties you can use when defining the animation values using objects.

* **`from` - `to` based animation values**

```js
import { helpers } from 'animated-timeline'

t.animate({
  scale: helpers.transition({ from: 2, to: 1 })
})
```

Read more about `helpers` object [here](./docs/helpers.md).

* **Timing based animation values**

Use property `offset` to perform timing animations

```js
import { helpers } from 'animated-timeline'

t
  .sequence([
    t.animate({
      el: '.one',
      scale: 2
    }),

    t.animate({ el: '.two', scale: 1, offset: helpers.startAfter(2000) })
  ])
  .start()
```

You can set a value for a property with or without any unit such as `px`, `em`, `rem`, `in`, `cm`, `mm`, `vw`, `vh`, `vmin`, `vmax`, `deg`, `rad`, `turn` etc.

## Documentation

[Check out the detailed documentation for `animated-timeline`.](./docs)

## Todos

* [ ] ReasonML port of the core engine

* [ ] timing model based on scroll position and gestures ?

* [x] Use data binding
