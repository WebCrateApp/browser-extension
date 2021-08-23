# webcrate-extension

Browser extension for [WebCrate](https://webcrate.app)

## Introduction

This repo contains the browser extension for both Chrome and Firefox. It is build with Vue.js and uses the [WebCrate API](https://webcrate.app/docs/api) to add new links.

## Installation

You have to build the extension manually (see below), use the pre-packaged version which can be found on the [releases tab](https://github.com/WebCrateApp/browser-extension/releases) or get the extension from the Addon Stores ([Chrome](https://chrome.google.com/webstore/category/extensions?hl=de), [Firefox](https://addons.mozilla.org/de/firefox/)).

### Install from Addon Store (Chrome/Firefox)

1. Open the Addon Store ([Chrome](https://chrome.google.com/webstore/category/extensions?hl=de), [Firefox](https://addons.mozilla.org/de/firefox/))

2. Search for "Webcrate" in the search bar

3. Click on the Install-Button and follow the installation instructions

### Building the extension (Chrome)

Download the repo:

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