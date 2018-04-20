const withUnit = (value, unit) => {
  value = String(value)
  if (value.includes(unit)) return value
  return value.concat(unit)
}

// Helpers for assigning units
export const deg = value => withUnit(value, 'deg')
export const px = value => withUnit(value, 'px')
export const em = value => withUnit(value, 'em')
export const rem = value => withUnit(value, 'rem')
export const rad = value => withUnit(value, 'rad')
export const grad = value => withUnit(value, 'grad')
export const turn = value => withUnit(value, 'turn')

const UNITS = /([\+\-]?[0-9#\.]+)(%|px|em|rem|in|cm|mm|vw|vh|vmin|vmax|deg|rad|turn)?$/

// Get the unit from value
export const parseValue = value => {
  value = String(value)
  const split = UNITS.exec(value.replace(/\s/g, ''))
  if (split) return split
}
