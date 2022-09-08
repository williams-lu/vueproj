<!-- 17.7.2标签页组件App.vue -->

<!-- 修改部分,通过Provide选项为后代组件提供两个函数 -->

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
import { factPrice, currency, formatTime } from './utils/util.js'

export default {
    components: {
        Header,
        Menus,
    },
    provide() {
        return {
            factPrice,
            currency,
            formatTime,
        }
    }
}
</script>