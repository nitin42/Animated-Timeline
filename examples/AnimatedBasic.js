import React from "react";

import hx from "colornames";

import { Basic, helpers } from "../src";

const AnimationAttributes = {
  translateX: helpers.start({ from: 10, to: 400 }),
  speed: 0.4,
  opacity: helpers.start({
    from: 0.9,
    to: 0.4
  }),
  backgroundColor: helpers.start({
    from: hx("pink"),
    to: hx("orange")
  }),
  elasticity: 900,
  rotate: {
    value: 132,
    direction: "alternate"
  }
};

export class AnimatedBasic extends React.Component {
  render() {
    return (
      <div>
        <Basic attributes={AnimationAttributes}>
          <div
            style={{ width: "200px", height: "200px", backgroundColor: "red" }}
          />
        </Basic>
      </div>
    );
  }
}
