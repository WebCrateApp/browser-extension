const webpack = require('webpack')
const ejs = require('ejs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

const { version } = require('./package.json')

const config = {
	mode: process.env.NODE_ENV,
	context: path.join(__dirname, 'src'),
	entry: {
		'background': './background.js',
		'popup/index': './popup/index.js',
		'options/index': './options/index.js',
		'import/index': './import/index.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js'
	},
	resolve: {
		extensions: [ '.js', '.vue' ]
	},
	module: {
		rules: [{
			test: /\.vue$/,
			loader: 'vue-loader'
		},
		{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},
		{
			test: /\.css$/,
			use: [ MiniCssExtractPlugin.loader, 'css-loader' ]
		},
		{
			test: /\.scss$/,
			use: [
				MiniCssExtractPlugin.loader,
				'css-loader',
				'sass-loader'
			]
		},
		{
			test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				outputPath: '/images/',
				emitFile: true,
				esModule: false
			}
		},
		{
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			loader: 'file-loader',
			options: {
				name: '[path][name].[ext]',
				outputPath: '/fonts/',
				emitFile: true,
				esModule: false
			}
		}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			global: 'window'
		}),
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),
		new CopyPlugin([{
			from: 'icons',
			to: 'icons',
			ignore: [ 'icon.xcf' ]
		},
		{
			from: 'popup/index.html',
			to: 'popup/index.html',
			transform: transformHtml
		},
		{
			from: 'options/index.html',
			to: 'options/index.html',
			transform: transformHtml
		},
		{
			from: 'import/index.html',
			to: 'import/index.html',
			transform: transformHtml
		},
		{
			from: 'manifest.json',
			to: 'manifest.json',
			transform: (content) => {
				const jsonContent = JSON.parse(content)
				jsonContent.version = version

				if (config.mode === 'development') {
					jsonContent['content_security_policy'] = 'script-src \'self\' \'unsafe-eval\'; object-src \'self\''
				}

				return JSON.stringify(jsonContent, null, 2)
			}
		}
		])
	]
}

if (config.mode === 'production') {
	config.plugins = (config.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		})
	])
}

if (process.env.HMR === 'true') {
	config.plugins = (config.plugins || []).concat([
		new ExtensionReloader({
			manifest: path.join(__dirname, 'src', 'manifest.json')
		})
	])
}

function transformHtml(content) {
	return ejs.render(content.toString(), {
		...process.env
	})
}

module.exports = config