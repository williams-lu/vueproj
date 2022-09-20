<template>
    <p>
        <router-link to="/">主页</router-link>
        <router-link to="/news">新闻</router-link>
        <router-link to="/books">图书</router-link>
        <router-link to="/videos">视频</router-link>
    </p>
    <router-view></router-view>
</template>

<script>
export default {
    name: 'App',
    components: {
    }
}
</script>
...