<!-- 17.7.2-3图书评价组件BookCommentListItem.vue -->

<template>
    <div class="bookCommentListItem">
        <div>
            <span>{{ item.username }}</span>
            <span>{{ formatTime(item.commentDate) }}</span>
        </div>
        <div>{{ item.content }}</div>
    </div>
</template>

<script>
export default {
    name: 'BookCommentListItem',
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    inject: ['formatTime'],
}
</script>