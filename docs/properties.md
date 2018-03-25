## Animatable properties

You will need to specify an element using a selector or reference to the element (refs) so that the element can be animated. You can use `class`, `ids` and `refs` in React.

**Usage with classname**

```js
// Element to be animated
<div className="sample" />;

// Specify the element and animation properties
Animated.value({
  // Element with class 'sample'
  elements: ".sample",
  translateX: 400,
  rotate: {
    value: 360,
    direction: "alternate"
  }
});
```

**Usage with id**

```js
// Element to be animated
<div id="sample" />;

// Specify the element and animation properties
Animated.value({
  // Element with class 'sample'
  elements: "#sample",
  translateX: 400,
  rotate: {
    value: 360,
    direction: "alternate"
  }
});
```

**Usage with refs**

```js
// Element to be animated
<div ref={sample => (this.sample = sample)} />;

Animated.value({
  elements: this.sample,
  translateX: 400,
  rotate: {
    value: 360,
    direction: "alternate"
  }
});
```

**Array of elements**

You can also pass an array of elements to the property `elements` to animate a group of elements with similar properties like -

```js
Animated.value({
  // Element with class 'sample'
  elements: [this.sample, '.one', '#two', .three],
  translateX: 400,
  rotate: {
    value: 360,
    direction: 'alternate'
  }
})
```
