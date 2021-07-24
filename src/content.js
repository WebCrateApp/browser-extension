// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function(msg) {
	if (msg.action === 'set') {
		const address = msg.value

		const inputs = document.getElementsByTagName('input')

		inputs.forEach((elem) => {
			if (elem.name === 'email' || elem.id.includes('email')) {
				elem.value = address
			}
		})
	}
})