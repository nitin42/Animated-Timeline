import React from 'react'
import { render } from 'react-dom'

import { boxStyles } from '../examples/styles'

import { AnimateBasic } from '../examples/Animate-Component/Basic'
import { AnimateAdvance } from '../examples/Animate-Component/Advance'
import { AnimateControls } from '../examples/Animate-Component/Controls'

import { BasicTimeline } from '../examples/Timeline/basic'
import { SequenceTimeline } from '../examples/Timeline/sequence'
import { Timing } from '../examples/Timeline/timing'
import { KeyframesExample } from '../examples/Keyframes'
import { SeekBasic } from '../examples/Seeking/basic'
import { Lifecycle } from '../examples/Lifecycle'
import { PromiseAPI } from '../examples/Promise'
import { ChangeSpeed } from '../examples/Extra/speed'
import { Finish } from '../examples/Extra/Finish'
import { SpringSystem } from '../examples/spring/Spring'
import { SpringInterpolate } from '../examples/spring/Interpolations'
import { SpringCallback } from '../examples/spring/Callback'
import { SpringControls } from '../examples/spring/Controls'
import { SpringMultiple } from '../examples/spring/Multiple'
import { SpringStart } from '../examples/spring/Start'
import { SpringVelocity } from '../examples/spring/Velocity'
import { SpringBounciness } from '../examples/spring/Bounciness'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <SpringMultiple />
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
