# Timeline

<br/><br/>

<p align="center">
  <img src="https://i.gyazo.com/92335601b07bd758f45bb64ca8bac912.gif" />
</p>

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

**Timeline** is an animation library for React which makes it painless to create timeline and playback based animations. It is inspired from the existing physics based models and is here just because of the hard work that has already been done by the great developers. It focuses on improving the developer experience and has an API which is relatively similar to React Native. It also shares the same philosophy with React Native which is -

> **_focus on declarative relationships between inputs and outputs, with configurable transforms in between, and simple start/stop methods to control time-based animation execution._**

Along with `start` and `stop` methods it also provides -

* `restart` - To replay the animation

* `reset` - To reset animation timeline

* `reverse` - To reverse the animation

* `seek` - An interactive way to change the animation progress value or duration value.

It also provides lifecycle hooks that gets executed during different phases of an animation. Read more [here](./docs/lifecycle.md)

Besides the library usage, **Timeline** aims to amplify the usage of interaction design in our development process and also encourages to create interactive tools on top of the API that it already provides to create animations.

## Features

* Provides controls for time-based execution of an animation 🎮

* Lets you create sequence based animations 🔗

* Provides lifecycle hooks which gets executed in different phases of an animation ⚙️

* Dynamically change the animation progress or sync the animation progress (or duration) value with an input value ✔️

## Install

```
npm install animated-timeline
```

or if you use yarn

```
yarn add animated-timeline
```

**This library also depends on `react` and `react-dom` so make sure you've already installed it.**

## Browser support

| Chrome | Safari | IE / EDGE | Firefox | Opera |
| ------ | :----: | --------: | ------: | ----: |
| 24+    |   6+   |       10+ |     32+ |   15+ |

## Usage

```js
import React, { Component } from "react";

import { Timeline, helpers } from "animated-timeline";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  duration: 2000
});

const { Animated } = timeline.init();

class App extends Component {
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
      <div
        ref={one => (this.one = one)}
        style={{
          width: "20px",
          height: "20px",
          backgroundColor: "pink"
        }}
      />
    );
  }
}
```

**Result**

<p align="center">
  <img src="./media/basic.gif" />
</p>

In the above example, we created a `timeline` instance by passing an object of animation attributes to the `Timeline` class constructor. The animation attributes are used to configure an animation timeline so you can decide what should be `direction`, `easing`, `duration` value etc, throughout the animation timeline.

> Note - Defining animation attributes is optional and can be skipped.

After that, we initialise the timeline by calling the instance method `init` on our timeline instance. This returns the main `Animated` object and also an `AnimationTimeline` component (we will look into this later).

The `Animated` object is used to hook up one or more style attributes of an element or elements which you want to animate. This is done by calling `.value()` on `Animated` and passing an object of animatable properties.

You will need to specify a selector (`className`, `id` or a reference to the element) to animate an element otherwise `Animated` won't be able to infer which elements are supposed to be animated.

[**Learn more about selector and animatable properties**](./docs/properties.md).

`Animated.value` can bind to style properties, and can also be chained for performing sequence based animations (we will look into this later). A single `Animated.value` can drive any number of properties (similar to [React Native]())

Now to start the animation, call `.start()` on Animated.

```js
Animated.value({ ...props }).start();

// or

Animated.value({
  ...props
});

// Starts the animation
Animated.start();
```

## Documentation

See the complete documentation [here](./docs).

## Contributing

See the contributing guide

## License

MIT
