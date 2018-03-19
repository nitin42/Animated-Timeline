import React from 'react'
import { render } from 'react-dom'

import { TimelineSyncExample } from '../examples/TimelineSync'

class App extends React.Component {
  state = { value: 0, play: false }

  handleChange = e => {
    this.setState({ value: e.target.value })
  }

  handleClick = e => {
    this.setState(prevState => ({
      play: !prevState.play,
    }))
  }

  render() {
    return (
      <React.Fragment>
        <TimelineSyncExample
          value={this.state.value}
          play={this.state.play}
          restart={this.state.restart}
          reverse={this.state.reverse}
          update={({ progress }) => this.state.value = progress}
        />
        <input
          type="range"
          value={this.state.value}
          onChange={this.handleChange}
        />
        <button
          onClick={this.handleClick}
          style={{ border: '2px solide pink', padding: '2px' }}
        >
          {this.state.play ? 'Playing' : 'Stop'}
        </button>
      </React.Fragment>
    )
  }
}

render(<App />, document.getElementById('root'))
