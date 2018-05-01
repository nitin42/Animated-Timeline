# helpers

A special object that contains various utilities for -

* performing `from` - `to` based animations

* performing timing based animations

* creating custom easing curves

* reading the animation info.

## `from` - `to` based animations

To perform `from` - `to` based animation i.e transitioning from one state to another, use the method `transition`.

```js
import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  duration: 2000,
  iterations: 2
})

t.animate({
  translateX: helpers.transition({
    from: 20, // 20px
    to: 50 // 50px
  }),
  scale: helpers.transition({
    from: 2,
    to: 1
  })
}).start()
```

## Timing based animations

When performing timing based animations, data binding won't work. You'll have to use `el` property for specifying the element using `refs` or selectors (id or class name)

* **`startAfter`**

Use this method to start an animation at a specified time after the previous animation ends.

```js
import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  duration: 2000,
  iterations: 2
})

t.sequence([
  t.animate({
    el: '#custom-element-id',
    scale: 2
  }),

  t.animate({
    el: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.startAfter(2000) // Start the animation at 2 seconds after the previous animation ends.
  })
]).start()
```

* **`startBefore`**

Use this method to start an animation at a specified time before the previous animation ends

```js
import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  duration: 2000,
  iterations: 2
})

t.sequence([
  t.animate({
    el: '#custom-element-id',
    scale: 2
  }),

  t.animate({
    el: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.startBefore(2000) // Start the animation at 2 seconds before the previous animation ends.
  })
]).start()
```

* **`times`**

Use this method to start animation at times after the previous animation ends

```js
import { createTimeline, helpers } from 'animated-timeline'

const t = createTimeline({
  duration: 2000,
  iterations: 2
})

t.sequence([
  t.animate({
    el: '#custom-element-id',
    scale: 2
  }),

  t.animate({
    el: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.times(2)
  })
]).start()
```

## Creating custom easing curves

Create a custom easing curve with **4** control points.

```js
import { createTimeline, helpers } from 'animated-timeline'

// Registers the curve name `SampleCurve`
const myCustomCurve = helpers.createEasingCurve('SampleCurve', [
  0.21,
  0.34,
  0.45,
  -0.98
])

const t = createTimeline({
  duration: 2000,
  iterations: 2,
  easing: myCustomCurve
})

t.animate({
  scale: 2
}).start()
```

## Reading information

**Get the available easing curve names**

```js
helpers.getAvailableEasings()
```

Returns an array of available easing curve names

**Get the available transform properties**

```js
helpers.getAvailableTransforms()
```

Returns an array of available transform properties.

## API

### `helpers.transition`

A function that accepts an object with two properties, `from` and `to`.

```js
helpers.transition({ from: 1, to: 2})
```

### `helpers.startAfter`

A function that accepts a timeout value.

```js
helpers.startAfter(2000)
```

### `helpers.startBefore`

A function that accepts a timeout value.

```js
helpers.startBefore(2000)
```

### `helpers.times`

A function that accepts a unit value.

```js
helpers.times(3)
```

### `helpers.createEasingCurve`

A function that accepts two arguments, a curve name and an array of four control points and returns the curve.

```js
helpers.createEasingCurve('my_custom_curve', [1, 2, 3, 4])
```

See next ▶️

[Component API](./Component.md)

[Timeline API](./Timeline.md)

[Keyframes API](./Keyframes.md)

[Spring API](./Spring.md)

[Animation properties](./properties.md)
