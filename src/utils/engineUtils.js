import tags from 'html-tags'
import svgTags from 'svg-tag-names'

export const DOMELEMENTS = [...tags, ...svgTags]

export const stringContains = (str, text) => {
  return str.indexOf(text) > -1
}

export const isArray = obj => Array.isArray(obj)

export const minMaxValue = (val, min, max) => Math.min(Math.max(val, min), max)

export const isObject = object =>
  stringContains(Object.prototype.toString.call(object), 'Object')

export const isSVG = el => el instanceof SVGElement

export const isDOM = el => el.nodeType || isSVG(el)

export const isString = val => typeof val === 'string'

export const isFunc = val => typeof val === 'function'

export const isUnd = val => typeof val === 'undefined'

export const isHex = val => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(val)

export const isRgb = val => /^rgb/.test(val)

export const isHsl = val => /^hsl/.test(val)

export const isCol = val => isHex(val) || isRgb(val) || isHsl(val)

export const isPath = val => isObject(val) && val.hasOwnProperty('totalLength')

export const stringToHyphens = str => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

export const selectString = str => {
  if (isCol(str)) return
  try {
    let elements = document.querySelectorAll(str)
    return elements
  } catch (e) {
    return
  }
}

export const filterArray = (arr, callback) => {
  const len = arr.length
  const thisArg = arguments.length >= 2 ? arguments[1] : void 0
  let result = []
  for (let i = 0; i < len; i++) {
    if (i in arr) {
      const val = arr[i]
      if (callback.call(thisArg, val, i, arr)) {
        result.push(val)
      }
    }
  }
  return result
}

export const flattenArray = arr => {
  return arr.reduce((a, b) => a.concat(isArray(b) ? flattenArray(b) : b), [])
}

export const toArray = o => {
  if (isArray(o)) return o
  if (isString(o)) o = selectString(o) || o
  if (o instanceof NodeList || o instanceof HTMLCollection)
    return [].slice.call(o)
  return [o]
}

export const arrayContains = (arr, val) => {
  return arr.some(a => a === val)
}

export const clone = o => {
  let clone = {}
  for (let p in o) clone[p] = o[p]
  return clone
}

export const replaceObjectProps = (o1, o2) => {
  let o = clone(o1)
  for (let p in o1) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p]
  return o
}

export const mergeObjects = (o1, o2) => {
  let o = clone(o1)
  for (let p in o2) o[p] = isUnd(o1[p]) ? o2[p] : o1[p]
  return o
}

export const rgbToRgba = rgbValue => {
  const rgb = /rgb\((\d+,\s*[\d]+,\s*[\d]+)\)/g.exec(rgbValue)
  return rgb ? `rgba(${rgb[1]},1)` : rgbValue
}

export const hexToRgba = hexValue => {
  const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const hex = hexValue.replace(rgx, (m, r, g, b) => r + r + g + g + b + b)
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = parseInt(rgb[1], 16)
  const g = parseInt(rgb[2], 16)
  const b = parseInt(rgb[3], 16)
  return `rgba(${r},${g},${b},1)`
}

export const hslToRgba = hslValue => {
  const hsl =
    /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(hslValue) ||
    /hsla\((\d+),\s*([\d.]+)%,\s*([\d.]+)%,\s*([\d.]+)\)/g.exec(hslValue)
  const h = parseInt(hsl[1]) / 360
  const s = parseInt(hsl[2]) / 100
  const l = parseInt(hsl[3]) / 100
  const a = hsl[4] || 1

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }
  let r, g, b
  if (s == 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }
  return `rgba(${r * 255},${g * 255},${b * 255},${a})`
}

export const colorToRgb = val => {
  if (isRgb(val)) return rgbToRgba(val)
  if (isHex(val)) return hexToRgba(val)
  if (isHsl(val)) return hslToRgba(val)
}

// Get the unit from value
export const getUnit = val => {
  val = String(val)
  const split = /([\+\-]?[0-9#\.]+)(%|px|em|rem|in|cm|mm|vw|vh|vmin|vmax|deg|rad|turn)?$/.exec(
    val.replace(/\s/g, '')
  )
  if (split) return split[2]
}

// From > to based animations, time based animations
export const getRelativeValue = (to, from) => {
  // Partition the `to` value (+=200) => ['+=', '+=', index:0, input: '+=200']
  const operator = /^(\*=|\+=|-=)/.exec(to)
  if (!operator) return to
  // Get the unit if there is any
  const u = getUnit(to) || 0
  const x = parseFloat(from)
  const y = parseFloat(to.replace(operator[0], ''))
  switch (operator[0][0]) {
    case '+':
      return x + y + u
    case '-':
      return x - y + u
    case '*':
      return x * y + u
  }
}
