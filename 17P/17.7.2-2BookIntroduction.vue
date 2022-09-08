<!-- 17.7.2-2图书介绍组件BookIntroduction.vue -->

<template>
    <div>
        <p>{{ content }}</p>
    </div>
</template>

<script>
export default {
    name: 'BookIntroduction',
    props: {
        content: {
            type: String,
            default: '',
        }
    }
}
</script>