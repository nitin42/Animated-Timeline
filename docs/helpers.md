# helpers

A special object that contains various utilities for -

* performing `from` - `to` based animations

* performing timing based animations

* creating custom easing curves

* reading the animation info.

## `from` - `to` based animations

To perform `from` - `to` based animation i.e transitioning from one state to another, use the method `transition`.

```js
import { Timeline, helpers } from 'animated-timeline'

const timeline = Timeline({
  duration: 2000,
  iterations: 2
})

timeline.animate({
  element: '#my-custom-id',
  translateX: helpers.transition({
    from: 20, // 20px
    to: 50 // 50px
  }),
  scale: helpers.transition({
    from: 2,
    to: 1
  })
})
```

## Timing based animations

* **`startAfter`**

Use this method to start an animation at a specified time after the previous animation ends.

```js
import { Timeline, helpers } from 'animated-timeline'

const timeline = Timeline({
  duration: 2000,
  iterations: 2
})

timeline.sequence([
  timeline.animate({
    element: '#custom-element-id',
    scale: 2
  }),

  timeline.animate({
    element: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.startAfter(2000) // Start the animation after 2 seconds the.
  })
])
```

* **`startBefore`**

Use this method to start an animation at a specified time before the previous animation ends

```js
import { Timeline, helpers } from 'animated-timeline'

const timeline = Timeline({
  duration: 2000,
  iterations: 2
})

timeline.sequence([
  timeline.animate({
    element: '#custom-element-id',
    scale: 2
  }),

  timeline.animate({
    element: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.startBefore(2000) // Start the animation at 2 seconds before the previous animation ends.
  })
])
```

* **`times`**

Use this method to start animation at times after the previous animation ends

```js
import { Timeline, helpers } from 'animated-timeline'

const timeline = Timeline({
  duration: 2000,
  iterations: 2
})

timeline.sequence([
  timeline.animate({
    element: '#custom-element-id',
    scale: 2
  }),

  timeline.animate({
    element: '#my-custom-id',
    translateX: '30px',
    scale: 2,
    offset: helpers.times(2)
  })
])
```

## Creating custom easing curves

Create a custom easing curve with **4** control points.

```js
import { Timeline, helpers } from 'animated-timeline'

// Registers the curve name `SampleCurve`
const myCustomCurve = helpers.createEasingCurve('SampleCurve', [
  0.21,
  0.34,
  0.45,
  -0.98
])

const timeline = Timeline({
  duration: 2000,
  iterations: 2,
  easing: myCustomCurve
})

timeline.animate({
  element: '#custom-element-id',
  scale: 2
})
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
