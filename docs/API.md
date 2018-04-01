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
// Default
"linear"

// easeIn
"easeInQuad"
"easeInCubic"
"easeInQuart"
"easeInQuint"
"easeInSine"
"easeInExpo"
"easeInCirc"
"easeInBack"
"easeInElastic"

// easeOut
"easeOutQuad"
"easeOutCubic"
"easeOutQuart"
"easeOutQuint"
"easeOutSine"
"easeOutExpo"
"easeOutCirc"
"easeOutBack"
"easeOutElastic"

// easeInOut
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

Available `transform` properties -

```js
// translate
translateX
translateY
translateZ

// rotate
rotate
rotateX
rotateY
rotateZ

// scale
scale
scaleX
scaleY
scaleZ

// skew
skewX
skewY

// perspective
perspective
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

### Keyframes

To define keyframes for an animation property, use the class `Keyframes`.

```js
const x = new Keyframes()
  .value({
    value: 200,
    duration: 4000,
    delay: 1000,
    elasticity: 200,
  })
  .value({
    value: 0,
    offset: 0.4,
    duration: 6000,
  })
```

This returns an array of frames. The property `frames` is accessible on the instance, in our example `x`. Use the returned array of frames to define the tween value for an animation property,

```js
Animated.value({
  elements: '#one',
  translateX: x.frames // array of frames
})
```

[See this example for more details on defining the keyframes.](../examples/Keyframes.js)

### Animate

`Animate` is the React component which is basically, a wrapper around `Animated.value()`. This, however, has some limitations like

* You cannot use the control methods [`.reset()`](), [`.reverse()`]() [`.restart()`]() directly. To use them, you will be relying on the lifecycle methods

* Promise based APIs are not available

* Unavailability of the methods for getting information out of a running animation.

But you can still use all the [helper methods]() and [Keyframes]().

These limitations are due to the design decisions. If your use case involves just animating the elements, then you can simply use this component.

```js
class App extends React.Component {
  render() {
    return (
      <Animate timingProps={{ duration: 2000 }} animationProps={{ scale: 2}}>
        <h1>React</h1>
      </Animate>
    )
  }
}
```

**Note** - We are not using the property `elements` here anymore to specify the elements we want to animate because the component `Animate` internally resolves all the children for us.

#### Props

* **`timingProps`**

Accepts an object of properties for timing model.

```js
timingProps={{
  delay: 2000,
  duration: 4000,
  direction: 'alternate',
  easing: 'easeInSine'
}}
```

* **`animationProps`**

Accepts an object of properties for animation model

```js
animationProps={{
  rotate: {
    value: 180,
    duration: 2000
  },
  scale: 2
}}
```

* **`autoplay`**

A `boolean` value which indicates whether to autoplay the animation or not.

* **`shouldStart`**

A `boolean` value which indicates whether to start the animation or not. Use this when you want to animate based on the state updates.

* **`shouldStop`**

A `boolean` value which indicates whether to stop the animation or not.

[See this detailed example](../examples/AdvanceComponent.js)
