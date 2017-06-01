const pxRegex = () => /\d+px/

const getPx = str => parseInt(pxRegex().exec(str)[0], 10)
const fontAtSize = (font, size) => font.replace(pxRegex(), () => size + 'px')
const join = (...args) => args.join(' ')

module.exports = function getTextFitSize(containerElement, text) {
	const canvasContext = createCanvas()
	const containerComputedStyles = window.getComputedStyle(containerElement)
	const font = getFontString(containerComputedStyles)
	const targetWidth = getPx(containerComputedStyles.getPropertyValue('width'))

	return calculateFitSize(canvasContext, font, text, targetWidth)
}

function createCanvas() {
	const canvas = document.createElement('canvas')
	canvas.setAttribute('width', '1px')
	canvas.setAttribute('height', '1px')

	return canvas.getContext('2d')
}

function calculateFitSize(context, initialFont, text, targetWidth) {
	const conservativeTarget = targetWidth - 0.3
	const currentFontSize = getPx(initialFont)

	const getWidthAt = font => {
		context.font = font
		return context.measureText(text).width
	}

	const currentWidth = getWidthAt(initialFont)

	if (currentWidth < conservativeTarget && currentWidth > conservativeTarget - 0.5) {
		return currentFontSize
	}

	let size = getNewFontSizeUsingRatio(conservativeTarget, currentWidth, currentFontSize)

	const tooHigh = size => getWidthAt(fontAtSize(initialFont, size)) >= conservativeTarget

	while (tooHigh(size)) {
		size = size - 0.1
	}

	return size
}

function getNewFontSizeUsingRatio(targetWidth, currentWidth, currentFontSize) {
	const ratio = targetWidth / currentWidth
	return currentFontSize * ratio
}

function getFontString(computedStyles) {
	const v = p => computedStyles.getPropertyValue(p)

	return v('font')
		|| join(v('font-style'),
			v('font-variant'),
			v('font-weight'),
			v('font-stretch'),
			v('font-size'),
			// v('line-height'), line heights confuse Firefox I guess?
			v('font-family'))
}

