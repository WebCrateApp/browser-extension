<template>
	<div v-if="state === 'load'" class="wrapper">
		<input v-model="url" class="input" placeholder="url">
		<div class="actions">
			<button class="primary-button" @click.stop="create">Add Link</button>
			<a :href="this.detaInstance" target="_blank">
				<button class="button">Open WebCrate</button>
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
		<p>Please login to your WebCrate instance and try again!</p>
		<a href="https://deta.space/login" target="_blank">
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

	export default {
		data() {
			return {
				state: 'load',
				link: undefined,
				url: undefined,
				detaInstance: undefined,
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
			create: async function () {
				this.state = 'loading'
				const res = await axios.post(`${ this.detaInstance }api/link`, {
					url: this.url
				})

				if (res.request.responseURL.includes('deta.space/login')) {
					console.log('Not authorized')
					this.state === 'login'
					return
				}

				if (res.data.status === 200) {
					this.link = res.data.data
					this.url = undefined
					this.state = 'success'
				} else {
					console.log(res.data)
					this.error = res.data.message || res.data || 'Unknown error occurred!'
					this.state === 'error'
				}
			}
		},
		created() {
			this.getCurrentUrl()
			chrome.storage.local.get((items) => {
				this.detaInstance = items.detaInstance
			})
		}
	}
</script>

<style lang="scss" scoped>
	.wrapper {
		text-align: center;
		padding: 1.5rem;
		padding-bottom: 2rem;
		background: var(--background);
		border-radius: var(--border-radius);
	}

    h1 {
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

	p {
		margin-bottom: 1rem;
	}

	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 1rem;

		& a {
			margin-left: 1rem;
		}
	}
</style>