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

有时通过一个名称来标识路由会更方便，特别是在链路到路由，或者执行导航时。可以在创建Router实例时，在routes选项中为路由设置名称。

修改router目录下的index.js,为路由定义名字。代码如例14-16所示。

例14-16 index.js
```
...
const  router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            redirect: {
                name: 'news'
            }
        },
        {
            path: '/news',
            name: 'news',
            component: News
        },
        {
            path: '/books',
            name: 'books',
            component: Books
            children: [
                { path: '/book/:id', name: 'book', component: Book }
            ]
        },
        {
            path: '/videos',
            name: 'videos',
            component: Videos
        },
    ]
})
```
在根路径(/)的配置中，使用redirect参数将对该路径的访问重定向到命名的路由news上。当访问http://localhost:8080/时，将直接跳转到News组件。

以下是重定向的另外两种配置方式。
```
{
    path: '/',
    //指定目标路径
    redirect: '/news'
}

{
    // /search/screens ->  /search?q=screens
    path: '/search/:searchText',
    // 函数接收目标路由作为参数，动态返回重定向目标
    // 返回值可以是重定向的字符串路径或路径对象
    redirect: to => {
        return { path: '/search', query: { q: toParams.searchText } }
    },
},
```
修改App.vue,在设置导航时使用命名路由。代码如例14-17所示：

例14-17 App.vue
```
<template>
    <p>
        <router-link to="/">首页</router-link>
        <router-link :to="{ name: 'news' }">新闻</router-link>
        <router-link :to="{ name: 'books' }">图书</router-link>
        <router-link :to="{ name: 'videos' }">视频</router-link>
    </p>
    <router-view></router-view>
</template>
```
注意: to属性的值现在是表达式，因此需要使用v-bind指令。
修改Books.vue,也使用命名路由。代码如例14-18所示。

例14-18 Books.vue
```
...
<ul>
    <li v-for="book in books" :key="book.id">
        <router-link :to="{name:'book', params:{id: book.id} }">{{ book.title }}</router-link>
    </li>
</ul>
```
接下来可以再次运行项目，观察效果，测试效果和前面的例子完全一样。

在路由配置中，还可以为某个路径取个别名。例如：
```
routes: [
    { path: '/a', component: A, alias: '/b' }
]
```
"/a"的别名是"/b"，当用户访问"/b"时，URL会保持为"/b",但是路由匹配是"/a"，就像用户正在访问"/a"一样。

别名的功能可以自由地将UI解构映射到任意的URL，而不受限于配置的嵌套路由结构。

注意别名和重定向的区别，对于重定向而言，当用户访问"/a"时，URL会被替换成"/b"，然后匹配路由为"/b"。

## 14.6 命名视图

有时需要同时(同级)显示多个视图，而不是嵌套展示。例如，创建一个布局，有header（头部）、sidebar(侧边栏)和main(主内容)3个视图，这时命名视图就派上用场了。可以在界面中拥有多个单独命名的视图，而不是只有一个单独的出口。例如：
```
<router-view class="view header" name="header"></router-view>
<router-view class="view sidebar" name="sidebar"></router-view>
<router-view class="view main"></router-view>
```
没有设置名字的router-view,默认为default。

一个视图使用一个组件渲染，因此对于同一个路由，多个视图就需要多个组件。在配置路由时，使用components选项。代码如下所示：
```
const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            components: {
                default: Main,
                header: Header,
                sidebar: Sidebar,
            }
        }
    ]
})
```
可以使用带有嵌套视图的命名视图创建复杂的布局，这时是需要命名用到的嵌套router-view组件。

下面来看一个设置面板的示例，如图14-8所示。

![]

在图14-8中，Nav是一个常规组件，UserSettings是一个父视图组件，UserEmailSubscriptions、UserProfile和UserProfilePreview是嵌套的视图组件。

UserSettings组件的模板代码类似如下形式。
```
<!-- UserSettings.vue -->
<div>
    <h1>User Settings</h1>
    <NavBar/>
    <router-view/>
    <router-view name="helper" />
</div>
```
其他3个组件的模板代码如下：
```
<!-- UserEmailsSubscriptions.vue -->
<div>
    <h3>Email Subscriptions</h3>
</div>

<!-- UserProfile.vue -->
<div>
    <h3>Edit your profile</h3>
</div>

<!-- UserProfilePreview.vue -->
<div>
    <h3>Preview of your profile</h3>
</div>
```
在路由配置中按照上述布局进行配置。代码如下：
```
{
    path: '/settings',
    component: UserSettings,
    children: [
        {
            path: 'emails',
            component: UserEmailsSubscriptions
        },
        {
            path: 'profile',
            components: {
                default: UserProfile,
                helper: UserProfilePreview
            }
        }
    ]
}
```
继续我们的例子，将图书详情信息修改为与Books视图同级显示。

