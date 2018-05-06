# Spring API

## Examples

* [Basic](../examples/spring/Spring.js)

* [Changing velocity](../examples/spring/Velocity.js)

* [Bounciness](../examples/spring/Bounciness.js)

* [Blending colors](../examples/spring/Blend.js)

* [Spring callback functions](../examples/spring/Callback.js)

* [Spring playback controls](../examples/spring/Controls.js)

* [Handling interpolations](../examples/spring/Interpolations.js)

* [Multiple instances of `Spring`](../examples/spring/Multiple.js)

* [Promise based API](../examples/spring/SpringPromise.js)

* [Start the animation on mount](../examples/spring/Start.js)

**`Spring`**

A function that creates a spring system with an optional options object.

```js
const s = Spring()
```

**Passing options to `Spring`**

You can pass an option object with two properties to `Spring` function. You can either pass properties `friction` and `tension` or `bounciness` and `speed`.

```js
const s = Spring({ friction: 10, tension: 5 })
```

or

```js
const s = Spring({ bounciness: 23, speed: 12 })
```

**`animate({ options })`**

To animate an element using spring physics, use the `animate` method. The `animate` method accepts a property to animate, spring options, a callback to handle interpolations and an option to toggle oscillation.

```js
Spring().animate({
  property: string, // transform or css property
  map: {
    inputRange: [A, B],
    outputRange: [C, D]
  },
  blend: {
    colors: [hex1, hex2],
    range: [A, B]
  },
  interpolation: (style, value, options) => void,
  shouldOscillate: boolean
})
```

Example -

```js
const s = Spring({ friction: 15, tension: 4 })

class App extends React.Component {
  componentDidMount() {
    s.animate({
      property: 'scale',
      map: {
        inputRange: [0, 1],
        outputRange: [1, 2]
      }
    })
  }

  render() {
    return (
      <s.div
        onMouseUp={() => s.setValue(0)}
        onMouseDown={() => s.setValue(1)}
      />
    )
  }
}
```

**`property`**

Specify the property of an element you wish to animate. It can be a transform or css property.

```js
Spring().animate({ property: 'scale' })
```

**`map`**

An object with two properties, `inputRange` and `outputRange`.

`inputRange` accepts input ranges which will be handled via `setValue(input_range_value)` method and `outputRange` accepts output ranges which determine the output value of the property.

For example -

```js
const s = Spring()

s.animate({ property: 'scale', map: { inputRange: [0, 1], outputRange: [1, 2] } })

s.setValue(1) // Set the input value 1. This will map to output value 2
```

So the value of property `scale` in this case will be `2`.

**`blend`**

Similar to `map` but use this property only when animating a color property like `backgroundColor`. It accepts an object with two properties, `colors` an array of hex color codes, and `range` an array of input range to mix the hex color codes.

For example -

```js
const s = Spring()

s.animate({
  property: 'backgroundColor',
  blend: { colors: ['#FF0000', '#800000'], range: [0, 200] }
})

s.setValue(input_range)

// Pass any input value between the range 0-200.

// Eg - s.setValue(40)
```

Check out [this](../examples/spring/Blend.js) example.

**`interpolation`**

