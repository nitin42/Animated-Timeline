import React, { Component } from "react";

import { Timeline, helpers, createMover } from "../src";

import { boxStyles } from "./styles";

const { transition } = helpers;

const Animated = Timeline({
  easing: "easeInOutSine",
  iterations: 1
});

const move = createMover(Animated);

export class Mover extends Component {
  state = {
    value: 0
  };

  handleChange = e => {
    const value = e.target.value;
    // With a number value
    // move(value)

    // or with a callback function that must return a number value
    move(({ duration }) => duration - value * 10);

    this.setState({ value });
  };

  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: "20turn"
    }).start();
  }

  render() {
    return (
      <div>
        <div ref={one => (this.one = one)} style={boxStyles} />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
