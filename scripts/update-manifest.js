#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const MANIFEST_PATH = '../src/manifest.json'

const modifyManifest = async (version) => {
	const manifestJson = require(MANIFEST_PATH)

	if (manifestJson.version !== version) {
		console.log(`Updating manifest version from v${ manifestJson.version } to v${ version }`)

		manifestJson.version = version
		await fs.promises.writeFile(path.join(__dirname, MANIFEST_PATH), JSON.stringify(manifestJson, null, 2))
	}
}

const main = async () => {
	try {
		console.log('Checking manifest')

		const extPackageJson = require('../package.json')

		await modifyManifest(extPackageJson.version)

		console.info('OK')
	} catch (err) {
		console.error(err)
	}
}

main()