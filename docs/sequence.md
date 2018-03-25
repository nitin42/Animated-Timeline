## Sequence based animations

You can also perform sequence based animations by chaining up multiple values using `.value()`. Let's take an example -

```js
import React, { Component } from "react";

import { Timeline, helpers } from "animated-timeline";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  duration: 2000
});

const { Animated } = timeline.init();

class App extends Component {
  componentDidMount() {
    Animated.value({
      // 1
      elements: this.one,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      rotate: {
        value: 360,
        easing: "easeInOutSine"
      }
    })
      .value({
        // 2
        elements: ".two",
        translateX: start({ from: 10, to: 500 }),
        opacity: start({ from: 0.2, to: 0.5 })
      })
      .value({
        // 3
        elements: "#three",
        translateX: start({ from: 300, to: 700 }),
        opacity: start({ from: 0.4, to: 0.6 }),
        rotate: {
          value: 180,
          easing: "easeInOutSine",
          direction: "alternate"
        }
      });

    // Start the animation
    Animated.start();
  }

  render() {
    const styles = {
      width: "20px",
      height: "20px",
      backgroundColor: "pink",
      marginTop: 10
    };

    return (
      <React.Fragment>
        <div ref={one => (this.one = one)} style={styles} />
        <div className="two" style={styles} />
        <div id="three" style={styles} />
      </React.Fragment>
    );
  }
}
```

<p align="center">
  <img src="../media/basic-6.gif" />
</p>
