// @flow

type value = string | number

const withUnit = (value: value, unit: string): string => {
  value = String(value)
  if (value.includes(unit)) return value
  return value.concat(unit)
}

// Helpers for assigning units
export const deg = (value: value): string => withUnit(value, 'deg')
export const px = (value: value): string => withUnit(value, 'px')
export const em = (value: value): string => withUnit(value, 'em')
export const rem = (value: value): string => withUnit(value, 'rem')
export const rad = (value: value): string => withUnit(value, 'rad')
export const grad = (value: value): string => withUnit(value, 'grad')
export const turn = (value: value): string => withUnit(value, 'turn')

const UNITS = /([\+\-]?[0-9#\.]+)(%|px|em|rem|in|cm|mm|vw|vh|vmin|vmax|deg|rad|turn)?$/

// Get the unit from value
export const parseValue = (value: value): string | Array<string> => {
  value = String(value)
  const split = UNITS.exec(value.replace(/\s/g, ''))
  if (split) return split

  return ''
}
