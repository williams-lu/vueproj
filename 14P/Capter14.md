# 第14章 使用Vue Router开发单页应用

传统的Web应用程序不同页面的跳转都是向服务器发起请求，服务器处理请求后向浏览器推送页面。在单页应用程序中，不同视图（组件的模板）的内容都是在同一个页面渲染，页面的跳转都是在浏览器端完成，这就需要用到前端路由。在Vue.js中，可以使用官方的路由管理器Vue Router。

## 14.1 感受前端路由

Vue Router需要单独下载，可以参考2.1.1小节介绍的CDN方式引入Vue Router。
```
<script src="https://unpkg.com/vue-router@next"></script>
```
如果使用模块化开发，则使用npm安装方式，执行以下命令安装Vue Router。
```
npm install vue-router@next --save
```
>提示：<br>
>注意安装Vue Router时，要安装支持Vue3.0的新版本Vue Router，即这里的vue-router@next。支持Vue2.x的Vue Router版本名是vue-router。

### 14.1.1 HTML页面使用路由

前端路由的配置有固定的步骤。
（1）使用router-link组件设置导航链接。代码如下：
```
<router-link to="/">主页</router-link>
<router-link to="/news">新闻</router-link>
<router-link to="/books">图书</router-link>
<router-link to="/videos">视频</router-link>
```
to属性指定链接的URL，\<router-link\>默认会被渲染为一个\<a\>标签，如下图：

![]

>提示：<br>
>可以使用v-slot API完全定制\<router-link\>。例如,将\<router-link\>渲染为span标签。代码如下所示：<br>
>\<router-link to="/videos" custom v-slot="{ navigate }"\><br>
><span @click="navigate" @keypress.enter="navigate"\>视频\</span\><br>
>\</router-link\>

（2）指定组件在何处渲染，这是通过\<router-view\>指定的。代码如下所示：
```
<router-view></router-view>
```
单击链接的时候，会在\<router-link\>所在的位置渲染组件的模板内容。可以把\<router-view\>理解为占位符。

（3）定义路由组件。代码如下所示：
```
const Home = { template: '<div>主页面</div>' }
const News = { template: '<div>新书页面</div>' }
const Books = { template: '<div>图书页面</div>' }
const Videos = { template: '<div>视频页面</div>' }
```
这里只是为了演示前端路由的基本用法，所以组件定义很简单。

（4）定义路由，将第（1）步设置的链接URL和组件对应起来。代码如下：
```
const routes = [
    { path: '/', component: Home },
    { path: '/news', component: News },
    { path: '/books', component: Books },
    { path: '/videos', component: Videos },
]
```

（5）创建VueRouter实例，将第（4）步定义的路由配置作为选项传递进去。代码如下所示：
```
const router = VueRouter.createRouter({
    //提供要使用的history实现。为了简单起见，在这里使用hash history
    history: VueRouter.createWebHashHistory(),
    routes //简写，相当于 routes: routes
})

（6）调用应用程序实例的use()方法，传入第（5）步创建的router对象，从而让整个应用程序具备路由功能。
```
const app = Vue.createApp({})
//使用路由器实例，从而让整个应用都有路由功能
app.use(router)
app.mount('#app')
```
至此，整个前端路由的配置就完成了。
完整代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>14.1.1 HTML页面使用路由</title>
</head>
<body>
    <div id="app">
        <p>
            <!-- 使用router-link组件导航 -->
            <!-- 通过传入to属性指定链接 -->
            <!-- <router-link>默认会被渲染成一个<a>标签 -->
            <router-link to="/">主页</router-link>
            <router-link to="/news">新闻</router-link>
            <router-link to="/books">图书</router-link>
            <router-link to="/videos">视频</router-link>
        </p>
        <!-- 路由出口 -->
        <router-view></router-view>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script src="https://unpkg.com/vue-router@next"></script>
    <script>
        //定义路由组件
        //可以从其他文件import进来
        const Home = { template: '<div>主页面</div>' }
        const News = { template: '<div>新书页面</div>' }
        const Books = { template: '<div>图书页面</div>' }
        const Videos = { template: '<div>视频页面</div>' }

        //定义路由
        //每个路由应该映射到每一个组件
        const routes = [
            { path: '/', component: Home },
            { path: '/news', component: News },
            { path: '/books', component: Books },
            { path: '/videos', component: Videos },
        ]

        //传递routes选项，创建router实例
        const router = VueRouter.createRouter({
            //提供要使用的history实现。简单起见，在这里使用hash history
            history: VueRouter.createWebHashHistory(),
            routes // (简写)相当于routes: routes
        })

        const app = Vue.createApp({})
        //使用路由器实例，从而让整个应用都有路由功能
        app.use(router);
        app.mount('#app');
    </script>
</body>
</html>
```
创建router实例时，为选项history指定的是VueRouter.createWebHashHistory(), 也就是hash模式，即使用URL的hash（即URL中的锚部分，从“#”开始的部分）模拟完整的URL,以便在URL更改时不会重新加载页面。

