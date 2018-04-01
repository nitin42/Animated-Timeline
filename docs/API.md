# API Reference

API reference for `animated-timeline`

### `Timeline`

Returns a new timeline instance which is used to animate the elements. It accepts an object of timeline properties.

```js
const Animated = Timeline({
  delay: 2000,
  duration: 4000,
  direction: 'alternate',
  easing: 'easeInSine'
})
```

**Timeline properties** -

Below are the timeline properties which you can pass to `Timeline` function.

* `delay` (ms)

* `duration` (ms)

* `direction` [`normal`, `reverse` and `alternate`]

* `speed`

* `iterations`

* `easing` - Eg - `easing: 'easeInSine'. `Available `easing` curves are

```js
"linear"

"easeInQuad"
"easeInCubic"
"easeInQuart"
"easeInQuint"
"easeInSine"
"easeInExpo"
"easeInCirc"
"easeInBack"
"easeInElastic"

"easeOutQuad"
"easeOutCubic"
"easeOutQuart"
"easeOutQuint"
"easeOutSine"
"easeOutExpo"
"easeOutCirc"
"easeOutBack"
"easeOutElastic"

"easeInOutQuad"
"easeInOutCubic"
"easeInOutQuart"
"easeInOutQuint"
"easeInOutSine"
"easeInOutExpo"
"easeInOutCirc"
"easeInOutBack"
"easeInOutElastic"
```

* `elasticity` (`Number`)

* `offset` (`Number`)

* `autoplay` (`Boolean`) - Default is `true`.

### `Animated`

`Animated` object accepts animation properties for an element you wish to animate.

```js
const Animated = Timeline({
  ...props
})

Animated.value({
  elements: '.xyz',
  rotate: {
    value: 180,
    duration: 2000
  },
  scale: 2
})
```

You can pass an object of animation properties using the method `.value()`.

`.value()` can further be chained to perform sequence based animations or timing based animations.

**Using .value() for sequence based animations**

```js
Animated.value({
  elements: '.one',
  ...props
}).value({
  elements: '.two',
  ...props
})
```

**Using .value() for timing based animations**

To perform timing based animations, you will need to pass an offset value for an element

```js
Animated.value({
  elements: '.one',
  ...props
}).value({
  elements: '.two',
  // Start at 2000 after the previous animation ends
  offset: helpers.startAfter(2000)
}).value({
  elements: '.three',
  // Start at 2000 before the previous animation ends
  offset: helpers.startBefore(1200)
})
```

[Learn more about the methods `startBefore` and `startAfter`]()

**Animation properties** -

* `elements` - Specify an element or an array of elements you wish to animate through selectors or refs (React)

```js
Animated.value({
  elements: [this.one, '.two', '#three']
})

// Assuming these are the elements we want to animate
render() {
  return (
    <div>
      <div id="three" />
      <div ref={(one) => this.one = one} />
      <div className="two" />
    </div>
  )
}
```

* `css` properties - CSS properties you wish to animate like `opacity`, `fontSize`, `backgroundColor` etc. [See this list of available CSS animatable properties.](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties)

```js
Animated.value({
  elements: this.one, // Refs
  backgroundColor: helpers.transition({
    from: '#4286f4',
    to: '#398964'
  })
})
```

[Learn more about the helper method transition]()

* `transforms` - The transform CSS property lets you rotate, scale, skew, or translate a given element.

```js
Animated.value({
  elements: this.one, // Refs
  translateX: helpers.transition({
    from: 200,
    to: 1000
  }),
  rotate: {
    value: 180,
    duration: 3000,
    easing: 'easeInOutSine',
    elasticity: 500
  },
  scale: helpers.transition({
    from: 1,
    to: 4
  })
})
```

Below is the list of available `transform` properties.

```js
'translateX'
'translateY'
'translateZ'
'rotate'
'rotateX'
'rotateY'
'rotateZ'
'scale'
'scaleX'
'scaleY'
'scaleZ'
'skewX'
'skewY'
'perspective'
```

[Learn more about the transform CSS property here](https://developer.mozilla.org/en-US/docs/Web/CSS/transform).

* `object` - You can also pass an object value for an animation property. Example -

```js
Animated.value({
  elements: '#one',
  rotation: {
    value: 360, // '360deg',
    duration: 4000, // rotation duration
    easing: 'easeInSineOut',
    elasticity: 800,
    delay: 500
  }
})
```

* `offset` - Use this property when you want to start an animation at a specific time with respect to the previous animation. To add an offset value, use the helper methods -
  * [`startAfter(time)`]() - to start an animation at a specified time after the previous animation ends

  ```js
  // Starts the animation at 1200ms after the previous animation ends
  offset: startAfter(1200)
  ```

  * [`startBefore(time)`]() - to start an animation at a specified time before the previous animation ends

  ```js
  // Starts the animation at 1200ms before the previous animation ends.
  offset: startBefore(1200)
  ```

  * [`times(n)`]() - to start animation at times after the previous animation ends

  ```js
  offset: times(4)
  ```