To handle interpolations, use the callback `interpolation`. The callback function receives the `style` object of the element being animated, the current spring `value` and [helper options](#helper-options).

```js
const s = Spring({ friction: 15, tension: 3 })

class App extends React.Component {
  state = {
    translateX: '',
    backgroundColor: '#a8123a'
  }

  componentDidMount() {
    s.animate({
      property: 'border-radius',
      map: {
        inputRange: [0, 1],
        outputRange: ['1px', '40px']
      },
      interpolation: (style, value, options) =>
        this.handleInterpolations(value, options)
    })
  }

  componentWillUnmount() {
    s.remove()
  }

  handleInterpolations = (value, options) => {
    this.setState({
      translateX: options.em(options.mapValues(value, 3, 40, 0, 1)),
      backgroundColor: options.interpolateColor(
        value,
        '#4a79c4',
        '#a8123a',
        0,
        60
      )
    })
  }

  render() {
    return (
      <s.div
        onMouseUp={() => s.setValue(0)}
        onMouseDown={() => s.setValue(1)}
        style={{
          ...styles,
          transform: `translateX(${this.state.translateX})`,
          backgroundColor: this.state.backgroundColor
        }}
      />
    )
  }
}
```

**`shouldOscillate`**

Toggle the oscillation using `shouldOscillate` flag.

```js
Spring().animate({ shouldOscillate: false })
```

**`setValue`**

A method that accepts an input value and starts the animation.

```js
s.setValue(input_value)
```

### Playback controls

**`start()`**

Starts the animation.

> Note - This method will only work if the spring is in paused state. Use `setValue` to start the animation initially and then use this playback method to control the animation execution.

**`stop()`**

Stop the animaton

**`startAt(input_value)`**

Start the animation with an input value.

**`moveTo(value)`**

Changes the position of an element without starting the animation. This is useful for moving elements to a different position with the value (without calling the animation). After moving to a different position, use `setValue(value)` to start the animation from that position. A good example is dragging of the elements

**`seek(value)`**

Seek the animation with an input value.

**`reset()`**

Reset the animation

**`reverse()`**

Reverse the animation

Check out [this](../examples/spring/Controls
.js) example for using the playback controls

### Utilities

**`Spring().infinite(startValue, endValue, duration)`**

Run infinite iterations of spring animation. Accepts a start value to start the animation from, an end value to terminate the animation at and a duration value. Check out [this](../examples/spring/Callback.js) example.

**`Spring().setValueVelocity({ value: some_value, velocity: some_velocity_value })`**

Sets both, the value and velocity, and starts the animation.

**`Spring().remove()`**

Clears all the subscriptions and deregister the spring.

**`Spring().exceeded()`**

Returns true or false. It determines whether the spring exceeded the input value passed to `setValue` or not.

**`state()`**

```js
const s = Spring()

s.state()
```

Returns an object (given below) which describes the current state of a spring.

```js
{
  currentValue: number,
  // Value at which spring will be at rest
  endValue: number,
  // Current velocity
  velocity: number,
  // Is at rest ?
  springAtRest: boolean,
  // Is oscillating ?
  isOscillating: boolean,
  // Exceeded the end value ?
  exceeded: boolean
}
```

**`Spring().oncancel`**

Returns a promise which gets resolved when the animation is cancelled. Check out [this](../examples/spring/SpringPromise.js) example

### Callback functions

Spring callback functions are invoked during different phases of animation.

**`Spring().onStart`**

invoked when the animation starts

```js
Spring().onStart = props => console.log('Animation started...')
```

**`Spring().onRest`**

invoked when the spring is at rest.

```js
const s = Spring()

s.onRest = props => s.infinite(0, 1, 2000)
```

### Helper options

`interpolation` callback also receives some helper options which are given below -

* **`mapValues(value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number)`**

Accepts spring value, `from range` and `to range`. `from range` is usually the input range defined in `map`.

Example -

```js
const s = Spring()

function applyInterpolation(value, options) {
  setState({
    translateX: options.mapValues(value, 0, 1, 10, 20)
  })
}

s.animate({
  property: 'scale',
  map: {
    inputRange: [0, 1],
    outputRange: [1, 2]
  },
  interpolation: (style, value, options) => applyInterpolation(value, options)
})
```

* **`interpolateColor(value: number, startColorStr: string, endColorStr: string, fromLow: number = 0, fromHigh: number = 1)`**

Accepts spring value, `startColorStr`, `endColorStr` and an optional input range `fromLow` and `fromHigh`.

Example -

```js
const s = Spring()

function applyInterpolation(value, options) {
  setState({
    backgroundColor: options.interpolateColor(value, '#4286f4', '#3a774f', 0, 200)
  })
}

s.animate({
  property: 'scale',
  map: {
    inputRange: [0, 1],
    outputRange: [1, 2]
  },
  interpolation: (style, value, options) => applyInterpolation(value, options)
})
```

* **`radiansToDegrees(radians: number)`** - Convert radians to degrees.

* **`degreesToRadians(degrees: number)`** - Convert degrees to radians.

* **`em`** - Convert value to em

* **`px`** - Convert value to px

* **`deg`** - Convert value to deg

* **`rem`** - Convert value to rem

* **`rad`** - Convert value to rad

* **`grad`** - Convert value to grad

* **`turn`** - Convert value to turn

Check out [this](../examples/spring/Interpolations.js) example for more details about helper options

See next ▶️

[Component API](./Component.md)

[Timeline API](./Timeline.md)

[Keyframes API](./Keyframes.md)

[helpers object](./helpers.md)

[Animation properties](./properties.md)
