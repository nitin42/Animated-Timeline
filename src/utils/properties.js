// Start an animation from a certain end
export const start = ({ from, to }) => [from, to]

// Multiple the original value
export const times = (val) => `*=${val}`

// Start at a part. time after the previous animation
export const startAfter = (val) => `+=${val}`

// Start at a part. time before the previous animation
export const startBefore = (val) => `-=${val}`
