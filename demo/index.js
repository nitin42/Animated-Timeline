import React from 'react'
import { render } from 'react-dom'

import { TimelineBasic } from '../examples/TimelineBasic'
import { TimelineAdvance } from '../examples/TimelineAdvance'
import { TimelineOffset } from '../examples/TimelineOffset'

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <TimelineOffset />
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