编辑App.vue，添加一个命名视图，代码如例14-19所示。

例14-19 App.vue
```
<div id="app"
    ...
    <router-view></router-view>
    <router-view name="bookDetail"><router-view>
</div>
```
修改router目录下的index.js文件，删除Books组件的嵌套路由配置，将Book组件路由设置为顶层路由。代码如例14-20所示。

例14-20 index.js
```
...
{
    path: '/books',
    name: 'books',
    component: Books,
},
{
    path: '/book/:id',
    name: 'book',
    component: {bookDetail: Book}
},
```
至于Books组件内的\<router-view\>,删除与否都不影响Book组件的渲染。为了代码的完整性，可以将这些无用的代码注释或删除。

运行项目，可以看到当单击一个图书链接时，图书的详细信息在Books视图同级显示了，如图14-9所示。

## 14.7 编程式导航

除了使用\<router-link\>创建\<a\>标签定义导航链接，还可以使用router的实例方法，通过编写代码来导航。

要导航到不同的URL，可以使用router实例的push()方法。router.push()方法会向history栈添加一个新的记录，所以当用户单击浏览器后退按钮时，将回到之前的URL。

当单击\<router-link\>时，router.push()方法会在内部调用，换句话说，单击\<router-link :to="..."\>等同于调用router.push(...)方法。

router.push()方法的参数可以是字符串路径，也可以是位置描述符对象。调用形式很灵活，代码如下所示：
```
//字符串路径
router.push('home')

//对象
router.push({ path: 'home' })

//命名的路由
router.push({ name: 'user', params: { userId: '123' } })

//带查询参数，结果是 /register?plah=private
router.push({ path: 'register', query: { plan: 'private' } })

//使用hash,结果是 /about#team
router.push({ path: '/about', hash: '#team' })
```
需要注意的是，如果提供了path,params会被忽略。那么对于/book/:id这种形式的路径应该如何调用router.push()方法呢？一种方法是通过命名路由，如上例第3种调用形式；一种方法是在path中提供带参数的完整路径。代码如下：
```
const id = 1;
router.push({ name: 'book', params: { id: book.id } })  //-> /book/1
router.push({ path: `/book/${id}` }) //-> /book/1
```
router.push()方法和所有其他的导航方法都返回一个Promise,允许等待知道导航完成，并知道结果是成功还是失败。

下面继续前面的例子，修改例14-18的Books.vue，用router.push()方法替换\<router-link\>。修改后的代码如例14-21所示。

例14-21 Books.vue
```
<div>
    <h3>图书列表</h3>
    <ul>
        <li v-for="book in books" :key="book.id">
            <a href="#" @click.prevent="goRoute({name:'book', params:{id:book.id} })">
            {{ book.title }}
            </a>
        </li>
    </ul>
    <router-view></router-view>
</div>

<script>
...
export default {
    ...
    methods: {
        goRoute(location) {
            //当单击的URL中的参数id与当前路由对象参数id值不同时，才调用$router.push()方法
            if(location.params.id != this.$route.params.id)
                this.$router.push(location)
        }
    }
}
</script>
```
说明：<br>
（1）在组件实例内部，可以通过this.$router访问路由器实例，进而调用this.$router.push()方法。<br>
（2）this.$router表示全局的路由器对象，包含了用于路由跳转的方法，其属性currentRoute可以获取当前路由对象；this.$route表示当前路由对象，可以获取对应的name、path、params、query等属性。

除了router.push()方法外，还可以使用router实例的replace()方法进行路由跳转。与push()方法不同的是，replace()方法不会向history添加新纪录，而是替换掉当前的history记录。

replace()方法对应的声明式路由跳转为\<router-link :to="..." replace\>。

也可以在调用push()方法时，在位置对象中指定属性replace:true。代码如下所示：
```
router.push({ path: '/home', replace: true })
// 相当于
router.replace({ path: '/home' })
```
replace()方法与push()方法用法相同，这里不再赘述。

与window.history对象的forward()、back()和go()方法对应的router实例的方法如下：
```
router.forward()
router.back()
router.go(n)
```

## 14.8 传递prop到路由组件

