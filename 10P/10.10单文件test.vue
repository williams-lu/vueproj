<template>
    <div>
        <ul class="item">
            <li class="username">用户名: {{ post, user, username }},留言时间: {{ getTime }}</li>
            <li class="title">主题: {{ post.title }}, </li>
            <li>内容: {{ post.content }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'postItem',
    data() {
        return {
        }
    },
    props: ['post'],
    computed: {
        gstTime: function() {
            let d = new Date(this.post.gstTime);
            d.setHours(d.getHours() - 8);
            return d.toLocaleString();
        }
    }
}
</script>
<style scoped>
.item {
    border-top: solid 1px grey;
    padding: 15px;
    font-size: 14px;
    color: grey;
    line-height: 21px;
}
.username {
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #009a61;
}
.title {
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #009a61;
}
ul li {
    list-style: none;
}
</style>