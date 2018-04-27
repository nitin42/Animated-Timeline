# Properties

### Timing properties

* `duration` - animation duration. 

```js
Timeline({ duration: 2000 })
```

* `delay` - animation delay

```js
Timeline({ delay: 200 })
```

* `iterations` - A number value or `Infinity` for defining iterations of an animation.

```js
Timeline({ iterations: 2}) // or Timeline({ iterations: Infinity })
```

* `speed` - animation speed

```js
Timeline({ speed: 0.8 })
```

Change the speed in-between the running animations using `setSpeed`.

```js
const t = Timeline({
  duration: 2000
})

t.animate({
  element: '#one',
  scale: 2
})

// Change the speed after 3s
setTimeout(() => {
  t.getAnimations().forEach((animation) => {
    animation.setSpeed(0.2)
  })
}, 3000)
```

* `direction` - animation direction. It can be `reversed`, `alternate` or `normal` which is default.

```js
Timeline({ direction: 'alternate' })
```

* `autoplay` - autoplay the animation

```js
Timeline({ autoplay: true })
```

* `easing` - Easing curve name

```js
Timeline({ easing: 'easeInQuad' })
```

or use a custom easing curve

```js
import { Timeline, createEasingCurve } from 'animated-timeline'

const custom_curve = createEasingCurve('custom_curve', [1, 2, 3, 4])

Timeline({ easing: custom_curve })
```

Use [`helpers.getAvailableEasings()`](./helpers#reading-information) to see the available easing curve names you can use.

* `elasticity` - A number value for defining elasticity

```js
Timeline({ elasticity: 500 })
```

## Animation Properties

**Transforms**

Use [`helpers.getAvailableTransforms()`](./helpers.md#reading-information) to see the available transform properties you can use


**CSS properties**

Checkout [this](https://docs.google.com/spreadsheets/d/1Hvi0nu2wG3oQ51XRHtMv-A_ZlidnwUYwgQsPQUg1R2s/pub?single=true&gid=0&output=html) list of CSS properties by style operation (layout, paint, composite).