在组件中使用$route会导致与路由的紧密耦合,这限制了组件的灵活性,因为它只能在某些URL上使用.虽然这并不一定是坏事,但我们可以用一个props选项来解耦.代码如下所示:
```
const User = {
    template: '<div>User {{ $route.params.id }}</div>'
}
const routes = [{ path: '/user/:id', component: User }]
```
我们可以为User组件添加一个id prop,来避免硬编码$route.params.id。修改后的代码如下所示:
```
const User = {
    props: ['id'],
    template: '<div>User {{ id }}</div>'
}
const routes = [{ path: '/user/:id', component: User, props: true }]
```
在配置路由时,新增一个props选项,将它的值设置为true.当路由到User组件时,会自动获取$route.params.id的值作为User组件的id prop的值。

对于带有命名视图的路由,必须为每个命名视图定义props选项。代码如下所示:
```
const routes = [
    {
        path: '/user/:id',
        components: { default: User, sidebar: Sidebar },
        props: { default: true, sidebar: false },
    }
]
```
当props是一个对象时,它将按原样设置为组件props,这在props是静态的时候很有用。代码如下所示:
```
const routes = [
    {
        path: '/promotion/from-newsletter',
        component: Promotion,
        props: { newsletterPopup: false },
    }
]
```
也可以创建一个返回props的函数,可以将参数转换为其他类型,或者将静态值与基于路由的值相结合。代码如下所示:
```
const routes = [
    {
        path: '/search',
        component: SearchUser,
        props: route => ({ query: route.query.q }),
    }
]
```
访问URL: /search?q=vue,会将{query: 'vue'}作为prop传递给SearchUser组件。
尽量保持props函数为无状态的,以为它值在路由更改时计算。

## 14.9 HTML5 history模式

前面例子中我们使用的是hash模式,这种模式是通过调用createWebHashHistory()函数创建的,这会在URL中使用"#"标识要跳转目标的路径,如果你觉得这样URL很难看,影响心情,那么可以使用HTML5 history模式。

HTML5 history模式是通过调用createWebHistory()函数创建的。代码如下所示:
```
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...
    ],
})
```
继续前面的例子,修改router目录下index.js文件,将路由改为HTML5 history模式。代码如例14-22所示。

例14-22 index.js
```
import { createRouter, createWebHistory } from 'vue-router'
...
const router = createRouter({
    history: createWebHistory(),
    ...
})
```
再次运行项目,所有的URL都没有"#"了.

不过history模式也有一个问题,当在浏览器地址栏中直接输入URL或刷新页面时,因为该URL是正常的URL,所以浏览器会解析该URL向服务器发起请求,如果服务器没有针对该URL的响应,就会出现404错误。在HTML5 history模式下,如果是通过导航链接来路由页面,Vue Router会在内部截获单击事件,通过JavaScript操作window.history改变浏览器地址栏中的路径,在这个过程中并没有发起HTTP请求,所以就不会出现404错误。

如果使用HTML5 history模式,那么需要在前端程序部署的Web服务器上配置一个覆盖所有情况的备选资源,即当URL匹配不到任何资源时,返回一个固定的index.html页面,这个页面就是单页应用程序的主页面。

Vue Router的官网给出了一些常用的Web服务器的配置,网址如下。<br>
<a src="https://next.router.vuejs.org/guide/essentials/history-mode.html">https://next.router.vuejs.org/guide/essentials/history-mode.html</a>

如果使用Tomcat作为前端程序的Web服务器,可以在根目录下新建一个WEB-INF子目录,在其下新建一个web.xml文件。代码如下所示:
```
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="https://xmlns.jcp.org/xml/ns/javaee"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                     http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
 version="4.0>
    <error-page>
        <error-code>404</error-code>
        <location>/index.html</location>
    </error-page>
</web-app>
```
按照上述配置后,Tomcat服务器就不会再返回404错误页面,对于所有不匹配的路径就会返回index.html页面。

>提示:<br>
>在基于Vue脚手架项目的开发中,内置的Node服务器本身也支持HTML5 history模式,所以开发时一般不会出现问题。

## 14.10 导航守卫

在14.4小节中已经使用过一个组件内的导航守卫：beforeRouteUpdate。Vue Router提供的导航守卫主要用于在导航的过程中重定向或取消路由，或者添加权限验证、数据获取等业务逻辑。导航守卫分位3类：全局守卫、路由独享的守卫、组件内守卫，可以用于路由导航过程中的不同阶段。

