<!-- 17.3.2菜单组件App.vue -->

<template>
    <div id="app">
        <Header/>
        <Menus/>
        <router-view/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Menus from '@/components/Menus.vue'

export default {
    components: {
        Header,
        Menus,
    }
}
</script>