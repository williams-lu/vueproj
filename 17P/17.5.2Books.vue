<!-- 17.5.2 Books组件 -->

<template>
    <div>
        <Loading v-if="loading" />
        <h3 v-else>{{ title }}</h3>
        <BookList :list="books" v-if="books.length"/>
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import BookList form "@/components/BookList"
import Loading from '@/components/Loading.vue'

export default {
    name: 'Books',
    data() {
        return {
            title: '',
            books: [],
            message: '',
            loading: true
        };
    },

    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.title = to.meta.title;
            let url = vm.setRequestUrl(to.fullPath);
            vm.getBooks(url);
        });
    },

    components: {
        BookList,
        Loading
    },

    methods: {
        getBooks(url) {
            this.message = '';
            this.axios.get(url)
                .then(response => {
                    if(response.status === 200) {
                        this.loading = false;
                        this.books = response.data;
                        if(this.books.length === 0) {
                            if(this.$route.name === "category")
                                this.message = "当前分类下没有图书！"
                            else
                                this.message = "没有搜索到匹配的图书！"
                        }
                    }
                })
                .catch(error => alert(error));
        },
        //动态设置服务器数据接口的请求URL
        setRequestUrl(path) {
            let usl = path;
            if(path.indexOf("/category") != -1) {
                url = "/book" + url;
            }
            return url;
        }
    }
}
</script>