每一个导航守卫都有2个参数：to和from，其含义已经在14.4小节中介绍过。

### 14.10.1 全局守卫

全局守卫分位全局前置守卫、全局解析守卫和全局后置钩子。

1. 全局前置守卫
当一个导航触发时，全局前置守卫按照创建的顺序调用。守卫可以是异步解析执行，此时导航在所有守卫解析完之前一直处于挂起状态。全局前置守卫使用router.beforeEach()注册。代码如下所示：
```
const router = createRouter({ ... })

router.beforeEach((to, from) => {
    // ...
    // 显示返回false以取消导航
    return false
})
```
除了返回false以取消导航外，还可以返回一个路由位置对象，这将导致路由重定向到另一个位置，如同正在调用router.push()方法一样，可以传递诸如replace:true或name:'home'之类的选项。返回路由位置对象时，将删除当前导航，并使用相同的from创建一个新的导航。

如果遇到意外情况，也可能抛开一个Error对象，这也将取消导航并调用通过router.onError()注册的任何回调。

如果没有返回任何值、undefined或true，则验证导航，并调用下一个导航守卫。

上面所有工作方式都与异步函数和Promise相同。例如：
```
router.beforeEach(async(to, from) => {
    // canUserAccess()返回true或false
    return await canUserAccess(to)
})
```
2. 全局解析守卫
全局解析守卫使用router.beforeResolve()注册。它和router.beforeEach()类似，区别在于，在导航被确认之前，在所有组件内守卫和异步路由组件被解析之后，解析守卫被调用。

下面的例子用于确保用户已经为定义了自定义meta属性requiresCamera的路由提供了对相机的访问。
```
router.beforeResolve(async to => {
    if(to.meta.requiresCamera) {
        try {
            await askForCameraPermission()
        }
        catch(error) {
            if(error instanceof NotAllowedError) {
                // ...处理错误，然后取消导航
                return false
            }
            else {
                //意外错误，取消导航并将错误传递给全局处理程序
                throw error
            }
        }
    }
})
```
3. 全局后置钩子

全局后置钩子使用router.afterEach()注册，它在导航被确认之后使用。
```
router.afterEach((to, from) => {
    sendToAnalytics(to.fullPath)
})
```
与守卫不同的是，全局后置钩子不接受可选的next()函数，也不会改变导航。

全局后置钩子对于分析、更改页面标题、可访问性功能（如发布页面）和许多其他功能都非常有用。

全局后置钩子还可以接受一个表示导航失败的failure参数，作为其第3个参数。代码如下：
```
router.afterEach((to, from, failure) => {
    if(!failure) sendToAnalytics(to.fullPath)
})
```
4. 实际应用

下面利用全局守卫来解决两个实际开发中的问题。

(1)登录验证<br>
第一个问题是登录验证。对于受保护的资源，我们需要用户登录后才能访问，如果用户没有登录，那么就将用户导航到登录页面。为此，可以利用全局前置守卫来完成用户登录与否的判断。

继续前面的例子，在components目录下新建Login.vue。代码如例14-23所示。

例14-23 Login.vue
```
<template>
    <div>
        <h3>{{ info }}</h3>
        <table>
            <caption>用户登录</caption>
            <tbody>
                <tr>
                    <td><label>用户名：</label></td>
                    <td><input type="text" v-model.trim="username"/></td>
                </tr>
                <tr>
                    <td><label>密码：</label></td>
                    <td><input type="password" v-model.trim="password"/></td>
                </tr>
                <tr>
                    <td cols="2">
                        <input type="submit" value="登录" @click.prevent="login"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            info: "",  //用于保存登录失败后的提示信息
        }
    },
    methods: {
        login() {
            //在实际场景中，这里应该通过Ajax向服务器端发起请求来验证
            if("lisi" == this.username && "1234" == this.password) {
                //sessionStorage中存储的都是字符串值，因此这里实际存储的都是字符串“true”
                sessionStorage.setItem("isAuth", ture);
                this.info = "";
                //如果存在查询参数
                if(this.$route.query.redirect) {
                    let redirect = this.$route.query.redirect;
                    //则跳转至进入登录页前的路由
                    this.$router.replace(redirect);
                }
                else {
                    //否则跳转至首页
                    this.$router.replace('/');
                }
            }
            else {
                sessionStorage.setItem("isAuth", false);
                this.username = "";
                this.password = "";
                this.info = "用户名或密码错误";
            }
        }
    }
}
</script>
```
修改路由配置文件index.js。修改后的代码如例14-24所示。

