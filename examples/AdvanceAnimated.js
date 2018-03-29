import React, { Component } from "react";

import { Animate, helpers } from "../src";

import { boxStyles } from "./styles";

export class AdvanceAnimated extends Component {
  state = {
    start: true
  };

  render() {
    return (
      <div>
        <Animate
          timingProps={{
            duration: 2000
          }}
          animationProps={{
            rotate: helpers.transition({ from: "360deg", to: "180deg" }),
            opacity: helpers.transition({ from: 0.2, to: 0.8 })
          }}
          lifecycle={{
            onComplete: ({ completed, controller: { restart, reverse } }) => {
              if (completed) {
                restart();
                reverse();
              }
            }
          }}
          shouldStart={this.state.start}
          shouldStop={!this.state.start}
        >
          <div
            style={boxStyles}
            onClick={e => this.setState(state => ({ start: !state.start }))}
          />
        </Animate>
        <p>Click on the box to perform playback animations</p>
      </div>
    );
  }
}
