/* eslint-disable no-undef */

// Handle omnibox shortcut
chrome.omnibox.onInputEntered.addListener((input) => {
	chrome.storage.local.get((items) => {
		const detaInstance = items.detaInstance

		if (!detaInstance) {
			return
		}

		const newURL = encodeURIComponent(input)
		chrome.tabs.update(undefined, { url: `${ detaInstance }?addUrl=${ newURL }`, highlighted: false })
	})
})

chrome.contextMenus.onClicked.addListener(({ menuItemId }) => {
	chrome.storage.local.get((items) => {
		const detaInstance = items.detaInstance

		if (menuItemId === 'view-links') {
			chrome.tabs.create({
				url: detaInstance
			})
		} else if (menuItemId === 'report-bug') {
			chrome.tabs.create({
				url: 'https://github.com/WebCrateApp/feedback/issues/new/choose'
			})
		} else if (menuItemId === 'open-docs') {
			chrome.tabs.create({
				url: 'https://webcrate.app/docs'
			})
		} else if (menuItemId === 'open-settings') {
			chrome.runtime.openOptionsPage()
		}

	})
})

/* context menu */
chrome.contextMenus.create({
	title: 'View links',
	id: 'view-links',
	contexts: [ 'browser_action' ]
})

chrome.contextMenus.create({
	title: 'Open docs',
	id: 'open-docs',
	contexts: [ 'browser_action' ]
})

chrome.contextMenus.create({
	title: 'Report bug',
	id: 'report-bug',
	contexts: [ 'browser_action' ]
})

chrome.contextMenus.create({
	title: 'Open settings',
	id: 'open-settings',
	contexts: [ 'browser_action' ]
})

// Show settings page after install
chrome.runtime.onInstalled.addListener((details) => {
	if (details.reason === 'install') {
		chrome.runtime.openOptionsPage()
	}
})