<template>
	<div class="settings">
		<Logo />
		<div class="wrapper">
			<h1>WebCrate Extension Settings</h1>
			<p>To use the extension you need to connect it to your own WebCrate instance. Learn more in the <a href="https://webcrate.app/docs">documentation</a>.</p>
			<hr>
			<label for="input">Deta Space instance:</label>
			<input v-model="detaInstance" id="input" class="input" placeholder="https://webcrate.username.deta.app">
			<p v-if="error" class="error">{{ error }}</p>
			<div class="actions">
				<button class="primary-button" @click.stop="save">{{ saveText }}</button>
				<a :href="detaInstance || 'https://open.webcrate.app'" target="_blank">
					<button class="button">Open your WebCrate</button>
				</a>
			</div>
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
				error: undefined
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

                    // Close window after configuration on startup validation
                    let detaInstanceChromeStorage = undefined;
                    let closeAfterUpdate = false;
                    chrome.storage.local.get((items) => {
                        detaInstanceChromeStorage = items.detaInstance
                    })
                    if (detaInstanceChromeStorage === undefined) closeAfterUpdate = true;

					chrome.storage.local.set({ detaInstance }, () => {
						this.saveText = 'Saved!'
						this.error = undefined

                        // Close window after configuration on startup
                        if (closeAfterUpdate) {
                            setTimeout(() => {
                                window.close();
                            }, 500);
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
		padding-top: 5rem;
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
        font-size: 1.2rem;
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