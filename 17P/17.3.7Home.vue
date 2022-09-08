<!-- 17.3.7 首页组件 -->

<template>
    <div class="class">
        <HomeCategory/>
        <HomeScrollPic/>
        <HomeBooksHot/>
        <BooksNew/>
    </div>
</template>

<script>
import HomeCategory from '@/components/HomeCategory.vue'
import HomeScrollPic from '@/components/HomeScrollPic.vue'
import HomeBooksHot from '@/components/HomeBooksHot.vue'
import BooksNew from '@/components/BooksNew.vue'

export default {
    name: 'home',
    components: {
        HomeCategory,
        HomeScrollPic,
        HomeBooksHot,
        BooksNew
    }
}
</script>