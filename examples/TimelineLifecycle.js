// import React, { Component } from 'react'
//
// import hx from 'colornames'
//
// import { Timeline, helpers } from '../src'
// import { boxStyles } from './styles'
//
// const { start, startBefore, getEasings } = helpers
//
// const timeline = new Timeline({
//   direction: 'alternate',
//   easing: 'easeInOutSine',
//   speed: 0.7,
// })
//
// const { Animated, AnimationTimeline } = timeline.init()
//
// export class TimelineLifecycle extends Component {
//   componentDidMount() {
//     Animated.value({
//       elements: this.one,
//       translateX: start({ from: 500, to: 20 }),
//       opacity: 0.8,
//       backgroundColor: start({
//         from: hx('cyan'),
//         to: hx('red'),
//       }),
//       rotate: {
//         value: 360,
//         easing: 'easeInOutSine',
//       },
//     }).start()
//   }
//
//   render() {
//     return (
//       <React.Fragment>
//         <AnimationTimeline
//           lifecycle={{
//             // Called when the animation starts
//             // If there is any delay, then it will be invoked after that delay timeout
//             onStart: obj => {
//               // console.log('Started...')
//             },
//             // Invoked whenever there is any new update (state updates, events)
//             // Avoiding calling setState here because React limits the number of nested updates to prevent infinite loops.
//             // You can sync the animation progress with the input value here
//             onUpdate: ({ progress }) => {
//               // console.log("Updating...");
//             },
//             // Frame loop (called every frame)
//             tick: obj => {
//               // console.log("Loop...");
//             },
//             // Invoked when the animation is done
//             onComplete: ({ completed }) => {
//               // console.log('Completed: ' + completed);
//               // console.log('Starting again...');
//               if (completed) {
//                 Animated.reverse()
//                 Animated.start()
//               }
//             },
//           }}
//         />
//         <div
//           className="one"
//           id="one"
//           ref={one => (this.one = one)}
//           style={{ ...boxStyles }}
//         />
//       </React.Fragment>
//     )
//   }
// }
import React, { Component } from "react";

import { Timeline, helpers } from "../src";

const { start } = helpers;

const timeline = new Timeline({
  direction: "alternate",
  easing: "easeInOutSine",
  loop: true,
  duration: 2000
});

const { Animated } = timeline.init();

export class TimelineLifecycle extends Component {
  componentDidMount() {
    Animated.value({
      elements: this.one,
      translateX: start({ from: 500, to: 10 }),
      opacity: start({ from: 0.4, to: 0.9 }),
      rotate: {
        value: 360,
        easing: "easeInOutSine"
      }
    })
      .value({
        elements: ".two",
        translateX: start({ from: 10, to: 500 }),
        opacity: start({ from: 0.2, to: 0.5 })
      })
      .value({
        elements: "#three",
        translateX: start({ from: 300, to: 700 }),
        opacity: start({ from: 0.4, to: 0.6 }),
        rotate: {
          value: 180,
          easing: "easeInOutSine",
          direction: "alternate"
        }
      });

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
