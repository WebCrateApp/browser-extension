<div align="center">

# 💻🌍 WebCrate Extension

Chrome/Firefox Browser extension for WebCrate

[🔮 Website](https://webcrate.app) - [📚 Docs](https://webcrate.app/docs) - [🐞 Issues](https://github.com/WebCrateApp/feedback)

<br/>

</div>

## 👋 Introduction

This repo contains the browser extension for both Chrome and Firefox. It is build with Vue.js and uses the [WebCrate API](https://webcrate.app/docs/api) to add new links.

## 🚀 Installation

You can get the extension from the respective store for ([Chrome](https://chrome.google.com/webstore/detail/webcrate-browser-extensio/hfioihmgjcjdepficckgginjciabkndc) and [Firefox](https://addons.mozilla.org/en-US/firefox/addon/webcrate/)) or build the extension manually (see below).

After the extension is installed successfully it will open the settings page where you have to paste the URL of your WebCrate instance.

## 📚 Usage 

Click the WebCrate logo in your toolbar and add a new link to your WebCrate instance. You can also use the keyboard shortcut (`Alt+Shift+L` by default) to open the popup.

## 🔨 Building the extension manually

Clone the repo:

```
git clone https://github.com/WebCrateApp/browser-extension
```

Change directory:

```
cd browser-extension
```

Install  dependencies:

```
npm install
```

Build extension:

```
npm run build
```

Then, go to [chrome://extensions/](chrome://extensions/) in your browser and enable developer mode. Click on "Load unpacked" and select the dist folder.
