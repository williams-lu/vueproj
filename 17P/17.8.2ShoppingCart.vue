// 17.8.2 购物车组件ShoppingCart.vue

<template>
    <div class="shoppingCart">
        <table>
            <tr>
                <th></th>
                <th>商品名称</th>
                <th>单价</th>
                <th>数量</th>
                <th>金额</th>
                <th>操作</th>
            </tr>
            <tr v-for="book in books" :key="book.id">
                <td><img :src="book.imgUrl"></td>
                <td>
                    <router-link :to="{name:'book', params:{id: book.id}}" target="_blank">
                        {{ book.title }}
                    </router-link>
                </td>
                <td>{{ currency(book.price) }}</td>
                <td>
                    <button @click="handleSubtract(book)">-</button>
                        {{ book.quantity }}
                    <button @click="handleAdd(book.id)">+</button>
                </td>
                <td>{{ currency(cartItemPrice(book.id)) }}</td>
                <td>
                    <button @click="deleteCartItem(book.id)">删除</button>
                </td>
            </tr>
        </table>
        <p>
            <span><button class="checkout" @click="checkout">结算</button></span>
            <span>总价: {{ currency(cartItemPrice) }}</span>
        </p>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
    name: "ShoppingCart",
    inject: ['currency'],
    computed: {
        ...mapState('cart', {
            books: 'items'
        }),
        ...mapGetters('cart', [
            'cartItemPrice',
            'cartTotalPrice',
        ])
    },

    methods: {
        itemPrice(price, count) {
            return price * count;
        },
        ...mapMutations('cart', [
            'deleteCartItem',
            'incrementItemQuantity',
            'setCartItems'
        ]),
        handleAdd(id) {
            this.incrementItemQuantity({ id: id, quantity: 1 });
        },

        handleSubtract(book) {
            let quantity = book.quantity -1;
            
            if(quantity <= 0) {
                this.deleteCartItem(book.id);
            }
            else
                this.incrementItemQuantity({ id: book.id, quantity: -1 });
        },
        checkout() {
            this.$router.push("/check");
        }
    }
};
</script>