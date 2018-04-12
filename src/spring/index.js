/**

TODO:

4. Refactor the listeners

5. Flow types

6. Make the implementation concrete

*/

import _R from 'rebound'
import invariant from 'invariant'

import { getAnimatables, getCSSValue, getAnimationType, getOriginalTargetValue } from '../core/engine'
import { noop } from '../utils/noop'

const rAF = window.requestAnimationFrame

const isColorProperty = property => property.includes('Color') || property.includes('color')

const isSkewOrRotate = property => property.includes('rotate') || property.includes('skew')

const shouldInvokeCallback = (callback, props) => {
	if (callback && typeof callback === 'function') callback(props)
	else if (callback && typeof callback !== 'function')
		console.error(`Expected callback to be a function but instead got a ${typeof callback}.`)
}

const validateValue = (property, value) => {
	// Color properties are validated and converted to RGB by `interpolateColor` option
	if (isColorProperty(property)) return value
	else if (isSkewOrRotate(property))
		// TODO: Add conversion for degrees to radians and vice-versa
		return String(value).concat('deg')
	else return String(value).concat('px')
}

const applyInitialProps = (el, { property, value, type }) => {
	const newValue = validateValue(property, value)

	if (type === 'transform') {
		el.style.transform = `${property}(${newValue})`
	} else if (type === 'css') {
		el.style[property] = newValue
	}
}

export function SpringSys(friction = 10, tension = 5) {
	invariant(
		typeof friction === 'number',
		`Expected 'friction' value to be a number but instead got a ${typeof friction}`
	)

	invariant(typeof tension === 'number', `Expected 'tension' value to be a number but instead got a ${typeof tension}`)

	// Main spring system instance
	const spring = new _R.SpringSystem().createSpring(friction, tension)

	const mapValues = _R.MathUtil.mapValueInRange

	const interpolateColor = _R.util.interpolateColor

	let id = null

	spring.animate = ({
		element = '',
		property,
		options = {
			mapValues: { from: [0, 1], to: [1, 1.5] },
			interpolateColor: { colors: ['#183a72', '#85c497'], range: [] },
		},
		interpolate = noop,
	}) => {
		invariant(
			!Array.isArray(element) || typeof element === 'string' || typeof element === 'object',
			'Can only pass a selector (id or class) or a reference to the element'
		)

		invariant(typeof property === 'string', `Expected property to be a string but instead got a ${typeof property}.`)

		invariant(
			typeof interpolate === 'function',
			`Expected onUpdate to be a function but instead got a ${typeof interpolate}.`
		)

		// Reference to the element which will be animated
		let el = null

		// Property type (css or transform)
		let type = null

		if (typeof element === 'object') {
			// must be a 'ref'
			el = element
		} else if (typeof element === 'string') {
			// id or classname
			el = document.querySelector(element)
		}

		if (getAnimationType(el, property) === 'transform') {
			type = 'transform'
		} else if (getAnimationType(el, property) === 'css') {
			type = 'css'
		}

		// Set the initial state of the animation property of the element we want to animate
		applyInitialProps(el, {
			property,
			value: isColorProperty(property) ? options.interpolateColor.colors[0] : options.mapValues.to[0],
			type,
		})

		spring.addListener({
			onSpringActivate: spr => shouldInvokeCallback(spring.onStart, spr),
			onSpringAtRest: spr => shouldInvokeCallback(spring.onRest, spr),
			onSpringUpdate: spr => {
				shouldInvokeCallback(spring.onUpdate, spr)

				let val = spr.getCurrentValue()

				if (!isColorProperty(property)) {
					const { from, to } = options.mapValues

					val = mapValues(val, from[0], from[1], to[0], to[1])
				} else if (isColorProperty(property)) {
					const { colors, range } = options.interpolateColor

					if (range && (Array.isArray(range) && range.length === 2)) {
						val = interpolateColor(val, colors[0], colors[1], range[0], range[1])
					} else {
						// Ignore the input range
						val = interpolateColor(val, colors[0], colors[1])
					}
				}

				if (isSkewOrRotate(property)) {
					val = String(val).concat('deg')
				} else if (property.includes('translate')) val = String(val).concat('px')

				id = rAF(() => {
					interpolate(
						// Pass the style object
						el.style,
						// Values should be unitless
						String(val).replace('deg', '') || String(val).replace('px', ''),
						// Options to map values from one range to another (for numbers and hex codes)
						{
							mapValues: _R.MathUtil.mapValueInRange,
							interpolateColor: _R.util.interpolateColor,
						}
					)

					if (type === 'transform') {
						if (!el.style['transform'].includes(property)) {
							el.style['transform'] = el.style['transform'].concat(`${property}(${val})`)
						} else {
							el.style['transform'] = `${property}(${val})`
						}
					} else if (type === 'css') {
						el.style[property] = `${val}`
					}
				})
			},
		})

		// Support chaining
		return spring
	}

	// Set a new value
	spring.setValue = spring.setEndValue

	// Set a new value and velocity
	spring.startWithVelocity = ({ value, velocity }) => {
		spring.setValue(value)
		spring.setVelocity(velocity)
	}

	// Start the motion with a value
	spring.startAt = val => spring.setValue(val)

	// Stop the motion
	spring.stop = () => spring.setCurrentValue(spring.getCurrentValue())

	// Reset the motion
	spring.reset = () => {
		spring.setCurrentValue(-1)
	}

	// Reverse the motion
	spring.reverse = () => {
		spring.setValue(-spring.getCurrentValue())
	}

	// Change the position of an element along with its motion
	spring.seek = val => {
		spring.setValue(val)
	}

	// Start the motion
	spring.start = () => {
		const value = spring.getEndValue() - spring.getCurrentValue()
		
		spring.setValue(value)
	}

	spring.infinite = (startValue, endValue, duration) => {
		let id = null

		spring.setValue(startValue)

		id = setTimeout(() => {
			spring.setValue(endValue)
		}, duration || 1200)

		return id
	}

	spring.oncancel = () => {
		let res = null

		function createPromise() {
			return window.Promise && new Promise(resolve => (res = resolve))
		}

		const promise = createPromise()

		spring.removeAllListeners()
		window.cancelAnimationFrame(id)

		res({ msg: 'Animation cancelled.' })

		return promise
	}

	return spring
}
