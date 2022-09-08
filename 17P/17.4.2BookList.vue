<!-- 17.4.2 商品列表组件BookList.vue -->

<template>
    <div>
        <div v-for="book in list" :key="book.id">
            <BookListItem :item="book" />
        </div>
    </div>
</template>

<script>
import BookListItem form "./BookListItem"

export default {
    name: 'BookList',
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    components: {
        BookListItem
    },
}
</script>