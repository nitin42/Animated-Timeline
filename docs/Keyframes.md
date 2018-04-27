# Keyframes

Define keyframes for a property using the constructor `Keyframes`. The object created by `Keyframes` has a property (one and only) called `frames` which you can then add it to an animation property.

## Example

```js
import { Animate, Keyframes } from 'animated-timeline'

const x = new Keyframes()
  .value({
    value: 10,
    duration: 1000
  })
  .value({
    value: 50,
    duration: 2000,
    offset: 0.8
  })
  .value({
    value: 0,
    duration: 3000
  })

function App() {
  return (
    <Animate
      timingProps={{
        duration: 4000,
      }}
      animationProps={{
        // Add frames to the property `translateX`
        translateX: x.frames
      }}
    />
      <div style={some_styles}
    </Animate>
  )
}
```

## Defining keyframes-selector

To define keyframes-selector i.e percentage of the animation duration, use the property `offset`.

For example -

```css
@keyframes xyz {
  45% {
    height: 30px;
  }
}
```

The above css snippet will converted to -

```js
const xyz = new Keyframes().value({ offset: 0.45, height: '30px' })
```

with `Keyframes` constructor.

For multiple endpoints, chain the `.value({})` calls.

```css
@keyframes xyz {
  0% {
    top: 0px;
    background: red;
  }
  25% {
    top: 0px;
    background: blue;
  }
  50% {
    top: 100px;
    background: yellow;
  }
  75% {
    top: 100px;
    background: green;
  }
  100% {
    top: 0px;
    background: red;
  }
}

div {
  animation: xyz;
}
```

This will be written as -

```js
import { Animate, Keyframes } from 'animated-timeline'

const xyz = new Keyframes()
  .value({ top: 0, background: 'red' })
  .value({ top: 100, offset: 0.25, background: 'blue' })
  .value({ offset: 0.5, background: 'yellow', top: 100 })
  .value({
    offset: 0.75,
    top: 100,
    background: 'green'
  })
  .value({
    offset: 1,
    top: o,
    background: 'red'
  })

function App() {
  return (
    <Animate
      {...timingProps}
      animationProps={{
        translateX: xyz.frames
      }}
    />
      {children}
    </Animate>
  )
}
```

## API

### `Keyframes`

Creates an object that has a property called `frames`

```js
const xyz = new Keyframes().value({ ...props })

console.log(xyz.frames)
```

## Examples

[Check out the examples for using `Keyframes`](../examples/Keyframes)
