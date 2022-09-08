<!-- 17.3.1-3头部组件Header.vue -->

<template>
    <div class="header">
        <img src="@/assets/images/logo.png">
        <HeaderSearch/>
        <HeaderCart/>
        <span v-if="!user">你好，请<router-link to="/login">登录</router-link>免费<router-link to="/register">注册</router-link></span>
        <span v-else>欢迎您,{{ user.username }}, <a href="javascript:;" @click="logout">退出登录</a></span>
    </div>
</template>

<script>
import HeaderSearch from "./17.3.1-1HeaderSearch.vue";
import HeaderCart from "./17.3.1-2HeaderCart.vue";
import { mapState, mapMutations } from 'vuex'

export default {
    name: "Header",
    
    components: {
        HeaderSearch,
        HeaderCart,
    },

    computed: {
        //user模块带有命名空间
        ...mapState('user', [
            //将this.user映射为this.$store.state.user.user
            'user'
        ])
    },

    methods: {
        logout() {
            this.deleteUser();
        },
        //user模块带有命名空间
        ...mapMutations('user', [
            //将this.deleteUser映射为this.$store.commit('user/deleteUser')
            'deleteUser'
        ])
    },
};
</script>