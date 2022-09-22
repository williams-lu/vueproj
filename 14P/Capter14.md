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