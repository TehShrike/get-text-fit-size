const tape = require('tape-catch')
const getTextFitSize = require('./')

const clearBrowser = style => {
	document.write(`
	<html>
		<head>
			<title>Testing yo</title>
		</head>
		<body>
			<div id="container">
			</div>
			<style>
				#container {
					${style}
					margin-left: auto;
					margin-right: auto;
					width: 500px;
					padding: 15px;
				}
			</style>
		</body>
	</html>
	`)
	document.close()
}

const test = (description, fn, style) => {
	tape(description, t => {
		clearBrowser(style)
		const harness = {
			fitsUnder(actual, target) {
				t.ok(actual < target && actual > target - 0.5, `${actual} less than ${target} and greater than ${target - 0.5}`)
			}
		}
		fn(harness)
		t.end()
	})
}

test(`Basic test`, t => {
	const output = getTextFitSize(document.getElementById('container'), 'This is some text yo')
	t.fitsUnder(output, 62.08)
}, 'font: normal normal normal normal 16px / normal Times;')

test(`Not many words`, t => {
	const output = getTextFitSize(document.getElementById('container'), 'hullo there')
	t.fitsUnder(output, 116.17)
}, 'font: normal normal normal normal 16px / normal Times;')

test(`More words`, t => {
	const output = getTextFitSize(document.getElementById('container'), `in this one I'm going to put more words, because why not`)
	t.fitsUnder(output, 21.78999)
}, 'font: normal normal normal normal 16px / normal Times;')


test(`With bold`, t => {
	const output = getTextFitSize(document.getElementById('container'), 'This is some text yo')
	t.fitsUnder(output, 60.01)
}, 'font: normal normal bold normal 16px / normal Times;')
