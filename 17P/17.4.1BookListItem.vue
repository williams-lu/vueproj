<!-- 17.4.1 商品列表项组件BookListItem.vue -->

<template>
    <div class="bookListItem">
        <div>
            <img :src="item.bigImgUrl">
        </div>
        <p class="title">
            <router-link
                :to="{ name: 'book', params: { id: item.id }}"
                target="_blank">
                {{ item.title }}
            </router-link>
        </p>
        <p>
            <span class="factPrice">
                {{ currency(factPrice(item.price, item.discount)) }}
            </span>
            <span>
                定价：<i class="price">{{ currency(item.price) }}</i>
            </span>
        </p>
        <p>
            <span>{{ item.author }}</span>
            <span>{{ item.publishDate  }}</span>
            <span>{{ item.bookConcern }}</span>
        </p>
        <p>
            {{ item.brief }}
        </p>
        <p>
            <button class="addCartButton" @click=addCartItem(item)>
                加入购物车
            </button>
        </p>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'BookListItem',
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    methods: {
        ...mapActions('cart', {
            //将this.addCart()映射为this.$store。commit('cart/addProductToCart')
            addCart: 'addProductToCart'
        }),
        factPrice(price, discount) {
            return price * discount;
        },
        addCartItem(item) {
            let quantity = 1;
            let newItem = {
                ...item,
                price: this.factPrice(item.price, item.discount),
                quantity
            };
            this.addCart(newItem);
            this.$router.push("/cart");
        }
    }
}
</script>
