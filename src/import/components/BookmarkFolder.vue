<template>
    <div class="bookmark-folder">
        <div class="title" :class="selected && 'selected'">
            <input type="checkbox" v-model="selected">
            <h2>{{ title }}</h2>
        </div>
        <hr>
		<BookmarkItem v-for="link in links" :key="link.id" v-bind="link" :folder="title" :folderSelected="selected" @select="select" @deselect="deselect" />
    </div>
</template>

<script>
import BookmarkItem from './BookmarkItem.vue'

export default {
    name: 'BookmarkFolder',
    data() {
        return {
            selected: false
        }
    },
    props: ['title', 'links', 'selectAll'],
    components: {
        BookmarkItem
    },
    methods: {
        select(e) {
            this.$emit('select', e)
        },
        deselect(e) {
            this.$emit('deselect', e)
        }
    },
    watch: {
        selectAll(newVal) {
            this.selected = newVal
        }
    }
}
</script>

<style lang="scss" scoped>

    .bookmark-folder {
        background: var(--background-2nd);
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
    }

    .title {
        display: flex;
        align-items: center;
        border: 3px solid transparent;
        border-radius: var(--border-radius);
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
        padding: 0.8rem 1rem;

        &.selected {
            background: var(--grey);
        }

        & input {
            margin-right: 1rem;
        }

        & h2 {
            margin: 0;
        }
    }
</style>