<template>
	<div v-if="state === 'load'" class="wrapper">
		<p>Loading crates...</p>
	</div>
	<div v-else-if="state === 'done'" class="add-wrapper">
		<div class="inputs">
			<textarea v-model="url" v-focus class="input" placeholder="url" rows="3"></textarea>
		</div>
		<hr>
		<div class="dropdown-wrapper">
			<div class="dropdown">
				<v-select
					v-model="selectedCrate"
					:reduce="item => item.id"
					:options="crates"
					:get-option-label="(crate) => `${ emojiIcon(crate.icon) } ${ crate.name }`"
					placeholder="Select a crate (optional)"
				></v-select>
			</div>
		</div>
		<hr>
		<div class="actions">
			<button class="primary-button" @click.stop="create">Add link to WebCrate</button>
			<a :href="this.detaInstance" target="_blank">
				<button class="button">Open dashboard</button>
			</a>
		</div>
	</div>
	<div v-else-if="state === 'loading'" class="wrapper">
		<p>Adding link...</p>
	</div>
	<div v-else-if="state === 'success'" class="wrapper">
		<h1>Link added!</h1>
		<a :href="`${ this.detaInstance }?link=${ link.id }`" target="_blank">
			<button class="primary-button">View link</button>
		</a>
	</div>
	<div v-else-if="state === 'login'" class="wrapper">
		<h1>{{ errorMsg }}</h1>
		<p>Please login to your WebCrate instance and try again! If this keeps happening, make sure you set the correct URL in the settings.</p>
		<a :href="detaInstance" target="_blank">
			<button class="primary-button">Login to add a link</button>
		</a>
	</div>
	<div v-else class="wrapper">
		<p>Error: {{ error }}</p>
	</div>
</template>

<script>
	import axios from 'axios'
	import '../main.scss'
	import emojis from './emojis'

	export default {
		data() {
			return {
				state: 'load',
				link: undefined,
				url: undefined,
				detaInstance: undefined,
				appApiKey: undefined,
				selectedCrate: undefined,
				crates: [],
				error: undefined,
				errorMsgs: [
					'Oh oh!',
					'Whoops!',
					'Not logged in',
					'Looks like you need to login',
					'Looks like you\'re not logged in'
				]
			}
		},
		computed: {
			errorMsg() {
				return this.errorMsgs[Math.floor(Math.random() * this.errorMsgs.length)]
			}
		},
		methods: {
			emojiIcon(name) {
				return emojis[name]
			},
			getCurrentUrl() {
				chrome.tabs.query({
					currentWindow: true,
					active: true
				}, tabs => {
					this.url = new URL(tabs[0].url)
				})
			},
			injectIntoInputs(address) {
				chrome.tabs.query({
					active: true,
					currentWindow: true
				}, tabs => {
					chrome.tabs.sendMessage(tabs[0].id, {
						action: "set",
						value: address
					})
				})
			},
			async getCrates() {
				try {
					const res = await axios.get(`${ this.detaInstance }server/api/crate?limit=0`, {
						headers: {
							'X-Space-App-Key': this.appApiKey
						}
					})

					// Check if we need to login by checking if we got redirected to the login page
					if (res.request.responseURL.includes('deta.space/login')) {
						this.state = 'login'
						return
					}

					this.crates = res.data.data
					this.state = 'done'
				} catch (err) {
					// Assume it's a login error (we can't specifically check for that)
					if (err.message === 'Network Error') {
						this.state = 'login'
						return
					}

					this.error = err.message || 'Unknown error occurred!'
					this.state = 'error'
					console.error(err)
				}
			},
			async create() {
				try {
					this.state = 'loading'
					const res = await axios.post(`${ this.detaInstance }server/api/link`, {
						url: this.url,
						crate: this.selectedCrate
					}, {
						headers: {
							'X-Space-App-Key': this.appApiKey
						}
					})

					// Check if we need to login by checking if we got redirected to the login page
					if (res.request.responseURL.includes('deta.space/login')) {
						this.state = 'login'
						return
					}

					this.link = res.data.data
					this.url = undefined
					this.state = 'success'
				} catch (err) {
					// Assume it's a login error (we can't specifically check for that)
					if (err.message === 'Network Error') {
						this.state = 'login'
						return
					}

					this.error = err.message || 'Unknown error occurred!'
					this.state = 'error'
					console.error(err)
				}
			}
		},
		created() {
			this.getCurrentUrl()
			chrome.storage.local.get((items) => {
				this.detaInstance = items.detaInstance
				this.appApiKey = items.appApiKey

				if (!this.detaInstance || !this.appApiKey) {
					return chrome.runtime.openOptionsPage()
				}

				this.getCrates()
			})
		}
	}
</script>

<style lang="scss" scoped>
	.add-wrapper {
		text-align: center;
		background: var(--background);
		border-radius: var(--border-radius);
		--padding-x: 1rem;
		padding-bottom: 0.5rem;
	}

	.wrapper {
		text-align: center;
		padding: 1.5rem;
		padding-bottom: 2rem;
		background: var(--background);
		border-radius: var(--border-radius);

		& h1 {
			margin-bottom: 1rem;
			font-size: 1.2rem;
		}

		& p {
			margin-bottom: 1rem;
		}
	}

	.inputs {
		padding: var(--padding-x);
		padding-bottom: 0.5rem;
	}

	.actions {
		display: flex;
		align-items: center;
		padding: 0.5rem var(--padding-x);

		& a {
			margin-left: auto;
		}

		& button {
			font-size: 0.9rem;
		}
	}

	.dropdown-wrapper {
		display: flex;
		align-items: center;
		padding: 0.5rem var(--padding-x);

		& p {
			margin-right: 5rem;
		}

		& .dropdown {
			margin-left: auto;
			flex-grow: 1;
		}
	}
</style>