### 14.1.2 模块化开发使用路由

模块化开发使用前端路由也是遵照14.1.1小节介绍的各个步骤，只是形式上有些变化。先利用Vue CLI创建一个Vue 3.0的脚手架项目，项目名为myroute，直接选择Default(Vue 3 Preview)([Vue 3]babel, eslint),开始项目创建。项目创建成功后启动vscode打开项目所在目录，接下来按照以下步骤开始前端路由的配置。

(1)为项目安装vue-router。选择【终端】-【新终端】选项，在弹出的终端窗口输入以下命令：
```
npm install vue-router@next --save
```
(2)在App.vue中设置导航链接和组件渲染的位置。修改其模板内容，并将引用HelloWorld组件的地方删除。修改后的代码如下所示。

App.vue
```
<template>
    <p>
        <router-link to="/">主页</router-link>
        <router-link to="/news">新闻</router-link>
        <router-link to="/books">图书</router-link>
        <router-link to="/videos">视频</router-link>
    </p>
    <router-view></router-view>
</template>

<script>
export default {
    name: 'App',
    components: {
    }
}
</script>
...
```
(3)定义路由组件。在components目录下新建Home.vue、News.vue、Books.vue和Videos.vue四个文件。代码如下：

Home、News、Books和Videos组件的代码

<center>Home.vue</center>

```
<template>
    <div>主页面</div>
</template>

<script>
export default {
}
</script>
```
<center>News.vue</center>

```
<template>
    <div>新闻页面</div>
</template>

<script>
export default {
}
</script>
```
<center>Books.vue</center>

```
<template>
    <div>图书页面</div>
</template>

<script>
export default {
}
</script>
```
<center>Videos.vue</center>

```
<template>
    <div>视频页面</div>
</template>

<script>
export default {
}
</script>
```
(4)单独定义一个模块文件，配置路由信息，这也是项目中经常使用的方式。在src目录下新建一个router目录，在该目录下新建一个index.js文件。编辑该文件，代码如下：
```
//导入createRouter和createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router'
import Home form '@/components/Home'
import News form '@/components/News'
import Books form '@/components/Books'
import Videos form '@/components/Videos'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/news',
            component: News,
        },
        {
            path: '/books',
            component: Books,
        },
        {
            path: '/videos',
            component: Videos,
        },
    ]
})
```
(5)在程序入口main.js文件中，使用router实例让整个应用都有路由功能。代码如下：
```
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```
在基于Vue.js的项目开发中，如果要导入一个目录中的index.js文件，可以直接导入该目录，内置的webpack会自动导入index.js文件。

至此，前端路由就已经配置完毕。打开终端，输入npm run serve命令，体验单页应用的前端路由。

## 14.2 动态路由匹配

