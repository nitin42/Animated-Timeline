# Keyframes

Define keyframes for a property (css or transform) using the constructor function `Keyframes`. The object created by `Keyframes` has a property (one and only) called `frames`.

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

The above css snippet will be written as -

```js
const xyz = new Keyframes().value({ offset: 0.45, value: 30 })

const t = Timeline({ duration: 2000 })

t.animate({ element: '#some_id', height: xyz.frames })
```

with `Keyframes` constructor.

For multiple endpoints, chain the `.value({})` calls.

```css
@keyframes xyz {
  0% {
    top: 0px;
  }
  25% {
    top: 0px;
  }
  50% {
    top: 100px;
  }
  75% {
    top: 100px;
  }
  100% {
    top: 0px;
  }
}
```

The above css snippet will be written as -

```js
import { Animate, Keyframes } from 'animated-timeline'

const xyz = new Keyframes()
  .value({ value: 0 })
  .value({ value: 100, offset: 0.25 })
  .value({ offset: 0.5, value: 100 })
  .value({
    offset: 0.75,
    value: 100,
  })
  .value({
    offset: 1,
    value: 100,
  })

function App() {
  return (
    <Animate
      {...timingProps}
      animationProps={{
        top: xyz.frames
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
