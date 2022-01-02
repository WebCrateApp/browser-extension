<template>
	<div class="settings">
		<Logo />
		<div class="wrapper">
			<h1>🔨 Extension Settings</h1>
			<p>To use the extension you need to connect it to your own WebCrate instance. Learn more in the <a href="https://webcrate.app/docs">documentation</a>.</p>
			<hr>
			<label for="input">Deta Space instance:</label>
			<input v-model="detaInstance" id="input" class="input" placeholder="https://webcrate.username.deta.app">
			<p v-if="error" class="error">{{ error }}</p>
			<div class="actions">
				<button class="primary-button" @click.stop="save">{{ saveText }}</button>
				<a :href="detaInstance || 'https://webcrate.app/open'" target="_blank">
					<button class="button">Open your WebCrate</button>
				</a>
			</div>
		</div>
		<div class="wrapper">
			<h1>📚 How to use it</h1>
			<p>There are multiple ways to use the extension to add links to your WebCrate instance:</p>
			<hr>
			<h2>Popup</h2>
			<p>Open the extension popup by clicking on the extension icon in the toolbar or use the keyboard shortcut (default is Alt+Shift+L).</p>
			<h2>Context Menu</h2>
			<p>Right click on an link and select "Add link to WebCrate" from the context menu.</p>
			<h2>Omnibox</h2>
			<p>Start typing "wc" in your address bar and hit tab. Everything you typ after that will be added as link to your WebCrate instance once you hit enter.</p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import '../main.scss'
	import Logo from './components/Logo.vue'
	
	export default {
		data() {
			return {
				detaInstance: undefined,
				saveText: 'Save Settings',
				error: undefined,
				closeAfterUpdate: false
			}
		},
		methods: {
			async save() {
				try {
					this.saveText = 'Verifying...'

					const detaInstance = this.parseUrl(this.detaInstance)
					this.detaInstance = detaInstance

					const isValid = await this.verifyUrl()

					if (!isValid) {
						this.error = 'Invalid Deta instance!'
						this.saveText = 'Save Settings'
						return
					}

					chrome.storage.local.set({ detaInstance }, () => {
						this.saveText = 'Saved!'
						this.error = undefined

                        // Close window after configuration on installation
                        if (this.closeAfterUpdate) {
                            setTimeout(() => {
                                window.close()
                            }, 500)
                        }

						setTimeout(() => {
							this.saveText = 'Save Settings'
						}, 2000)
					})
				} catch (e) {
					this.error = 'Invalid Deta instance!'
					this.saveText = 'Save Settings'
				}
			},
			async verifyUrl() {
				try {
					await axios.get(`${ this.detaInstance }api/public/link`)

					return false
				} catch (err) {

					if (err.response && err.response.status === 400) {
						return true
					}

					console.error(err)

					return false
				}
			},
			restore(result) {
				this.detaInstance = result.detaInstance
			},
			parseUrl (rawUrl) {
				const withProtocol = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') ? rawUrl : `https://${ rawUrl }`

				return new URL(withProtocol).toString()
			}
		},
		components: {
			Logo
		},
		created() {
			chrome.storage.local.get((items) => {
				// detaInstance will be undefined on installation
				if (!items.detaInstance) {
					this.closeAfterUpdate = true
					return
				}

				this.detaInstance = items.detaInstance
			})
		}
	}
</script>

<style lang="scss">
	html,
	body {
		margin: 0;
		width: 100%;
		height: 100%;
		font-family: Inter UI, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
		color: var(--text);
		background: var(--background);
	}

	.settings {
		padding: 5rem 0;
		width: 95%;
		max-width: 700px;
		margin: auto;
	}

	.wrapper {
		margin-top: 3rem;
		background: var(--background-2nd);
		padding: 2rem;
		border-radius: var(--border-radius);
	}

    h1 {
        margin-bottom: 1rem;
        font-size: 1.3rem;
    }

	h2 {
        font-size: 1rem;
    }

	a {
		color: var(--accent);

		&:hover {
			text-decoration: underline;
		}
	}

	hr {
		margin-bottom: 1rem;
	}

	label {
		font-size: 1rem;
	}

	input {
		margin-top: 0.5rem;
		background: var(--grey) !important;

		&:focus {
			border: 2px solid var(--grey-light) !important;
		}
	}

	.error {
		color: var(--red);
	}

	.actions {
		display: flex;
		align-items: center;
		margin-top: 1rem;

		& a {
			margin-left: 1rem;
		}
	}
</style>