# Timeline API

Using the `Timeline` API, you can create interactive animations using loops, callbacks, promises, variables, timer APIs and lifecycle hooks.

To animate an element using the `Timeline` API, you will need to specify properties for **timing model** like `duration`, `delay`, `iterations` and **animation model** like `elements` for animating an element or an array of elements, `transform`, `color`, `opacity` etc.

**Timing model**

The timing model describes the animation time and an animation's progress.

**Animation model**

The animation model, on the other hand, describes how an animation could look like at any give time or it can be thought of as state of an animation at a particular point of time.

## Examples

* [Basic](../examples/Timeline/basic.js)

* [Sequencing](../examples/Timeline/sequence.js)

* [Offset based animations](../examples/Timeline/timing.js)

* [Seeking the animation](../examples/Seeking/basic.js)

* [Promise based API](../examples/Promise/index.js)

* [Using lifecycle hooks](../examples/Lifecycle/index.js)

* [Keyframes](../examples/Keyframes/index.js)

* [Finish the animation immediately](../examples/Extra/Finish.js)

* [Changing speed](../examples/Extra/speed.js)

## Timeline

`Timeline` function returns a timeline instance which is use to animate the element.

**Specifying timing model properties**

```js
import { Timeline } from 'animated-timeline'

const timeline = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})
```

**Specifying animation model properties**

Use the `timeline` instance to animate the element.

```js
import { Timeline, helpers } from 'animated-timeline'

const timeline = Timeline({
  delay: 2000,
  duration: 4000,
  speed: 0.8,
  direction: 'alternate'
})

class App extends React.Component {
  componentDidMount() {
    timeline
      .animate({
        element: this.one,
        scale: helpers.transition({
          from: 2,
          to: 1
        })
      })
      .start()
  }

  render() {
    return <div ref={(node) => (this.node = node)} />
  }
}
```
