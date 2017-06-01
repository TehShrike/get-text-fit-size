const pxRegex = /\d+px/

const getPx = str => parseInt(pxRegex.exec(str)[0], 10)
const fontAtSize = (font, size) => font.replace(pxRegex, () => size + 'px')

module.exports = function getTextFitSize(containerElement, text) {
	const canvasContext = createCanvas()
	const containerComputedStyles = window.getComputedStyle(containerElement)
	const font = containerComputedStyles.getPropertyValue('font')
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
	const currentFontSize = getPx(initialFont)

	const getWidthAt = font => {
		context.font = font
		return context.measureText(text).width
	}

	const currentWidth = getWidthAt(initialFont)

	if (currentWidth < targetWidth && currentWidth > targetWidth - 0.5) {
		return currentFontSize
	}

	let size = getNewFontSizeUsingRatio(targetWidth, currentWidth, currentFontSize)

	const tooHigh = size => getWidthAt(fontAtSize(initialFont, size)) > targetWidth

	while (tooHigh(size)) {
		size = size - 0.2
	}

	return size
}

function getNewFontSizeUsingRatio(targetWidth, currentWidth, currentFontSize) {
	const ratio = targetWidth / currentWidth
	return currentFontSize * ratio
}