实际项目开发时，经常需要把匹配某种模式的路由映射到同一个组件。例如有一个Book组件，对于所有ID各不相同的图书，都使用这个组件来渲染，这可以使用路径中的动态段(dynamicsetment)来实现，称为参数(param)。参数使用冒号(:)表示，如/book/:id,即/book/1、/book/2和/book/foo都映射到相同的路由。当匹配一个路由时，参数的值将被保存到this.$route.params(this.$route代表当前路由对象)中，可以在组件内使用。

继续14.1.2小节项目，修改App.vue,使用\<router-link\>组件添加两个导航链接。代码如下：

App.vue
```
<template>
    <p>
        ...
        <router-link to="/book/1">图书1</router-link>
        <router-link to="/book/2">图书2</router-link>
    </p>
    <router-view></router-view>
</template>
...
```
在components目录下新建Book.vue文件。代码如下：
```
<template>
    <div>图书ID：{{ $route.params.id }}</div>
</template>

<script>
export default {
}
</script>
```
接下来编辑router目录下的index.js文件，导入Book组件，并添加动态路径/book/:id的路由配置。代码如下：
```
...
import Book from '@/components/Book'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...,
        {
            path: '/book/:id',
            component: Book,
        }
    ]
})
```
在终端窗口中执行npm run serve命令，运行项目，打开浏览器，出现图书1和图书2链接，单击其中任意一个。

在一个路由中可以有多个参数，它们将映射到$route.params中的相应字段，

在同一路由中可以有多个动态段实例

模式 | 匹配路径 | $route.params中的相应字段
----------|-----------|---------------|
/user/:username | /user/evan | { username:'evan' } |
/user/:username/post/:post_id | /user/evan/post/123 | { username:'evan', post_id: '123' } |

除了$route.params外，$route对象还提供了其他有用信息，如$route.query（如果URL中有查询参数）、$route.hash等。

### 14.2.1 查询参数

URL中带有参数的形式为/book?id=1,这在传统的Web应用程序中很常见，根据查询参数向服务端请求数据。在单页应用程序开发中，也支持路径中的查询参数。修改App.vue,代码如下：
```
<template>
    <p>
        ...
        <router-link to="/book?id=1">图书1</router-link>
        <router-link to="/book?id=2">图书2</router-link>
    </p>
    <router-view></router-view>
</template>
...
```
修改Book.vue,代码如下：
```
<template>
    <div>图书ID：{{ $route.query.id }}</div>
</template>
...
```
修改index.js，代码如下：
```
...
const router = createRouter({
    ...
    routes: [
        ...
        {
            path: '/book',
            component: Book,
        }
    ]
})
```
运行项目即可。

## 14.3 路由匹配语法

大多数应用程序使用静态路由（如/news)和动态路由（如/book/1）就可以满足应用的需求，不过Vue Router也提供了更加强大的参数匹配能力。要匹配任何内容，可以使用自定义参数正则表达式，方法是在参数后面的圆括号中使用正则表达式。

### 14.3.1 参数中的自定义正则表达式

当定义一个如":id"的参数时，Vue Router在内部使用正则表达式"([^/]+)"(至少有一个不是斜杠/的字符)从URL中提取参数。假设有两个路由/:orderId和/:productName，它们将匹配完全相同的URL，想要区分它们，最简单的方法是在路径中添加一个静态部分来区分。代码如下：
```
const routes = [
    //匹配 /o/3549
    { path: '/o/:orderId' },
    //匹配 /p/books
    { path: '/p/:productName' },
]
```
假如要限定orderId只能是数字，而productName可以是任何值，那么可以在参数orderId后的圆括号中使用正则表达式来说明。代码如下：
```
const routes = [
    //匹配 /:orderId只能匹配数字
    { path: '/o/:orderId(\\d+)' },
    //匹配 /:productName匹配任何值
    { path: '/p/:productName' },
]
```
### 14.3.2 可重复参数