# animated-timeline

> Create timeline and playback based animations in React

## Table of contents

* [Introduction](#introduction)

* [Install](#install)

* [Browser support](#browser-support)

* [Usage](#usage)

* [Documentation](#documentation)

* [Contributing](#contributing)

* [License](#license)

## Introduction

**animated-timeline** is an animation library for React which makes it painless to create timeline and playback based animations. It is inspired from [animatedjs]() and [anime](https://github.com/juliangarnier/anime). It focuses on improving the developer experience and has an API which is relatively similar to React Native. It also shares the same philosophy with React Native which is -

> **_focus on declarative relationships between inputs and outputs, with configurable transforms in between, and simple start/stop methods to control time-based animation execution._**

Along with `start` and `stop` methods it also provides -

* `restart` - To replay the animation

* `reset` - To reset animation timeline

* `reverse` - To reverse the animation

It also provides lifecycle hooks that gets executed during different phases of an animation. Read more [here](#lifecycle)

## Motivation

A year ago I created [this](https://github.com/nitin42/animate-components) animation library for React but it was very basic and lacked features to interactively control animation execution and dynamically setting the values.

So I started playing with existing animation engines (`animatedjs` and `anime`) and decided to create this small library which combines both the models, **timing** and **animation**.

## Features

* Controls for time-based execution of an animation

* Create sequence based animations

* Change the animation duration and get a snapshot of how an object might look like in the timeline model.

* Timing based animations

* Promise based APIs

> Note - It's not experimental and doesn't require a polyfill. See [browser usage](#browser-usage)

## What's more ?

* `animated-timeline` batches the style mutations and style reads to speed up the performance and avoid document reflows.

* It hints the browser to set up appropriate optimisations for an animation using `will-change` but in an optimal way to avoid high memory consumption

* Provides APIs for getting information out of an animation

But there are some challenges. Read more [here](#challenges).

## Install

```
npm install animated-timeline
```

or if you use yarn

```
yarn add animated-timeline
```

**This library also depends on `react` and `react-dom` so make sure you've them installed.**

## Browser support

| Chrome | Safari | IE / EDGE | Firefox | Opera |
| ------ | :----: | --------: | ------: | ----: |
| 24+    |   6+   |       10+ |     32+ |   15+ |

## Usage

**Basic example**

```js
import React from 'react'

import { Timeline, helpers } from 'animated-timeline'

const { transition } = helpers;

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink',
  marginTop: 30
};

// Timeline model
const Animated = Timeline({
  direction: 'alternate',
  iterations: 1
});

class App extends React.Component {
  componentDidMount() {
    // Animation model
    Animated.value({
      elements: this.one,
      opacity: transition({ from: 0.2, to: 0.8 }),
      rotate: {
        value: transition({ from: 360, to: 180 })
      }
    }).start();
  }

  render() {
    return <div ref={one => (this.one = one)} style={styles} />;
  }
}
```

<p align='center'>
  <img src='./media/basic.gif' />
</p>

To animate an object, you will need to specify properties for timing model like `duration`, `delay`, `iterations` and animation model like `elements` for animating an element or an array of elements, `transform`, `color`, `opacity` etc.

## Animation types

`animated-timeline` lets you perform:

* Sequence based animations

* Timing based animations

* Keyframes

* Spring based animations

### Sequence based animations

```js
import React, { Component } from 'react'

import { Timeline, helpers } from 'animated-timeline'

const { transition } = helpers

const styles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink',
  marginTop: 30
};

const Animated = Timeline({
  direction: 'alternate',
  easing: 'easeInOutSine',
  iterations: 1,
})

class App extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: '10turn',
    })
      .value({
        elements: this.two,
        translateX: transition({ from: 10, to: 120 }),
        opacity: transition({ from: 0.2, to: 0.8 }),
        rotate: '10turn',
      })
      .start()
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one => (this.one = one)} style={styles} />
        <div ref={two => (this.two = two)} style={styles} />
      </React.Fragment>
    )
  }
}
```

<p align="center">
  <img src="./sequence.gif" />
</p>


## Documentation

## Challenges

* Complex layout animations

* Motion path, SVGs

## Contributing

See the contributing guide

## License

MIT
