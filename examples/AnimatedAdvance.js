import React from "react";

import hx from "colornames";

import { Basic, helpers } from "../src";

export class AnimatedAdvance extends React.Component {
  state = {
    stop: true,
    restart: false,
    value: 0
  };

  handleChange = e => this.setState({ value: e.target.value });

  render() {
    return (
      <div>
        <Basic
          attributes={{
            translateX: helpers.start({ from: 10, to: 400 }),
            speed: 0.8,
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
          }}
          start={!this.state.stop}
          stop={this.state.stop}
          restart={this.state.restart}
          autoplay
          seek={ctrl => ctrl.default(this.state.value)}
          lifecycle={{
            onUpdate: ({ progress, duration }) => {
              this.state.value = progress;
            },
            onComplete: ({ completed, controller }) => {
              console.log("Completed... starting again!");
              if (completed) {
                controller.reverse();
                controller.start();
              }
            }
          }}
          lifecycle={{
            onComplete: ({ completed, controller }) => {
              if (completed) {
                controller.reverse();
                controller.start();
              }
            }
          }}
        >
          <div
            style={{ width: "200px", height: "200px", backgroundColor: "red" }}
            onClick={e => {
              this.setState(state => ({ stop: !state.stop, restart: false }));
            }}
          />
        </Basic>
        <input
          type="range"
          min="0"
          max="100"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button
          onClick={e => this.setState(state => ({ restart: !state.restart }))}
        >
          Restart
        </button>
      </div>
    );
  }
}
