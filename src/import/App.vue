<template>
	<div class="settings">
		<Logo />
		<div v-if="state === 'load'">
			<div class="wrapper">
				<h1>Import existing bookmarks</h1>
				<p>Here are all bookmarks which where found in this browser. Since WebCrate doesn't support nested crates your folder structure may have been flattened. A new crate will be created for each of your folders. For now importing bookmarks will skip parsing a link title, description and image for each link since it would take for ever with that many links, instead it will reuse the title of the bookmark.</p>
				<p>You can select all or choose individual bookmarks you want to import into your WebCrate. You can also select a folder to import all of its bookmarks.</p>
				<div class="actions">
					<button class="primary-button" @click="importSelected">Import selected <span v-if="selected.length > 0">({{ selected.length }})</span></button>
					<div class="all">
						<input id="all" type="checkbox" v-model="selectAll">
						<label for="all">Select all</label>
					</div>
				</div>
			</div>
			<div class="list">
				<BookmarkFolder v-for="(links, folder) in bookmarks" :key="folder" :title="folder" :links="links" :selectAll="selectAll" @select="select" @deselect="deselect" />
			</div>
		</div>
		<div v-else-if="state === 'error'" class="wrapper">
			<h1>Error occurred</h1>
			<p>{{ error }}</p>
		</div>
		<div v-else-if="selected && state === 'loading'" class="wrapper">
			<h1>Importing {{ selected.length }} bookmarks, may take a while...</h1>
		</div>
		<div v-else-if="state === 'success'" class="wrapper">
			<h1>Successfully imported {{ response.length }} bookmarks!</h1>
			<div class="actions">
				<a :href="this.detaInstance" target="_blank">
					<button class="primary-button">View them</button>
				</a>
				<button class="button" @click="reload">Import more</button>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import '../main.scss'
	import Logo from './components/Logo.vue'
	import BookmarkFolder from './components/BookmarkFolder.vue'
	
	export default {
		data() {
			return {
				state: 'load',
				detaInstance: undefined,
				saveText: 'Save Settings',
				error: undefined,
				closeAfterUpdate: false,
				bookmarks: undefined,
				selectAll: false,
				selected: []
			}
		},
		methods: {
			restore(result) {
				this.detaInstance = result.detaInstance
			},
			getBookmarks() {
				chrome.bookmarks.getTree(treeNode => {
					this.bookmarks = this.flattenBookmarkTree(treeNode[0].children)
				})
			},
			flattenBookmarkTree(bookmarks) {
				const data = {}

				const loop = (items, title) => {
					items.forEach((item) => {
						if (item.children) {
							loop(item.children, item.title)
							return
						}

						if (!data[title]) {
							data[title] = [ item ]
							return
						}

						data[title].push(item)
					})
				}

				loop(bookmarks, 'unfiled')

				return data
			},
			async importSelected() {
				try {
					this.state = 'loading'
					const res = await axios.post(`${ this.detaInstance }api/link/bulk`, this.selected)

					// Check if we need to login by checking if we got redirected to the login page
					if (res.request.responseURL.includes('deta.space/login')) {
						this.state = 'login'
						return
					}

					this.response = res.data.data
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
			},
			select(e) {
				this.selected.push(e)
			},
			deselect(e) {
				this.$delete(this.selected, this.selected.findIndex(item => item.id === e))
			},
			reload() {
				location.reload()
			}
		},
		components: {
			Logo,
			BookmarkFolder
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

			this.getBookmarks()
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
		max-width: 1000px;
		margin: auto;
	}

	.wrapper {
		margin-top: 3rem;
		background: var(--background-2nd);
		padding: 2rem;
		border-radius: var(--border-radius);
	}

	.list {
		margin-top: 3rem;
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

	label {
		font-size: 1rem;
	}

	.actions {
		display: flex;
		align-items: center;

		& button {
			margin-right: 1rem;
		}
	}
</style>