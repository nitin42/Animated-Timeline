// @flow

type value = number | string

type fromTo = {
  from: value,
  to: value
}

type values = Array<value>

// Serialize the values
// Used for transition from one state to another state
export const transition = ({
  from,
  to
}: {
  from: value,
  to: value
}): values => [from, to]

// Multiplies the original value
export const times = (val: value): string => `*=${val}`

// Start at a part. time after the previous animation
export const startAfter = (val: value): string => `+=${val}`

// Start at a part. time before the previous animation
export const startBefore = (val: value): string => `-=${val}`
