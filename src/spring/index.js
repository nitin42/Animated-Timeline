const rebound = require('rebound')

function createSpring(friction, tension) {
  const springSystem = new rebound.SpringSystem()
  let spring = springSystem.createSpring(friction, tension)
  let id = null

  spring.init = (prevState, el, prop, options) => {
    // el.style.transform = prop + '(' + prevState + ')'

    spring.addListener({
      onSpringUpdate: spr => {
        var val = spr.getCurrentValue()
        // val = rebound.MathUtil.mapValueInRange(val, from[0], from[1], to[0], to[1]);
        if (prop === 'rotate') val = String(val).concat('deg')

        id = window.requestAnimationFrame(
          () => (el.style.transform = prop + '(' + val + ')')
        )
      },
    })
  }

  spring.stop = () => id && window.cancelAnimationFrame(id)

  spring.setValue = spring.setEndValue

  return spring
}

class App extends Component {
  state = {
    value: 1,
  }

  componentDidMount() {
    spring.init(this.state.value, '#one', 'scale', {
      mapValues: {
        from: [],
        to: []
      },
      interpolateColors: {
        value: 1,
        startColor: 'red',
        endColor: 'blue',
        from: [0, 200],
        rgb: false,
      }
    })
  }

  render() {
    return (
      <div
        id="one"
        onMouseUp={() => spring.setValue(4)}
        onMouseDown={() => spring.setValue(3)}
      >
        Hey, Nitin!
      </div>
    )
  }
}

// Spring system for the animatione engine

const spring = createSpring(friction, tension)

const mapValues = {
  from: [0, 1],
  to: [0, 0.5]
}

const interpolateColors = {
  value: 1,
  startColor: 'red',
  endColor: 'blue',
  from: [0, 200],
  rgb: false,
}

componentDidMount() {
  spring.init(
    this.state.value, // Initial value for the animation property (scale(1))
    element, // refs or id or classname
    properties, // 'scale'
    { mapValues, interpolateColors }
  )
}

handleUp() {
  spring.setValue(5)
}

handleDown() {
  spring.setValue(3)
}

<div id="hello-world" onMouseUp={handleUp} onMouseDown={handleDown}>
  Hello World
</div>
