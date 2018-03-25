## Curves

`Timeline` also lets you create custom easing curve instead of using the built-in ones. To create a custom curve, you will be importing `helpers` utility object from `animated-timeline`.

```js
import { helpers } from "animated-timeline";

const { createCurve } = helpers;

const controlPoints = [0.23, 0.45, -0.12, -0.95]; // c1, c2, c3, c4

const curveName = "CustomCurve";

createCurve(curveName, controlPoints);
```

This will register a custom easing curve on the main animation instance. Let's see how we can use your custom easing curve,

```js
import { Timeline } from "animated-timeline";

const timeline = new Timeline({
  direction: "reverse",
  duration: 2000,
  speed: 0.4,
  loop: 2,
  easing: "CustomCurve" // Pass the custom easing curve which we created above
});
```

To make things more easy and fun, get your control points from here - https://github.com/gre/bezier-easing
