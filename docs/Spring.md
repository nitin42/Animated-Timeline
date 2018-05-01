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
    input: [A, B],
    output: [C, D]
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
        input: [0, 1],
        output: [1, 2]
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

An object with two properties, `input` and `output`.

`input` accepts an array of values which will be handled via `setValue(input_value)` method and `output` accepts an array of values which determine the output value of the property.

For example -

```js
const s = Spring()

s.animate({ property: 'scale', map: { input: [0, 1], output: [1, 2] } })

s.setValue(1) // input value 1. This will map to output value 2
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

To handle interpolations, use the callback `interpolation`. The callback function receives the `style` object of the element being animated, the current spring `value` and [helper options]().

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
        input: [0, 1],
        output: ['1px', '40px']
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

**`infinite(startValue, endValue, duration)`**

Running infinite iterations of spring animation

**`setValueVelocity`**

Sets both, value and velocity.

**`remove()`**

Clears all the subscriptions and deregister the spring.

**`exceeded()`**

Determines whether the spring exceeded the input value passed to `setValue`.

**`state()`**

```js
const s = Spring()

s.animate({...props})

s.setValue(value)

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
  // Is overshoot clamping enabled ?
  isOscillating: boolean,
  // Exceeded the end value
  exceeded: boolean
}
```

**`oncancel`**

Returns a promise which gets resolved when the animation is cancelled. Check out [this](../examples/spring/SpringPromise.js) example

### Callback functions

Spring callback functions are invoked during different phases of animation.

**`onStart`**

invoked when the animation starts

```js
Spring().onStart = (props) => console.log('Animation started...')
```

**`onRest`**

invoked when the spring is at rest.

```js
const s = Spring()

s.onRest = (props) => s.infinite(0, 1, 2000)
```
