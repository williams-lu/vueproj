<!-- 17.3.1-1头部搜索框组件HeaderSearch.vue -->

<template>
    <div class="headerSearch">
        <input type="search" v-model.trim="keyword">
        <button @click="search">搜索</button>
    </div>
</template>

<script>
export default {
    name: 'HeaderSearch',
    data() {
        return {
            keyword: ''
        };
    },
    methods: {
        search() {
            //当查询关键字与当前路由对象中的查询参数wd值不同时，才调用$router.push()方法
            if(this.keyword != this.$route.query.wd)
                this.$router.push({path: '/search', query: { wd: this.keyword }})
        }
    },
}
</script>
