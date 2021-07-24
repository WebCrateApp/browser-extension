# webcrate-extension

Browser extension for [WebCrate](https://webcrate.app)

## Introduction

This repo contains the browser extension for both Chrome and Firefox. It is build with Vue.js and uses the [WebCrate API](https://webcrate.app/docs/api) to add new links.

## Installation

You have to build the extension manually (see below) or use the pre-packaged version which can be found on the [releases tab](https://github.com/BetaHuhn/webcrate-extension/releases)

### Building the extension

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