例14-24 index.js
```
...
import Login from '@/components/Login'

...
const router = createRouter({
    history: createWebHistory(),
    routes: [
        ...,
        {
            path: '/Login',
            name: 'login',
            component: Login,
        }
    ]
})

router.beforeEach(to => {
    //判断目标路由是否为/login，如果是，则直接返回true
    if(to.path == '/login') {
        return true;
    }
    else {
        //否则判断用户是否已经登录，注意这里是对字符串的判断
        if(sessionStorage.isAuth === "treu") {
            return true;
        }
        //如果用户访问的是受保护的资源，且没有登录，则跳转到登录页面
        //并将当前路由的完整路径作为查询参数传给Login组件，以便登录成功后返回先前的页面
        else {
            return {
                path: '/login',
                query: {redirect: to.fullPath}
            }
        }
    }
})

export default router
```
需要注意的是，代码中的if(to.path == '/login') {return true;}不能缺少，如果写成下面的代码，就会导致死循环。
```
router.beforeEach(to => {
    if(sessionStorage.isAuth === "true") {
        return true;
    }
    else {
        return {
            path: '/login',
            query: {redirect: to.fullPath}
        }
    }
})
```
例如，初次访问/news,此时用户还没有登录，条件判断为false，进入else语句，路由跳转到/login，然后又执行router.beforeEach()注册的全局前置守卫，条件判断依然为false，再次进入else语句，最后导致页面死掉。

为了方便访问登录页面，可以在App.vue中增加一个登录的导航链接。代码如下所示：
```
<router-link :to="{ name: 'login'}">登录</router-link>
```
完成上述修改后，运行项目。出现登录页面后，输入正确的用户名(lisi)和密码(1234),看看路由的跳转，之后输入错误的用户名和密码，再看看路由的跳转。

(2)页面标题

下面解决第2个问题，就是路由跳转后的页面标题问题。因为在单页应用程序中，实际只有一个页面，因此在页面切换时，标题不会发生改变。

在定义路由时，在routes配置中的每个路由对象（也称为路由记录）都可以使用一个meta字段来为路由对象提供一个元数据信息。我们可以为每个组件在它的路有记录里添加meta字段，在该字段中设置页面的标题，然后在全局后置钩子中设置目标路由页面的标题。全局后置钩子是在导航确认后，DOM更新前调用，因此在这个钩子中设置页面标题是比较合适的。

修改路由配置文件index.js。修改后的代码如例14-25所示。

例14-25 index.js
```
...
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: {
                name: 'news'
            }
        },
        {
            path: '/news',
            name: 'news',
            component: News,
            meta: {
                title: '新闻'
            }
        },
        {
            path: '/books',
            name: 'books',
            component: Books,
            meta: {
                title: '图书列表'
            }
        },
        {
            path: '/book/:id',
            name: 'book',
            meta: {
                title: '图书'
            },
            components: { bookDetail: Book }
        },
        {
            path: '/videos',
            name: 'videos',
            components: Videos,
            meta: {
                title: '视频'
            },
        },
        {
            path: '/login',
            name: 'login',
            component: Login,
            meta: {
                title: '登录'
            }
        },
    ]
})
...

router.afterEach(to => {
    document.title = to.meta.title;
})

export default router;
```
再次运行项目，即可看到切换页面时，每个页面都有自己的标题。

meta字段也可以用于对有限资源的保护，在需要保护的路由对象中添加一个需要验证属性，然后在全局前置守卫中进行判断，如果访问的是受保护的资源，继续判断用户是否已经登录，如果没有，则跳转到登录页面。例如：
```
{
    path: '/videos',
    name: 'videos',
    component: Videos,
    meta: {
        title: '视频',
        requiresAuth: true
    }
}
```
在全局前置守卫中进行判断。代码如下所示：
```
router.beforeEach(to => {
    //判断该路由是否需要登录权限
    if(to.matched.some(record => record.meta.requiresAuth)) {
        //路由需要验证，判断用户是否已经登录
        if(sessionStorage.isAuth === "true") {
            return true;
        }
        else {
            return {
                path: '/login',
                query: {redirect: to.fullPath}
            }
        }
    }
    else
        return true;
})
```
路由位置对象的matched属性是一个数组，包含了当前路由的所有嵌套路径片段的路由记录。

### 14.10.2 路由独享的守卫

