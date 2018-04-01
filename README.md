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

[See example code for sequence based animations](./examples/Sequence.js)

<p align="center">
  <img src="./media/sequence.gif" />
</p>

### Timing based animations

[See example code for timing based animations](./examples/Timing.js)


<p align="center">
  <img src="./media/timing.gif" />
</p>

### Keyframes

[**See example code for keyframes**](./examples/Keyframes.js)

<p align="center">
  <img src="./media/keyframes.gif" />
</p>

### Changing the animation duration

You can also change the animation duration using an input value. In the below example, we are passing the value for the input type `range`.

[See example code](./examples/Mover.js)

<p align="center">
  <img src="./media/mover.gif" />
</p>

### Spring based animations

[See example code for spring based animations](./examples/Spring.js)

<p align="center">
  <img src="./media/spring.gif" />
</p>

### More examples

See more examples for -

* [**Animating multiple instances**](./examples/MultipleInstance.js)

* [**Managing animation lifecycle**](./examples/Lifecycle.js)

* [**Using promise based APIs to control `initialisation` and `cancellation` events for an animation**](./examples/PromiseAPI.js)

### Basic React component

`animated-timeline` also provides a basic component called `Animate` to animate elements instead of using `Timeline` constructor.

```js
import React, { Component } from 'react'

import { Animate, helpers } from 'animated-timeline'

const boxStyles = {
  width: '20px',
  height: '20px',
  backgroundColor: 'pink',
  marginTop: 30,
}

class App extends Component {
  render() {
    return (
      <div>
        <Animate
          // Timeline model props
          timingProps={{
            duration: 1000,
          }}
          // Animation model props
          animationProps={{
            rotate: {
              value: helpers.transition({ from: 360, to: 180 }),
            },
          }}
          // Animation lifecycle
          lifecycle={{
            onComplete: ({ completed, controller: { restart, reverse } }) => {
              if (completed) {
                restart()
                reverse()
              }
            },
          }}
        >
          <div
            style={boxStyles}
            onClick={e => this.setState(state => ({ start: !state.start }))}
          />
        </Animate>
      </div>
    )
  }
}
```

<br/><br/>
**If that sounds interesting to you**, [**then let's dive into the detailed documentation which covers example use cases, API reference, and some more examples 😃**](./docs)

## Challenges

* Complex layout animations

* Motion path, SVGs

## Contributing

See the contributing guide

## License

MIT
