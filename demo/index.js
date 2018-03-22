import React from 'react'
import { render } from 'react-dom'

import { TimelineBasic } from '../examples/TimelineBasic'
import { TimelineAdvance } from '../examples/TimelineAdvance'
import { TimelineOffset } from '../examples/TimelineOffset'
import { TimelineKeyframes } from '../examples/Keyframes'
import { TimelineLifecycle } from '../examples/TimelineLifecycle'
import { DynamicProgress } from '../examples/DynamicProgress'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1>Offset Example</h1>
        <TimelineOffset />
        {/* <h1>Basic Timeline</h1>
        <TimelineBasic />
        <h1>Advance Timeline</h1>
        <TimelineAdvance />
        <h1>Keyframes Timeline</h1>
        <TimelineKeyframes />
        <h1>Timeline Lifecycle</h1>
        <TimelineLifecycle />
        <h1>Dyanmic progress</h1>
        <DynamicProgress /> */}
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