路由独享的守卫是在路由的配置对象中直接定义的beforeEnter守卫。代码如下所示：
```
const routes = [
    {
        path: '/users/:id',
        component: UserDetails,
        beforeEnter: (to, form) => {
            //reject the navigation
            return false
        },
    },
]
```
beforeEnter守卫在全局前置守卫调用之后，只在进入路由时触发，它们不会在参数、查询参数或hash发生变化时触发。例如，从/users/2到/users/3，或者从/users/2#info到/users/2#project，均不会触发beforeEnter守卫。beforeEnter守卫只有在从不同的路由导航过来时才会触发。

也可以给beforeEnter传递一个函数数组，这在为不同的路由复用守卫时很有用。代码如下所示：
```
function removeQueryParams(to) {
    if(Object.keys(to.query).length)
        return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
    if(to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
    {
        path: '/user/:id',
        component: UserDetails,
        beforeEnter: [removeQueryParams, removeHash],
    },
    {
        path: '/about',
        component: UserDetails,
        beforeEnter: [removeQueryParams],
    },
]
```

### 14.10.3 组件内守卫

在14.4小节中使用的beforeRouteUpdate守卫就是组件内守卫。除此之外，还有两个组件内守卫：beforeRouteEnter和beforeRouteLeave。
```
const UserDetails = {
    template: '...',
    beforeRouteEnter(to, from) {
        //在渲染该组件的路由被确认之前调用
        //不能通过this访问组件实例，因为在守卫执行前，组件实例还没有被创建
    },
    beforeRouteUpdate(to, from) {
        //在渲染该组件的路由改变，但是在该组件被复用时调用
        //例如，对于一个带参数的路由 /users/:id，在/users/1和/users/2之间跳转时
        //相同的UserDetails组件实例将会被复用，而这个守卫就会在这种情况下被调用
        //可以访问组件实例的this
    },
    beforeRouteLeave(to, from) {
        //导航即将离开该组件的路由时调用
        //可以访问组件实例的this
    }
}
```
beforeRouteEnter守卫不能访问this,因为该守卫是在导航确认前被调用，这时新进入的组件甚至还没有创建。

但是，我们可以通过向可选的next()函数参数传递一个回调来访问实例，组件实例将作为参数传递给回调。当导航确认后会执行回调，而这个时候，组件实例已经创建完成。代码如下所示：
```
beforeRouteEnter(to, from, next) {
    next(vm => {
        //通过vm访问组件实例
    })
}
```
需要注意的是，beforeRouteEnter是唯一支持将回调传递给next()函数的导航守卫。对于beforeRouteUpdate和beforeRouteLeave，由于this已经可用，因此不需要传递回调，自然也就没必要支持向next()函数传递回调了。

下面利用beforeRouteEnter的这个机制，修改例14-15，将created钩子用beforeRouteEnter守卫替换。代码如例14-26所示。

例14-26 Book.vue
```
...
<script>
import Books from '@/assets/books'
export default {
    data() {
        return {
            books: {}
        }
    },
    methods: {
        setBook(book) {
            this.book = book;
        }
    },

    beforeRouteEnter(to, from, next) {
        let book = Books.find((item) => item.id == to.params.id);
        next(vm => vm.setBook(book));
    },
    beforeRouterUpdate(to) {
        this.book = null;
        this.book = Books.find((item) => item.id == to.params.id);
    }
}
</script>
```
beforeRouteLeave守卫通常用来防止用户在还没保存修改前突然离开，可以通过返回false取消导航。代码如下：
```
beforeRouteLeave(to, from) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if(!answer) return false
}
```

### 14.10.4 导航解析过程

完整的导航解析流程如下。

(1)导航被触发。<br>
(2)在失活的组件中调用beforeRouteLeave守卫。<br>
(3)调用全局的beforeEach守卫。<br>
(4)在复用的组件中调用beforeRouteUpdate守卫。<br>
(5)调用路由配置中的beforeEnter守卫。<br>
(6)解析异步路由组件。<br>
(7)在被激活的组件中调用beforeRouteEnter守卫。<br>
(8)调用全局的beforeResolve守卫。<br>
(9)导航被确认。<br>
(10)调用全局的afterEach钩子。<br>
(11)触发DOM更新。<br>
(12)用创建好的实例调用beforeRouteEnter守卫中传给next()函数的回调函数。

读者可以在例14-1的route.html页面内添加所有的导航守卫，利用console.log(...)语句输出守卫信息，然后观察一下各个守卫调用的顺序，就能更好地理解守卫调用的时机。

## 14.11 数据获取等业务逻辑

