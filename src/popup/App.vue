<template>
	<div class="wrapper">
		<h1>Add a new link to your WebCrate</h1>
		<input v-model="url" class="input" placeholder="url">
        <button class="button">Add Link</button>
		<p>{{ detaInstance }}</p>
	</div>
</template>

<script>
	import '../main.scss'
	const appDomain = "https://fra2.webcrate.app";

	export default {
		data() {
			return {
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
				chrome.tabs.create({
					url: `${appDomain}/login`,
					active: true
				})
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
		padding: 1rem;
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