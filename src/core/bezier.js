// @flow

type aA1 = number

type aA2 = number

type aT = number

type aX = number

type aA = number

type aB = number

type mX1 = number

type mX2 = number

type mY1 = number

type mY2 = number

const A = (aA1: aA1, aA2: aA2): number => {
  return 1.0 - 3.0 * aA2 + 3.0 * aA1
}

const B = (aA1: aA1, aA2: aA2): number => {
  return 3.0 * aA2 - 6.0 * aA1
}
const C = (aA1: aA1): number => {
  return 3.0 * aA1
}

const calcBezier = (aT: aT, aA1: aA1, aA2: aA2): number => {
  return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT
}

const getSlope = (aT: aT, aA1: aA1, aA2: aA2): number => {
  return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1)
}

const createBezierInst = () => {
  const kSplineTableSize = 11
  const kSampleStepSize = 1.0 / (kSplineTableSize - 1.0)

  const binarySubdivide = (
    aX: aX,
    aA: aA,
    aB: aB,
    mX1: mX1,
    mX2: mX2
  ): number => {
    let currentX,
      currentT,
      i = 0
    do {
      currentT = aA + (aB - aA) / 2.0
      currentX = calcBezier(currentT, mX1, mX2) - aX
      if (currentX > 0.0) {
        aB = currentT
      } else {
        aA = currentT
      }
    } while (Math.abs(currentX) > 0.0000001 && ++i < 10)
    return currentT
  }

  const newtonRaphsonIterate = (
    aX: aX,
    aGuessT: number,
    mX1: mX1,
    mX2: mX2
  ): number => {
    for (let i = 0; i < 4; ++i) {
      const currentSlope = getSlope(aGuessT, mX1, mX2)
      if (currentSlope === 0.0) return aGuessT
      const currentX = calcBezier(aGuessT, mX1, mX2) - aX
      aGuessT -= currentX / currentSlope
    }
    return aGuessT
  }

  const bezier = (mX1: mX1, mY1: mY1, mX2: mX2, mY2: mY2): Function | void => {
    if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) return
    let sampleValues = new Float32Array(kSplineTableSize)

    if (mX1 !== mY1 || mX2 !== mY2) {
      for (let i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2)
      }
    }

    const getTForX = aX => {
      let intervalStart = 0.0
      let currentSample = 1
      const lastSample = kSplineTableSize - 1

      for (
        ;
        currentSample !== lastSample && sampleValues[currentSample] <= aX;
        ++currentSample
      ) {
        intervalStart += kSampleStepSize
      }

      --currentSample

      const dist =
        (aX - sampleValues[currentSample]) /
        (sampleValues[currentSample + 1] - sampleValues[currentSample])
      const guessForT = intervalStart + dist * kSampleStepSize
      const initialSlope = getSlope(guessForT, mX1, mX2)

      if (initialSlope >= 0.001) {
        return newtonRaphsonIterate(aX, guessForT, mX1, mX2)
      } else if (initialSlope === 0.0) {
        return guessForT
      } else {
        return binarySubdivide(
          aX,
          intervalStart,
          intervalStart + kSampleStepSize,
          mX1,
          mX2
        )
      }
    }

    return (x: number): number => {
      if (mX1 === mY1 && mX2 === mY2) return x
      if (x === 0) return 0
      if (x === 1) return 1
      return calcBezier(getTForX(x), mY1, mY2)
    }
  }

  return bezier
}

const bezier = createBezierInst()

export { bezier }