当路由被激活时，我们往往需要从服务器端获取数据，以便能够正确地渲染组件。数据的获取有两种方式，具体使用哪一种取决于应用场景和用户体验。
+ 导航后获取：首先执行导航，然后在导航进入的组件的生命周期钩子中获取数据。在获取数据时显示加载状态。
+ 导航前获取：在beforeRouteEnter中获取数据，数据获取后再进行导航。

1. 导航后获取

使用这种方式，可以立即导航和渲染进入的组件，并在组件的created钩子中获取数据。它使我们有机会在通过网络获取数据时显示加载状态，而且还可以为每个视图处理不同的加载。

假设有一个Post组件，它需要根据$route.params.id来获取Post组件的数据。代码如下所示：
```
<template>
    <div class="post">
        <div v-if="loading" class="loading">Loading...<div>
        <div v-if="error" class="error">{{ error }}</div>
        <div v-if="post" class="content">
            <h2>{{ post.title }}</h2>
            <p>{{ post.body }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loading: false,
            post: null,
            error: null,
        }
    },
    created() {
        //监听路由的参数以再次获取数据
        this.$watch(
            () => this.$route.params,
            () => {
                this.fetchData()
            },
            //当组件渲染的时候立即获取数据
            { immediate: true }
        )
    },
    methods: {
        fetchData() {
            this.error = this.post = null
            this.loading = true

            getPost(this.$route.params.id, (err, post) => {
                this.loading = false
                if(err) {
                    this.error = err.toString()
                }
                else {
                    this.post = post
                }
            })
        },
    },
}
</script>
```
2. 导航前获取

使用这种方式是在导航到新路由之前获取数据。我们可以在组件内守卫beforeRouteEnter中执行数据获取，并只在数据获取完成后调用next()函数。代码如下所示：
```
export default {
    data() {
        return {
            post: null,
            error: null,
        }
    },
    beforeRouteEnter(to, from, next) {
        getPost(to.params.id, (err, post) => {
            next(vm => vm.setData(err, post))
        })
    },

    async beforeRouterUpdate(to, from) {
        this.post = null
        try {
            this.post = await getPost(to.params.id)
        }
        catch(err) {
            this.error = error.toString()
        }
    },
}
```
在为进入的视图获取资源时，用户将停留在上一个视图中。因此，建议在获取数据时显示进度条或某种指示器。如果数据获取失败，则需要显示某种全局警告消息。

## 14.12 Vue Router与组合API

Vue 3.0引入了setup()函数和组合API，Vue Router自然也要紧跟其后，给出相应的组合API函数。

### 14.12.1 在setup()函数中访问Router和当前路由

在setup()函数中是不能访问this的，自然也就不能通过this.$router和this.$route访问路由器对象和当前路由对象。Vue Router公开了两个组合API函数：useRouter()和useRoute()，可以分别得到路由器对象和当前路由对象。代码如下所示：
```
import { useRouter, userRoute } from 'vue-router'

export default {
    setup() {
        const router = useRouter()
        const route = userRoute()

        function pushWithQuery(query) {
            router.push({
                name: 'search',
                query: {
                    ...route.query,
                },
            })
        }
    },
}
```
route对象是一个响应式对象，所以它的任何属性都可以被监听，但我们要避免去监听整个route对象。代码如下所示：
```
export default {
    setup() {
        const route = useRoute()
        const userData = ref()

        //当参数更改时获取用户信息
        watch(
            () => route.params,
            async newParams => {
                userData.value = await fetchUser(newParams.id)
            }
        )
    },
}
```
需要注意的是，虽然使用了组合API函数，但是在模板中仍然是可以访问$router和$route的，因此不需要在setup()函数中返回router或route对象。

### 14.12.2 导航守卫

虽然组件内导航守卫可以和setup()函数一起用，不过Vue Router也将beforeRouteUpdate和beforeRouteLeave两个守卫公开为组合API函数。代码如下所示：
```
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

export default {
    setup() {
        //与beforeRouteLeave选项相同，但不能访问this
        onBeforeRouteLeave((to, from) => {
            const answer = window.ocnfirm(
                'Do you really want to leave? you have unsaved changes!'
            )
            //取消导航并保持在同一个页面上
            if(!answer) return false
        })

        const userData = ref()
        //与beforeRouteUpdate选项相同，但不能访问this
        onBeforeRouteUpdate(async(to, from) => {
            //只有当id发生变化时才获取用户，因为可能只有查询参数或hash发生了变化
            if(to.params.id !== from.params.id) {
                userData.value = await fetchUser(to.params.id)
            }
        })
    },
}
```
组合API守卫也可以用于\<router-view\>渲染的任何组件中，它们不必像组件内守卫那样直接在路由组件上使用。

