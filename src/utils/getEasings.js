import engine from 'engine-fork'

export const getEasings = () => {
  const easings = []

  Object.keys(engine.easings).forEach(easing => easings.push(easing))

  return easings
}
