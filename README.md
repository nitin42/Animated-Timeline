# Timeline

<br/><br/>

<p align="center">
  <img src="https://i.gyazo.com/92335601b07bd758f45bb64ca8bac912.gif" />
</p>

> Create timeline and playback based animations in React

## Table of contents

* [Introduction](#introduction)

* [Install]()

* [Browser support]()

* [Usage]()

* [Reference]()

* [Contributing]()

* [License]()

## Introduction

**Timeline** is an animation library for React to create timeline and playback animations without any pain. It allows you to create beautiful animations with ease using React and hence minimising the cognitive friction in your development process because creating animation should always be a fun thing. It is inspired from the existing physics based models and is here just because of the hard work that has already been done by the great developers. It focuses on improving the developer experience and has an API which is relatively similar to React Native. It also shares the same philosophy with React Native which is -

> **_focus on declarative relationships between inputs and outputs, with configurable transforms in between, and simple start/stop methods to control time-based animation execution._**

Along with `start` and `stop` methods it also provides -

* `restart` - To replay the animation

* `reset` - To reset animation timeline

* `reverse` - To reverse the animation

* `seek` - An interactive way to control the animation throughout it's progress.

It also provides lifecycle hooks that gets executed during different phases of an animation. Read more [here]()

Besides the library usage, **Timeline** aims to amplify the usage of interaction design in our development process and also encourages to create interactive tools on top of the API that it already provides to create animations.

## Install

```
npm install animated-timeline
```

or if you use yarn

```
yarn add animated-timeline
```

**This library also depends on `react` and `react-dom` so make sure you've already installed it.**

## Usage

```js
import React, { Component } from "react";

import { Timeline, helpers } from "animated-timeline";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  duration: 4000
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

<p align="center">
  <img src="basic.gif" />
</p>

## Browser support

| Chrome | Safari | IE / EDGE | Firefox | Opera |
| ------ | :----: | --------: | ------: | ----: |
| 24+    |   6+   |       10+ |     32+ |   15+ |
