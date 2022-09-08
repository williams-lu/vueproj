
import { factPrice } from './17.3.5util';

import { currency } from './17.3.5util';
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
                </p>
            </div>
        </div>
    </div>
</template>