import { bezier } from './bezier'
import { is } from './utils'

const names = [
  'Quad',
  'Cubic',
  'Quart',
  'Quint',
  'Sine',
  'Expo',
  'Circ',
  'Back',
  'Elastic',
]

const elastic = (t, p) => {
  return t === 0 || t === 1
    ? t
    : -Math.pow(2, 10 * (t - 1)) *
        Math.sin(
          (t - 1 - p / (Math.PI * 2.0) * Math.asin(1)) * (Math.PI * 2) / p
        )
}

const equations = {
  In: [
    [0.55, 0.085, 0.68, 0.53] /* InQuad */,
    [0.55, 0.055, 0.675, 0.19] /* InCubic */,
    [0.895, 0.03, 0.685, 0.22] /* InQuart */,
    [0.755, 0.05, 0.855, 0.06] /* InQuint */,
    [0.47, 0.0, 0.745, 0.715] /* InSine */,
    [0.95, 0.05, 0.795, 0.035] /* InExpo */,
    [0.6, 0.04, 0.98, 0.335] /* InCirc */,
    [0.6, -0.28, 0.735, 0.045] /* InBack */,
    elastic /* InElastic */,
  ],
  Out: [
    [0.25, 0.46, 0.45, 0.94] /* OutQuad */,
    [0.215, 0.61, 0.355, 1.0] /* OutCubic */,
    [0.165, 0.84, 0.44, 1.0] /* OutQuart */,
    [0.23, 1.0, 0.32, 1.0] /* OutQuint */,
    [0.39, 0.575, 0.565, 1.0] /* OutSine */,
    [0.19, 1.0, 0.22, 1.0] /* OutExpo */,
    [0.075, 0.82, 0.165, 1.0] /* OutCirc */,
    [0.175, 0.885, 0.32, 1.275] /* OutBack */,
    (t, f) => 1 - elastic(1 - t, f) /* OutElastic */,
  ],
  InOut: [
    [0.455, 0.03, 0.515, 0.955] /* InOutQuad */,
    [0.645, 0.045, 0.355, 1.0] /* InOutCubic */,
    [0.77, 0.0, 0.175, 1.0] /* InOutQuart */,
    [0.86, 0.0, 0.07, 1.0] /* InOutQuint */,
    [0.445, 0.05, 0.55, 0.95] /* InOutSine */,
    [1.0, 0.0, 0.0, 1.0] /* InOutExpo */,
    [0.785, 0.135, 0.15, 0.86] /* InOutCirc */,
    [0.68, -0.55, 0.265, 1.55] /* InOutBack */,
    (t, f) =>
      t < 0.5
        ? elastic(t * 2, f) / 2
        : 1 - elastic(t * -2 + 2, f) / 2 /* InOutElastic */,
  ],
}

const createEasingsInst = () => {
  let functions = {
    linear: bezier(0.25, 0.25, 0.75, 0.75),
  }

  for (let type in equations) {
    equations[type].forEach((f, i) => {
      functions['ease' + type + names[i]] = is.fnc(f)
        ? f
        : bezier.apply(this, f)
    })
  }

  return functions
}

const easings = createEasingsInst()

export {
  easings
}