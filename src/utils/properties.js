// @flow

type value = number | string

type fromTo = {
  from: value,
  to: value
}

// Serialize the values for animation engine

// Start an animation from a certain end
export const start = ({ from, to }: { from: value, to: value}) => [from, to]

// Multiple the original value
export const times = (val: value): string => `*=${val}`

// Start at a part. time after the previous animation
export const startAfter = (val: value): string => `+=${val}`

// Start at a part. time before the previous animation
export const startBefore = (val: value): string => `-=${val}`
