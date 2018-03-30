// import React, { Component } from "react";
//
// import { boxStyles } from "./styles";
//
// const { transition } = helpers;
//
// const rebound = require("rebound");
//
// function createSpring(friction, tension) {
//   const springSystem = new rebound.SpringSystem();
//   let spring = springSystem.createSpring(friction, tension);
//
//   let id = null;
//
//   spring.init = (prevState, el, prop, options) => {
//     // el.style.transform = prop + '(' + prevState + ')'
//
//     spring.addListener({
//       onSpringUpdate: spr => {
//         var val = spr.getCurrentValue();
//         val = rebound.MathUtil.mapValueInRange(val, 1, 10, 200, 500);
//         if (prop === "rotate") val = String(val).concat("deg");
//
//         id = window.requestAnimationFrame(() => {
//           el.style.transform = prop + "(" + val + ")";
//         });
//       }
//     });
//   };
//
//   spring.stop = () => id && window.cancelAnimationFrame(id);
//
//   spring.setValue = spring.setEndValue;
//
//   spring.inMotion = spring.isAtRest;
//
//   spring.stop = () => spring.setCurrentValue(spring.getCurrentValue());
//
//   spring.restart = () => {
//     spring.setEndValue(spring.getEndValue());
//     spring.setVelocity(50);
//     // spring.setVelocity(12350)
//   };
//
//   return spring;
// }
//
// const spring = createSpring(12, 3);
//
// export class Basic extends Component {
//   state = { value: "90deg", scale: 1, motion: false };
//
//   componentDidMount() {
//     spring.init(this.state.value, this.one, "rotate");
//   }
//
//   handleUp = e => {
//     spring.setValue(5);
//     spring.setVelocity(30);
//   };
//
//   handleDown = e => {
//     spring.setValue(3);
//     spring.setVelocity(10);
//   };
//
//   render() {
//     return (
//       <div>
//         <div
//           ref={one => (this.one = one)}
//           onClick={this.handleClick}
//           onMouseUp={this.handleUp}
//           onMouseDown={this.handleDown}
//           style={{ margin: "0 auto", width: "50%", ...boxStyles }}
//         />
//         <button onClick={() => spring.stop()}>Click</button>
//         <button onClick={() => spring.restart()}>Click Again</button>
//       </div>
//     );
//   }
// }
