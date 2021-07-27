/* eslint-disable no-undef */

// Handle omnibox shortcut
chrome.omnibox.onInputEntered.addListener((input) => {
	chrome.storage.sync.get((items) => {
		const detaInstance = items.detaInstance

		if (!detaInstance) {
			return
		}

		const newURL = encodeURIComponent(input)
		chrome.tabs.update(undefined, { url: `${ detaInstance }?addUrl=${ newURL }`, highlighted: false })
	})
})

// Show settings page after install
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.runtime.openOptionsPage()
	}
})