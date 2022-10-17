<!-- 17.3.6 新书上市组件 -->

<template>
    <div class="booksNew">
        <h3>新书上市</h3>
        <div class="book" v-for="book in books" :key="book.id">
            <figure>
                <router-link :to="'/book/' + book.id">
                <img :src="book.imgUrl">
                <figcaption>
                    {{ book.title }}
                </figcaption>
                </router-link>
            </figure>
            <p>
                {{ currency(factPrice(book.price, book.discount)) }}
                <span>{{ currency(book.price) }}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: [''],
    data() {
        return {
            books: [],
        };
    },
    inject: ['factPrice', 'currency'],
    created() {
        this.axios.get("/book/new")
        .then(renponse => {
            if( response.status === 200 {
                this.loading = false;
                this.books = response.data;
            }
        })
        .catch(error => console.log(error));
    }
}
</script>