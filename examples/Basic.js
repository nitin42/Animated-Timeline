import React, { Component } from "react";

import { Timeline, helpers } from "../src";

import { boxStyles } from "./styles";

const { transition } = helpers;

const Animated = Timeline({
  direction: "alternate",
  loop: 1
});

export class Basic extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      opacity: transition({ from: 0.2, to: 0.8 }),
      rotate: {
        value: 360
      }
    }).start();
  }

  render() {
    return (
      <div
        ref={one => (this.one = one)}
        style={boxStyles}
        onClick={e => Animated.restart()}
      />
    );
  }
}
