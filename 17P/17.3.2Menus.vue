<!-- 17.3.2菜单组件Menus.vue -->

<template>
    <div class="menus">
        <ul>
            <li>
                <router-link to="/home">首页</router-link>
            </li>
            <li>
                <router-link to="newBooks">新书</router-link>
            </li>
            <li>
                <a href="javascript:;">特价书</a>
            </li>
            <li>
                <a href="javascript:;">教材</a>
            </li>
            <li>
                <a href="javascript:;">视听教材</a>
            </li>
        </ul>
    </div>
</template>

<script>

export default {
    name: "Menus",
};
</script>