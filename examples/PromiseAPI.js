import React, { Component } from "react";

import { Timeline, helpers } from "../src";

import { boxStyles } from "./styles";

const { transition } = helpers;

const Animated = Timeline({
  easing: "easeInOutSine",
  loop: 1
});

export class PromiseAPI extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: transition({ from: 10, to: 120 }),
      opacity: transition({ from: 0.8, to: 0.2 }),
      rotate: "20turn"
    }).start();

    // Done animating
    Animated.onfinish.then(res => console.log(res));
  }

  handleClick = e => {
    // Removes an element from the current animation timeline
    Animated.oncancel(this.one).then(res => console.log(res));
  };

  render() {
    return (
      <div
        ref={one => (this.one = one)}
        style={boxStyles}
        onClick={this.handleClick}
      />
    );
  }
}
