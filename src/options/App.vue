<template>
	<div class="wrapper">
		<h1>WebCrate Extension Settings</h1>
		<label>Deta Space instance:</label>
		<input v-model="detaInstance" class="input" placeholder="url">
        <button class="button" @click.stop="save">Save</button>
	</div>
</template>

<script>
	import '../main.scss'
	
	export default {
		data() {
			return {
				detaInstance: undefined
			}
		},
		methods: {
			save() {
				chrome.storage.sync.set({
					detaInstance: this.url
				})
			},
			restore(result) {
				this.detaInstance = result.detaInstance
			}
		},
		created() {
			chrome.storage.sync.get((items) => {
				this.detaInstance = items.detaInstance
			})
		}
	}
</script>

<style lang="scss">
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