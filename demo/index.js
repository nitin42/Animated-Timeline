import React from 'react'
import { render } from 'react-dom'

import { boxStyles } from '../examples/styles'

import { AnimateBasic } from '../examples/Animate-Component/Basic'
import { AnimateAdvance } from '../examples/Animate-Component/Advance'

import { BasicTimeline } from '../examples/Timeline/basic'
import { SequenceTimeline } from '../examples/Timeline/sequence'
import { Timing } from '../examples/Timeline/timing'

import { KeyframesExample } from '../examples/Keyframes'

import { SeekBasic } from '../examples/Seeking/basic'

import { Lifecycle } from '../examples/Lifecycle'

import { PromiseAPI } from '../examples/Promise'

import { ChangeSpeed } from '../examples/Extra/speed'

import { Finish } from '../examples/Extra/Finish'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <AnimateBasic />
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
