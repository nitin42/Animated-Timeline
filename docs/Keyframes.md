# Keyframes

Define keyframes for a property (css or transform) using the constructor function `Keyframes`. The object created by `Keyframes` has a property called `frames`.

## Example

```js
import { Animate, Keyframes } from 'animated-timeline'

const x = new Keyframes()
  .add({
    value: 10,
    duration: 1000
  })
  .add({
    value: 50,
    duration: 2000,
    offset: 0.8
  })
  .add({
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
const t = createTimeline({ duration: 2000 })

const xyz = new Keyframes().add({ offset: 0.45, value: 30 })

t.animate({ height: xyz.frames })
```

with `Keyframes` constructor.

For multiple endpoints, chain the `.add({})` calls.

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
  .add({ value: 0 })
  .add({ value: 100, offset: 0.25 })
  .add({ offset: 0.5, value: 100 })
  .add({
    offset: 0.75,
    value: 100,
  })
  .add({
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
const xyz = new Keyframes().add({ ...props })

console.log(xyz.frames)
```

## Examples

[Check out the examples for using `Keyframes`](../examples/Keyframes/index.js)

See next ▶️

[Component API](./Component.md)

[Timeline API](./Timeline.md)

[helpers API](./helpers.md)

[Spring API](./Spring.md)

[Animation properties](./properties.md)
