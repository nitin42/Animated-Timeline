import React, { Component } from "react";
import hx from "colornames";

import { Timeline, helpers } from "../src";
import { boxStyles } from "./styles";

const { start, startBefore, startAfter, random } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  speed: 0.5
});

const { Animated } = timeline.init();

export class TimelineOffset extends Component {
  state = { stop: false, value: 30 };

  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 20 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      rotate: {
        value: 180
      }
    })
      .value({
        elements: this.two,
        translateX: 300,
        elasticity: 900,
        rotate: {
          value: 360,
          easing: "easeInOutSine"
        },
        // Start animating this 1.2s before the previous animation ends
        offset: startBefore(1200)
      })
      .value({
        elements: this.three,
        translateX: 500,
        elasticity: 1000,
        // Start animating this 1.1s after the previous animation ends
        offset: startAfter(100)
      });

    Animated.start();
  }

  render() {
    return (
      <React.Fragment>
        <div ref={one => (this.one = one)} style={boxStyles}>
          A
        </div>
        <div
          ref={two => (this.two = two)}
          style={{ ...boxStyles, marginTop: 20 }}
        >
          B
        </div>
        <div
          ref={three => (this.three = three)}
          style={{ ...boxStyles, marginTop: 30 }}
        >
          C
        </div>
      </React.Fragment>
    );
  }
}
