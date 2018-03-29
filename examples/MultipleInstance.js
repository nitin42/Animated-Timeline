import React, { Component } from "react";

import { Timeline, helpers } from "../src";

import { boxStyles } from "./styles";

const { transition } = helpers;

const Animated = Timeline({
  easing: "easeInOutSine",
  loop: 1
});

const AnimatedDup = Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: 2
});

export class Multiple extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: "20turn"
    }).start();

    AnimatedDup.value({
      elements: this.two,
      rotate: "40turn"
    }).start();
  }

  render() {
    return (
      <div>
        <div ref={one => (this.one = one)} style={boxStyles} />
        <div ref={two => (this.two = two)} style={boxStyles} />
      </div>
    );
  }
}
