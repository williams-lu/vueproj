<!-- 17.7.3 Book组件 -->

<template>
    <div class="book">
        <img :src="book.bigImgUrl" />
        <div>
            <div class="bookInfo">
                <h3>{{ book.title }}</h3>
                <p>{{ book.slogan }}</p>
                <p>
                    <span>作者: {{ book.author }}</span>
                    <span>出版社: {{ book.bookConcern }}</span>
                    <span>出版日期：{{ book.publishDate }}</span>
                </p>
                <p>
                    <span class="factPrice">
                        {{ currency(factPrice(book.price, book.discount)) }}
                    </span>
                    <span class="discount">
                        [{{ formatDiscount(book.discount) }}]
                    </span>
                    <span>[定价 <i class="price">{{ currency(book.price) }}]</i></span>
                </p>
            </div>
            <div class="addCart">
                <AddSubtractButton :quantity="quantity" @updateQuantity="handleUpdate"/>
                <button class="addCartButton" @click="addCart(book)">加入购物车</button>
            </div>
        </div>
        <BookTabComponent :content="book.detail"/>
    </div>
</template>

<script>
import AddSubtractButton from '@/components/AddSubtractButton'
import BookTabComponent from '@/components/BooktabComponent'
import { mapActions } from 'vuex'

export default {
    name: 'Book',
    data() {
        return {
            book:  {},
            quantity: 0,
        }
    },
    components: {
        AddSubtractButton,
        BookTabComponent,
    },
    created() {
        this.axios.get(this.$route.fullPath)
            .then(response => {
                if(response.status === 200) {
                    this.book = response.data;
                }
            }).catch(error => alert(error));
    },
    methods: {
        //子组件AddSubtractButton的自定义事件updateQuantity的处理函数
        handleUpdate(value) {
            this.quantity = value;
        },
        addCart(book) {
            let quantity = this.quantity;

            if(quantity === 0) {
                quantity = 1;
            }

            let newItem = { ...book, price:this.factPrice(book.price, book.discount)};
            this.addProductToCart({ ...newItem, quantity });
            this.$router.push('/cart');
        },
        ...mapActions('cart', [
            //将this.addProductToCart映射为this.$store.dispatch('cart/addProductToCart')
            'addProductToCart'
        ]),
        //格式化折扣数据
        formatDiscount(value) {
            if(value) {
                let strDigits = value.toString().substring(2);
                strDigits += "折";
                return strDigits;
            }
            else
                return value;
        }
    }
}
</script>