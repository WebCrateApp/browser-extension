#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const DEST_DIR = path.join(__dirname, '../dist')
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip')

const makeDestZipDirIfNotExists = () => {
	if (!fs.existsSync(DEST_ZIP_DIR)) {
		fs.mkdirSync(DEST_ZIP_DIR)
	}
}

const buildZip = (src, dist, zipFilename) => {
	const archive = archiver('zip', { zlib: { level: 9 } })
	const stream = fs.createWriteStream(path.join(dist, zipFilename))

	return new Promise((resolve, reject) => {
		archive
			.directory(src, false)
			.on('error', (err) => reject(err))
			.pipe(stream)

		stream.on('close', () => resolve())
		archive.finalize()
	})
}

const main = async () => {
	try {
		const extPackageJson = require('../package.json')
		const zipFilename = `${ extPackageJson.name }.zip`

		makeDestZipDirIfNotExists()

		console.log(`Building ${ zipFilename }`)

		await buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
		console.info('OK')
	} catch (err) {
		console.error(err)
	}
}

main()