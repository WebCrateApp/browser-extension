<template>
	<div v-if="state === 'load'" class="wrapper">
		<h1>Add a new link to your <a :href="detaInstance" target="_blank">WebCrate</a></h1>
		<input v-model="url" class="input" placeholder="url">
        <button class="button" @click.stop="create">Add Link</button>
	</div>
	<div v-else-if="state === 'success'" class="wrapper">
		<h1>Link added!</h1>
		<a :href="`${ this.detaInstance }/?link=${ link.id }`" class="button" target="_blank">View link</a>
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
				detaInstance: undefined
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
				const { data } = await axios.post(`${ this.detaInstance }/api/link`, {
					url: this.url
				})

				if (data.status === 200) {
					this.link = data.data
					this.url = undefined
					this.state = 'success'
				} else {
					console.log(data)
				}
			}
		},
		created() {
			this.getCurrentUrl()
			chrome.storage.sync.get((items) => {
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

    button {
        margin-top: 1rem;
    }
</style>