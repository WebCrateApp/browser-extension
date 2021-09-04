<template>
    <div class="bookmark-item" :class="selected && 'selected'" @click.stop="selected = !selected">
        <input type="checkbox" v-model="selected">
        <div class="content">
            <p>{{ title }}</p>
            <a :href="url">{{ url }}</a>
        </div>
    </div>
</template>

<script>
import BookmarkItem from './BookmarkItem.vue'

export default {
    name: 'BookmarkItem',
    data() {
        return {
            selected: false
        }
    },
    props: ['title', 'id', 'dateAdded', 'url', 'folderSelected', 'folder'],
    components: {
        BookmarkItem
    },
    watch: {
        folderSelected(newVal) {
            this.selected = newVal
        },
        selected(newVal) {
            if (newVal) {
                this.$emit('select', { title: this.title, url: this.url, crate: this.folder, id: this.id })
                return
            }

            this.$emit('deselect', this.id)
        }
    }
}
</script>

<style lang="scss" scoped>
    .bookmark-item {
        padding: 0.8rem 1rem;
        display: flex;
        align-items: center;

        & .content {
            overflow: hidden;
            margin-left: 1rem;

            p {
                margin: 0;
                font-weight: 500;
            }
        }

        &.selected {
            background: var(--grey);
        }

        &:last-child {
            border-bottom-right-radius: var(--border-radius);
            border-bottom-left-radius: var(--border-radius);
        }
    }
</style>