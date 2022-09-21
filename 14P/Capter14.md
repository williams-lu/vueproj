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

可以使用修饰符"*"(零个或多个)、"+"(一个或多个)将参数标记为可重复的。代码如下所示：
```
const routes = [
    // /:chapters -> 匹配 /one, /one/two, /one/two/three, etc
    { path: '/:chapters+' },
    // /:chapters -> 匹配 /, /one, /one/two, /one/two/three, etc
    { path: '/:chapters*' },
]
```
这将给出一个params数组而不是字符串，并且在使用命名路由(参看4.5小节)时也需要传递一个数组。代码如下：
```
// given { path: '/:chapters*', name: 'chapters' },
router.resolve({ name: 'chapters', params: { chapters: [] } }).href
// 结果：/
router.resolve({ name: 'chapters', params: { chapters: ['a', 'b'] } }).href
// 结果： /a/b

// given { path: '/:chapters+', name: 'chapters' },
router.resolve({ name: 'chapters+', params: { chapters: [] } }).href
// 因为chapters是空，这将抛出一个错误
```
还可以通过将"*"和"+"添加到有括号后，与自定义正则表达式结合使用。
```
const routes = [
    // 只匹配数字
    { path: '/:chapters(\\d+)+' },
    { path: '/:chapters(\\d+)*' },
]
```

### 14.3.3 可选参数

还可以使用"?"将参数标记为可选的。代码如下：
```
const routes = [
    // 匹配 /users 和 /users/posva
    { path: '/users/:userId?' },
    // 匹配 /users 和 /users/42
    { path: '/users/:userId(\\d+)?' },
]
```

## 14.4 嵌套路由

在实际的应用场景中，一个界面UI通常由多层嵌套的组件组合而成，URL中的各段也按某种结构对应嵌套的各层组件，

路径user/:id映射到User组件，根据ID的不同，显示不同的用户信息。ID为1的用户单击链接user/1/profile,将在用户1的视图中渲染Profile组件；单击链接user/1/posts，将在用户1的视图中渲染Posts组件。

继续14.2小节的例子(将例子恢复为动态段)，当单击“图书”链接时，以列表形式显示所有图书的书名，进一步单击单个书名链接，在Books视图中显示图书的详细信息。这可以通过嵌套路由来实现。

在assets目录下新建一个books.js文件，里面是图书数据。代码如下：

book.js
```
export default [
    { id: 1, title: 'vue教程', desc: '学Vue' },
    { id: 2, title: 'V++教程', desc: '畅销书' },
    { id: 3, title: 'Servlet/JSP教程', desc: '经典JSP' },
]
```
这里硬编码了图书数据，只是为了演示需要，真实场景中，图书数据应该是通过Ajax请求从服务器端加载得到。

修改Books.vue，以列表方式显示图书馆，添加导航链接，并使用\<router-view\>指定Book组件渲染的位置。代码如下：
```
<template>
    <div>
        <h3>图书列表</h3>
        <ul>
            <li v-for="book in books" :key="book.id">
                <router-link :to="'/book/'+book.id">{{ book.title }}</router-link>
            </li>
        </ul>
        <!-- Book组件在这里渲染 -->
        <router-view></router-view>
    </div>
</template>

<script>
//导入Books数组
import Books from '@/assets/books'
export default {
    data() {
        return {
            books: Books
        }
    }
}
</script>
```

记得删除App.vue中图书1和图书2的\<router-link\>的配置。

修改router目录下的index.js文件，增加嵌套路由的配置并删除index.js的部分配置。代码如下

index.js
```
...
import Book from '@/components/Book'
...
const router = createRouter({
    routes: [
        ...,
        {
            path: '/books',
            component: Books,
            children: [
                { path: '/book/:id', component: Book }
            ]
        },
        ...
    ]
})
```
说明：
(1)要在嵌套的出口（即Books组件中的\<router-view\>）中渲染组件，需要在routes选项的配置中使用children选项。children选项只是路由配置对象的另一个数组，如同routes本身一样，因此，可以根据需要继续嵌套路由。
(2)以"/"开头的嵌套路径被视为根路径。如果上例Books.vue中的导航链接设置的是/books/book/id这种形式，那么这里配置路径时，需要去掉"/"，即{path:'book/:id', component: Book}。

在终端窗口中运行项目，打开浏览器，单击“图书”链接后，任选一本图书。

在实际场景中，当单击某本图书链接时，应该向服务器端发起Ajax请求来获取图书详细数据，于是我们想到在Book组件中通过声明周期钩子函数来实现，然而，这行不通。因为当两个路由都渲染同一个组件时，如同book/1导航到book/2时，Vue会复用先前的Book实例，比起销毁旧实例再创建新实例，复用会更加高效。但是这就意味着组件的生命周期钩子不会再被调用，所以也就无法在声明周期钩子中去根据路由参数的变化更新数据。

要对同一组件中的路由参数更改做出响应，只需监听$route.parems即可。

修改Book.vue，当路由参数变化时，更新图书详细数据。代码如下：

例14.15Book.vue
```
<template>
    <div>
        <p>图书ID：{{ book.id }}</p>
        <p>书名： {{ book.title }}</p>
        <p>说明： {{ book.desc }}</p>
    </div>
</template>

<script>
import Books from '@/assets/books'
export default {
    data() {
        return {
            book: {}
        }
    },
    created() {
        this.book = Books.find((item) => item.id == this.$route.params.id);

        this.$watch(
            () => this.$route.params,
            (toParams) => {
                console.log(toParams)
                this.book = Books.find((item) => item.id == toParams.id);
            }
        )
    }
}
</script>
```
说明：
（1）只有路由参数发生变化时，$route.params的监听器才会被调用，这意味着第一次渲染Book组件时，通过$route.params的监听器是得不到数据的，因此在created钩子中先获取第一次渲染时的数据。当然，也可以向$watch方法传入一个选项对象作为第3个参数，设置immediate选项参数为true,使监听器回调函数在监听开始后立即执行，即不需要在created钩子中先获取一次数据。代码如下：
```
created() {
    //this.book = Books.find((item) => item.id == this.$route.params.id);
    this.$watch(
        () => this.$route.params,
        (toParams) => {
            this.book = Books.find((item) => item.id == toParams);
        },
        {
            immediate: true
        }

    )
}
```
（2）$route.params监听器回调函数的toParams参数表示即将进入的目标路由的参数，该函数还可以带一个previousParams参数，表示当前导航正要离开的路由的参数。

运行项目，单击不同的图书链接将显示对应图书的详细信息。除了监听$route对象外，还可以利用Vue Router中的导航守卫(navigation guard):beforeRouterUpdate,可以把它理解为时针路由的一个钩子函数。修改例14.15,删除$route.params的监听器，改用beforeRouteUpdate来实现。代码如下所示：
```
beforeRouterUpdate(to) {
    this.book = null;
    this.book = Books.find((item) => item.id == to.params.id);
}
```
beforeRouterUpdate在当前路由改变，但是该组件被复用时调用。它有两个常用的参数。to表示即将进入的目标路由位置对象；from表示当前导航正要离开的路由位置对象。本来只用到了参数to。

## 14.5 命令路由