### 14.12.3 useLink

Vue Router将RouterLink的内部行为作为一个组合API函数公开，它提供了与v-slot API相同的访问属性。代码如下所示：
```
import { RouterLink, useLink } from 'vue-router'

export default {
    name: 'AppLink',

    props: {
        ...RouterLink.props,
        inactiveClass: String,
    },
    setup(props) {
        const { route, href, inActive, isExactActive, navigate } = useLink(props)

        const isExternalLink = computed(
            () => typeof props.to === 'string' && props.to.startsWith('http')
        )

        return { isExternalLink, href, navigate, isActive }
    },
}
```

## 14.13 滚动行为

如果某个页面较大，在浏览时通过滚动条已经滚动到某个位置，当路由视图切换时，想要新页面回到顶部，或者保持在原位置，在这种情况下，则可以为Vue Router实例提供一个scrollBehavior()函数，在该函数内返回一个滚动位置对象，指定新页面的滚动位置。代码如下所示：
```
const router = createRouter({
    history: createWebHashHistory(),
    routes: [...],
    scrollBehavior(to, from, savedPosition) {
        //return 期望滚动到哪个位置
    }
})
```
scrollBehavior()函数接收to和from路由对象，第3个参数savedPosition仅在popstate导航（由浏览器的前进/后退按钮触发）时才可用。

scrollBehavior()函数可以返回一个ScrollToOptions位置对象，该对象的两个位置属性是top和left，top指定沿Y轴滚动窗口或元素的像素数，left指定沿X轴滚动窗口或元素的像素数。

对于所有路由导航，如果都是让页面滚动到顶部，则可以按以下方式调用：
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        //始终滚动到顶部
        return { top: 0 }
    },
})
```
还可以通过el属性传递CSS选择器或者DOM元素，在这种情况下，顶部和左侧将被视为相对于该元素的相对偏移量。代码如下所示：
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        //始终在#main元素上方滚动10px
        return {
            //也可以是位置描述符对象
            //el: document.getElementById('main'),
            el: '#main',
            top: -10,
        }
    },
})
```
如果返回一个计算为false的值，或者有一个空对象，那么不会发生滚动行为。

当使用后退/前进按钮导航时，返回savedPosition将获得类似浏览器的原生行为。
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        if(savedPosition) {
            return savedPosition
        }
        else {
            return { top: 0 }
        }
    },
})
```
如果要模拟“滚动到锚点”的行为，则可以按以下方式调用：
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        if(to.hash) {
            return {
                el: to.hash,
            }
        }
    },
})
```
如果浏览器支持滚动行为，则可以使其平滑地滚动。代码如下所示：
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        if(to.hash) {
            return {
                el: to.hash
                behavior: 'smooth',
            }
        }
    }
})
```
有事在滚动页面之前，我们需要等待一段时间。例如，在处理转换时，我们希望在滚动之前等待转换完成。为此，可以返回一个Promise，它返回所需的位置描述符。下面是一个在滚动前等待500ms的示例：
```
const router = createRouter({
    scrollBehavior(to, from, savedPosition) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({ left: 0, top: 0 })
            }, 500)
        })
    },
})
```
>提示：<br>
>scrollBehavior()方法实现的功能只在支持history.pushState的浏览器中使用。

## 14.14 延迟加载路由

当应用变得复杂后，路由组件也会增多，而Webpack的打包机制会将应用程序中所有JavaScript打包成一个文件（除public目录下的js文件），这个文件可能相当大，影响页面的加载效率。如果可以将每个路由的组件分割成单独的块，并且只在访问路由时加载它们，那么效率会更高。

Vue Router本身支持动态导入，因此我们可以将静态导入替换为动态导入。代码如下所示：
```
//将import UserDetails from './views/UserDetails'
//替换为
const UserDetails = () => import('./views/UserDetails')

const router = createRouter({
    //...
    routes: [{ path: '/users/:id', component: UserDetails }],
})
```
component和components选项接收一个返回组件Promise的函数，Vue Router只在第一次进入页面时获取它，然后使用缓存版本。这意味着我们也可以拥有更复杂的函数，只要它们返回一个Promise。代码如下所示：
```
const UserDetails = () =>
    Promise.resolve({
        /* 组件定义 */
    })
```