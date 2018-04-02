import React from "react";
import { render } from "react-dom";

import { Basic } from "../examples/Basic";
import { Sequence } from "../examples/Sequence";
import { Multiple } from "../examples/MultipleInstance";
import { KeyframeExample } from "../examples/Keyframes";
import { Lifecycle } from "../examples/Lifecycle";
import { Mover } from "../examples/Mover";
import { PromiseAPI } from "../examples/PromiseAPI";
import { Timing } from "../examples/Timing";
import { AnimateExample } from "../examples/AnimateComponent";
import { AdvanceAnimated } from "../examples/AdvanceAnimated";
import { Spring } from "../examples/Spring";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <PromiseAPI />
      </React.Fragment>
    );
  }
}

render(<App />, document.getElementById("root"));
