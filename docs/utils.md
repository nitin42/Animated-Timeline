## Animation utilities

`Timeline` exposes a `helpers` utility object which provides the following different utilities -

* `start({ from: value, to: value })` - This method is used to perform `from-to` based animations i.e transition from one value to another

Example -

```js
Animated.value({
  backgroundColor: start({
    from: "#42f4a7",
    to: "#415cf4"
  })
});
```

If you want to use **color names** instead of hex codes, then you can use the package [`colornames`](https://github.com/timoxley/colornames).

* `startAfter(time)` - This method is used to start the animation at a specified time in seconds after the previous animation ends.

Example -

```js
Animated.value({
  elements: ".xyz",
  rotate: {
    value: 360
  }
}).value({
  elements: ".abc",
  translateX: start({ from: 200, to: 1000 }),
  offset: startAfter(1200) // Start 1.2s after the previous animation ends
});
```

* `startBefore(time)` - This method is used to start the animation at a specified time in seconds before the previous animation ends.

Example -

```js
Animated.value({
  elements: ".xyz",
  rotate: {
    value: 360
  }
}).value({
  elements: ".abc",
  translateX: start({ from: 200, to: 1000 }),
  offset: startBefore(1200) // Start 1.2s before the previous animation ends
});
```

* `random(a, b)` - Returns a random number between `a` and `b`

* `getEasings()` - Returns the available easing curve names on the **current** animation instance

* `createCurve(curveName, controlPoints)` - Takes a curve name and array of four control points, and creates a new easing curve.

* `times(number)` - Starts the animation at a specified (number) `times` the previous animation's duration.

Example -

```js
Animated.value({
  elements: ".xyz",
  rotate: {
    value: 360
  }
}).value({
  elements: ".abc",
  translateX: start({ from: 200, to: 1000 }),
  offset: times(2) // Start at 2 times the previous animation
});
```
