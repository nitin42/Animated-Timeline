import React from 'react'
import { render } from 'react-dom'

import { boxStyles } from '../examples/styles'

import { Basic } from '../examples/Basic'
import { Sequence } from '../examples/Sequence'
import { Multiple } from '../examples/MultipleInstance'
import { KeyframeExample } from '../examples/Keyframes'
import { Lifecycle } from '../examples/Lifecycle'
import { Mover } from '../examples/Mover'
import { PromiseAPI } from '../examples/PromiseAPI'
import { Timing } from '../examples/Timing'
import { Spring } from '../examples/Spring'

import { AnimateBasic } from '../examples/Animate-Component/Basic'
import { AnimateAdvance } from '../examples/Animate-Component/Advance'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <PromiseAPI />
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
