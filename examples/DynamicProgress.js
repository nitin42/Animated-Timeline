import React, { Component } from "react";
import hx from "colornames";

import { Timeline, helpers } from "../src";
import { boxStyles } from "./styles";

const { start, startBefore } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  reversed: true,
  easing: "linear",
  duration: 2000,
  loop: true
});

const { Animated, AnimationTimeline } = timeline.init();

export class DynamicProgress extends Component {
  state = {
    value: 0,
    playing: false,
    reset: false,
    reverse: false,
    restart: false
  };

  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 0, to: 600 }),
      opacity: 0.8,
      backgroundColor: start({
        from: hx("cyan"),
        to: hx("red")
      }),
      rotate: {
        value: 360,
        easing: "easeInOutSine"
      }
    });
  }

  handleChange = e => this.setState({ value: e.target.value });

  render() {
    return (
      <React.Fragment>
        <AnimationTimeline
          lifecycle={{
            onUpdate: ({ progress }) => {
              this.state.value = isNaN(progress) ? this.state.value : progress;
            }
          }}
          start={this.state.playing}
          stop={!this.state.playing}
          reset={this.state.reset}
          reverse={this.state.reverse}
          restart={this.state.restart}
          seek={ctrl => ctrl.custom(({ progress }) => this.state.value)}
        />
        <div className="one" ref={one => (this.one = one)} style={boxStyles} />
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button
          onClick={e => this.setState(state => ({ playing: !state.playing }))}
        >
          {this.state.playing ? "Stop" : "Start"}
        </button>
        <button
          onClick={e => this.setState(state => ({ reset: !state.reset }))}
        >
          Reset
        </button>
        <button
          onClick={e => this.setState(state => ({ reverse: !state.reverse }))}
        >
          Reverse
        </button>
        <button
          onClick={e => this.setState(state => ({ restart: !state.restart }))}
        >
          Restart
        </button>
      </React.Fragment>
    );
  }
}
