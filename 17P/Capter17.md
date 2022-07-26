# 第17章 网上商城项目

本章将结合前面所学知识，开发一个网上商城项目。

## 17.1 脚手架项目搭建

选择好项目存放的目录，使用Vue CLI创建一个脚手架项目，项目名为bookstore。

打开命令提示符窗口，输入下面的命令开始创建脚手架。

```
vue create bookstore
```
选择Manually select features，按照图17-1所示选中所需的功能，选择Vue3.x版本，然后选择为路由使用history模式，如图17-2所示。

接下来，选择ESLint with error prevention only，之后连续按Enter键即可。

可以看到路由(router/index.js)和Vuex状态管理(store/index.js)的目录结构已经生成，在main.js也将router和Store全都导入和注册。main.js的代码如下所示：
```
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')
```
项目结构中还有一个views文件夹，在这个文件夹下存放页面级组件，如项目自带的Home组件。一般的小组件存放在components目录下，这些组件可以被复用，通常views组件不会别复用。

## 17.2 安装和配置axios

本项目采用官网推荐的axios访问服务器接口提供的数据。使用VScode打开项目目录，然后打开终端窗口，执行下面命令来安装axios和vue-axios插件。
```
npm install axios vue-axios -S
```
编辑项目的main.js文件，引入axios。代码如下所示：
```
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

createApp(App).use(store).use(router).use(VueAxios, axios).mount('#app')
```
本项目是一个前端项目，与后端提供数据的服务器端是分离的，分别部署在不同的服务器上，因此请求后台数据会涉及一个跨域访问的问题。为此，需要配置一个反向代理来解决这个问题，将请求转发给真正提供数据的后台服务器。

在项目的根目录下（注意是项目根目录，不是src目录）新建一个名为vue.config.js的文件，该文件是Vue脚手架项目的配置文件，在这个配置文件中设置反向代理。代码如例17-1所示。

例17-1 vue.config.js
```
module.exports = {
    devServer: {
        proxy: {
            //  /api是后端数据接口的上下文路径
            '/api': {
                //这里的地址是后面数据接口的地址
                target: 'http://111.229.37.167/',
                //允许跨域
                changeOrigin: true,
            }
        }
    }
}
```
接下来，在main.js文件中为axios配置全局的baseURL默认值。代码如下所示：
```
axios.defaults.baseURL = "/api"
```
经过上述配置后，不管前端项目所在的服务器IP和端口是多少，对/book/new发起的请求都会被自动代理为对http://111.229.37.167/api/book/new发起请求。

在本章后续内容中，将提供数据接口的后台服务器称为服务端，而本项目称为前端。

## 17.3 首页

前端页面的开发首先要做原型设计，最简单的原型设计就是画草图。本项目网上商城首页的布局如图17-4所示。


从图17-4中可以看到，本项目的首页大致可以分为6个部分，当然这已经是经过简化的商城首页了。划分出首页的每一部分，便于我们设计组件。粗略来看，至少需要7个组件（加首页组件本身），接下来就需要根据各部分的复杂程度、实现的功能是否可复用等因素去综合考量，最终确定组件的设计。

下图按照图17-4中的6个部分分别介绍其中组件的实现，以及涉及的知识点。

### 17.3.1 页面头部组件

考虑到搜索框与购物车可能会在多个地方被复用，因此决定将这两部分单独剥离出来，设计成两个组件，然后编写一个Header组件，将搜索框与购物车组件作为子组件在其内部调用。

**1. 头部搜索框组件**
在components目录下新建HeaderSearch.vue，代码如例17-2所示。

例17-2 HeaderSearch.vue
```
<template>
    <div class="headerSearch">
        <input type="search" v-model.trim="keyword">
        <button @click="search">搜索</button>
    </div>
</template>

<script>
export default {
    name: 'HeaderSearch',
    data() {
        return {
            keyword: ''
        };
    },
    methods: {
        search() {
            //当查询关键字与当前路由对象中的查询参数wd值不同时，才调用$router.push()方法
            if(this.keyword != this.$route.query.wd)
                this.$router.push({path: '/search', query: { wd: this.keyword }})
        }
    },
}
</script>
```
说明：<br>
(1)本项目的头部组件(Header组件)在所有页面中都存在，搜索框暂时未有在其他组件中使用，在Vue的单文件组件开发中，建议与父组件紧密耦合的子组件以父组件前缀命名，因此搜索框组件的名字在这里是HeaderSearch。采用这种命名约定的好处是父子组件的关系一目了然，而在IDE中，通常也是按照字母顺序来组织文件，这样相关联的文件自然就排在了一起，便于快速定位和编辑。另一个方式是在以父组件命名的目录中编写子组件，但这种方式会导致许多文件的名字相同，使得再IDE中快速切换文件变得困难。此外，过多的嵌套子目录也增加了在IDE侧边栏中浏览组件所用的时间。当然，万事都不是绝对的，当项目非常复杂，组件数非常多(如100+组件)
的情况下，采用合理的目录结构管理组件可能更加适合。本章后面的组件名也会采用与HeaderSearch相同的命名约定，就不在重复说明了。

(2)当单击“搜索”按钮时，将输入框中的内容作为查询参数附加在"/search"后面，然后跳转到搜索页面。同时为了避免用户使用相同的关键字查询，在这里做一个判断。

(3)为了节省篇幅，本章所有的实例代码都将省略CSS样式规则。

**2. 头部购物车组件**

在components目录下新建HeaderCart.vue，代码如例17-3所示。

例17-3 HeaderCart.vue
```
<template>
    <div class="headerCart">
        <a href="javascript:;" @click.prevent="handleCart">
            <span>购物车{{ cartItemsCount }}</span>
        </a>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'HeaderCart',
    components: {},
    computed: {
        //cart模块带有命名空间
        ...mapGetters('cart', {
            //Vuex的store中定义的一个getter，得到购物车中商品的数量
            //将this.cartItemsCount映射为this.$store.getters['cart/itemsCount']
            cartItemsCount: 'itemsCount'
        })
    },
    methods: {
        handleCart() {
            this.$router.push("/cart");
        }
    },
}
</script>
```
说明：<br>
(1)本项目采用Vuex进行全局状态管理，HeaderCart组件通过store中定义的一个getter(itemsCount)得到购物车中商品的数量。

(2)本项目采用模块管理应用中不同的状态，目前分为两个带命名空间的模块cart和user，cart模块主要是购物车中商品的存储与管理，user模块主要是用户信息的存储和管理。后面会详细介绍本项目中的状态管理实现。

(3)单击“购物车”按钮，跳转到购物车页面。

**3. 头部组件**

在components目录下新建Header.vue，代码如例17-4所示。

例17-4 Header.vue
```
<template>
    <div class="header">
        <img src="@/assets/images/logo.png">
        <HeaderSearch/>
        <HeaderCart/>
        <span v-if="!user">你好，请<router-link to="/login">登录</router-link>免费<router-link to="/register">注册</router-link></span>
        <span v-else>欢迎您,{{ user.username }}, <a href="javascript:;" @click="logout">退出登录</a></span>
    </div>
</template>

<script>
import HeaderSearch from "./17.3.1-1HeaderSearch.vue";
import HeaderCart from "./17.3.1-2HeaderCart.vue";
import { mapState, mapMutations } from 'vuex'

export default {
    name: "Header",
    
    components: {
        HeaderSearch,
        HeaderCart,
    },

    computed: {
        //user模块带有命名空间
        ...mapState('user', [
            //将this.user映射为this.$store.state.user.user
            'user'
        ])
    },

    methods: {
        logout() {
            this.deleteUser();
        },
        //user模块带有命名空间
        ...mapMutations('user', [
            //将this.deleteUser映射为this.$store.commit('user/deleteUser')
            'deleteUser'
        ])
    },
};
</script>
```
说明：<br>
(1)通过v-if/v-else指令控制用户登录前和登录后显示的文字。用户没有登录时，显示的是“你好，请登录免费注册”，登录后显示的是：“欢迎您，某某，退出登录”。

(2)当用户单击“退出登录”按钮时，提交user/deleteUser mutation删除在store中存储的用户信息。

Header组件的渲染效果如图17-5所示。

### 17.3.2 菜单组件

菜单是单独定义的一个组件，本项目的菜单只有一级，如果需要定义多级菜单，可参照5.3.1小节的实现。在components目录下新建Menus.vue，代码如例17-5所示。

例17-5 Menus.vue
```
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
```
在这个组件比较简单，都是静态代码。由于本项目只是用于演示基于Vue的前端开发涉及的各个功能的实现，所以暂时只提供了首页和新书菜单的实现，其他3个菜单（特价书、教材、视听教材）功能的实现是类似的，只需要服务端提供相应的接口即可。

首页和新书菜单组件渲染的位置（即\<router-view\>）在App.vue中指定。App.vue的代码如例17-6所示。

例17-6 App.vue
```
<template>
    <div id="app">
        <Header/>
        <Menus/>
        <router-view/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Menus from '@/components/Menus.vue'

export default {
    components: {
        Header,
        Menus,
    }
}
</script>
```
本项目没有用到嵌套路由，所有页面级路由组件的渲染都是这里。换句话说，即所有渲染的页面都是有头部和菜单。

### 17.3.3 图书分类组件

图书分类组件用于显示商品的分类，每个分类都是一个链接，单击链接将跳转到展示该分类下所有商品的页面。

在components目录下新建HomeCategory.vue, 代码如例17-7所示。

例17-7 HomeCategory.vue
```
<template>
    <div class="category">
        <h3>图书分类</h3>
        <div v-for="category in categories" :key="category.id">
            <h5>{{ category.name }}</h5>
            <router-link v-for="child in category.children" :key="child.id"
                :to="'/category/' + child.id">{{ child.name }}</router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomeCategory',
    data() {
        return {
            categories: []
        };
    },

    created() {
        this.axios.get("/category")
            .then(response => {
                if(response.status === 200) {
                    this.categories = response.data;
                }
            })
            .catch(error => console.log(error));
    }
}
</script>
```
在created生命周期钩子中向服务端请求所有分类数据。服务端提供的该数据接口如下：<br>
http://111.229.37.167/api/category。

返回的数据形式如下：
```
[
    {
        "id": 1,
        "name": "Java EE",
        "root": true,
        "parentId": null,
        "children": [
            {
                "id": 3,
                "name": "Servlet/JSP",
                "root": false,
                "parentId": 1,
                "children": [],
            },
            {
                "id": 4,
                "name": "应用服务器",
                "root": false,
                "parentId": 1,
                "children": [],
            },
            {
                "id": 5,
                "name": "MVC框架",
                "root": false,
                "parentId": 1,
                "children": [],
            },
        ]
    },
    {
        "id": 2,
        "name": "程序设计",
        "root": true,
        "parentId": null,
        "children": [
            {
                "id": 6,
                "name": "C/C++",
                "root": false,
                "parentId": 2,
                "children": [
                    {
                        "id": 9,
                        "name": "C11",
                        "root": false,
                        "parentId": 6,
                        "children": [],
                    }
                ]
            },
            {
                "id": 7,
                "name": "Java",
                "root": false,
                "parentId": 2,
                "children": [],
            },
            {
                "id": 8,
                "name": "C#",
                "root": false,
                "parentId": 2,
                "children": [],
            },
        ]
    },
]
```
子分类是放到children数组属性中的，本项目中未用到root和parentId属性，前者可用于列出某个根分类下的所有商品，后者可以用于查找某个分类的父分类，甚至反向查找所有上级分类。

清楚了数据接口返回的数据解构，那么HomeCategory组件的代码也就清楚了。

HomeCategory组件的渲染效果如图17-6所示。

### 17.3.4 广告图片轮播组件

广告图片轮播功能在电商网站属于标配的功能，其实现是通过JavaScript代码控制图片的轮播，并处理一些控制图片显示的单击事件。

由于Vue 3.0推出的时间并不长，在写作业时，之前Vue 2.x下的很多好用的图片轮播插件还没有移植到Vue 3.0下，如果我们自己编写一个成熟的图片轮播组件，又会增加本项目的复杂度，因此这里暂时先用一张静止的图片代替图片轮播。如果读者对图片轮播功能的实现感兴趣，可以在网上找到很多案例，将其封装为组件使用即可。不过相信读者在看到这本书是，支持Vue 3.0的图片轮播插件也就有了。

在components目录下新建HomeScrollPic.vue，代码如例17-8所示。

例17-8 HomeScrollPic.vue
```
<template>
    <div class="scrollPic">
        <img scr="/ad01.jpg">
    </div>
</template>

<script>
export default {
};
</script>
```
图片是保存在public目录下的，该目录下的资源直接通过根路径"/"引用即可。

HomeScrollPic组件的渲染效果如图17-7所示。

### 17.3.5 热门推荐组件

热门推荐组件用于显示热门商品，用户如果对某一热门商品感兴趣，可以单击该商品链接，进入商品详情页面。

在components目录下新建HomeBooksHot.vue，代码如例17-9所示。

例17-9 HomeBooksHot.vue
```
<template>
    <div class="bookRecommend">
        <h3>热门推荐</h3>
        <ul>
            <li v-for="book in books" :key="book.id">
                <router-link :to="'/book/' + book.id">
                    {{ book.title }}
                    <span>{{ currency(factPrice(book.price, book.discount)) }}</span>
                </router-link>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'HomeBooksHot',
    data() {
        return {
            books: []
        };
    },
    inject: ['factPrice', 'currency'],
    created() {
        this.axios.get("/book/hot")
            .then(response => {
                if(response.status === 200) {
                    this.books = response.data;
                }
            })
            .catch(error => console.log(error));
    },
}
</script>
```
在created生命周期钩子中向服务端请求热门商品数据。服务端提供的该数据接口如下:<br>
http://111.229.37.167/api/book/hot。

返回的数据形式如下：
```
[
    {
        "id": 1,
        "title": "VC++深入详解",
        "author": "孙鑫",
        "price": 168.0,
        "discount": 0.95,
        "imgUrl": "/api/img/vc++.jpg",
        "bigImgUrl": "/api/img/vc++big.jpg",
        "bookConcern": null,
        "publishDate": null,
        "brief": null
    },
    {
        "id": 2,
        "title": "Java编程思想",
        "author": "Bruce Eckel",
        "price": 108.0,
        "discount": 0.5,
        "imgUrl": "/api/img/Javathink.jpg",
        "bigImgUrl": "/api/img/Javathinkbig.jpg",
        "bookConcern": null,
        "publishDate": null,
        "brief": null
    }
]
```
实际上，热门推荐组件用不到全部信息，只是服务端的数据接口返回的数据就是如此。那么从这些数据中选择有用的数据使用即可。

一般电商网站的商品有定价和实际销售价格，在前端展示商品的时候需要同时显示这两种价格。从这里返回的数据来看，服务端只提供了商品的定价和折扣，并没有实际销售价格，那么实际销售价格就需要我们自己来处理。这在实际开发中也很常见，不能期望服务端的开发人员专门为你的需求提供一个接口，也许还有其他前端也要用到这个接口。

实际价格是用定价与折扣相乘得到的，由于实际价格在多处要用到，因此编写一个单独的函数来计算实际价格。此外，还要考虑价格显示的问题，我们知道，价格只是显示到分就可以了，而在计算过程中，由于是浮点数，可能会出现小数点后两位之后的数据，所以要进行处理。除此之外，价格一般还会加上货币符号，如国内会加上人民币符号￥。为此，再编写一个函数，专门负责价格的格式化问题。

我们将这两个函数放到单独的JS文件中，在src目录下新建utils文件夹，在该文件夹下新建util.js文件。代码如例17-10所示。

例17-10 util.js
```
const digitsRE = /(\d{3})(?=\d)/g

export function factPrice(value, discount) {
    value = parseFloat(value);
    discount = parseFloat(discount);
    if(!discount) return vulue
    return value * discount;
}

export function currency (vulue, currency, decimals) {
    value = parseFloat(value)
    if (!isFinite(value) || (!value && value !== 0)) return ''
    currency = currency != null ? currency : '￥'
    decimals = decimals != null ? decimals : 2
    var stringified = Math.abs(value).toFixed(decimals)
    var _int = decimals
        ? stringified.slice(0, -1 - decimals)
        : stringified
    var i = _int.length % 3
    var head = i > 0
        ? (_int.slice(0, 1) + (_int.length > 3 ? ',' : ''))
        : ''
    var _float = decimals
        ? stringified.slice(-1 - decimals)
        : ''
    var sign = value < 0 ? '-' : ''
    return sign + currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float
}
```
为了方便在各个组件内使用这两个函数，我们在App组件内通过provide选项向所有后代组件提供两个函数。编辑App.vue，修改后的代码如下所示：
```
<template>
    <div id="app">
        <Header/>
        <Menus/>
        <router-view/>
    </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Menus from '@/components/Menus.vue'
import { factPrice, currency } from './utils/util.js'

export default {
    components: {
        Header,
        Menus,
    },
    provide() {
        return {
            factPrice,
            currency,
        }
    }
}
</script>
```
之后记得在组件内使用inject选项注入这两个函数，即例17-9中以下这句代码：
```
inject: ['factPrice', 'currency'],
```
了解这两个函数后，相信读者对例17-9的代码也就清楚了。

>提示：<br>
>utils目录下存放一些有用的工具函数库JS文件。

HomeBooksHot组件的渲染效果如图17-8所示。

### 17.3.6 新书上市组件

新书上市组件用于显示刚上市的商品，用户如果对某一商品感兴趣，可以单击该商品链接，进入商品详情页面。

在components目录下新建BooksNew.vue，由于该组件会被复用，所以这里没有使用主页的前缀Home。BooksNew组件的代码如例17-11所示。

例17-11 BooksNew.vue
```
import { currency } from './17.3.5util';

import { factPrice } from './17.3.5util';

import { currency } from './17.3.5util';

<template>
    <div class="booksNew">
        <h3>新书上市</h3>
        <div class="book" v-for="book in books" :key="book.id">
            <figure>
                <router-link :to="'/book/' + book.id">
                <img :src="book.imgUrl">
                <figcaption>
                    {{ book.title }}
                </figcaption>
                </router-link>
            </figure>
            <p>
                {{ currency(factPrice(book.price, book.discount)) }}
                <span>{{ currency(book.price) }}</span>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    props: [''],
    data() {
        return {
            books: [],
        };
    },
    inject: ['factPrice', 'currency'],
    created() {
        this.axios.get("/book/new")
        .then(renponse => {
            if( response.status === 200 {
                this.loading = false;
                this.books = response.data;
            }
        })
        .catch(error => console.log(error));
    }
}
</script>
```
在created生命周期钩子中向服务端请求新书的数据。服务端提供的该数据接口如下：<br>
http://111.229.37.167/api/book/new。

返回的数据形式如同/book/hot。

BooksNew组件的渲染效果如图17-9所示。

### 17.3.7 首页组件

首页的各个组成部分编写完成后，就可以开始集成这几个部分。首页作为页面级组件，放到views目录下。在views目录下新建Home.vue，代码如例17-12所示。

例17-12 Home.vue
```
<template>
    <div class="class">
        <HomeCategory/>
        <HomeScrollPic/>
        <HomeBooksHot/>
        <BooksNew/>
    </div>
</template>

<script>
import HomeCategory from '@/components/HomeCategory.vue'
import HomeScrollPic from '@/components/HomeScrollPic.vue'
import HomeBooksHot from '@/components/HomeBooksHot.vue'
import BooksNew from '@/components/BooksNew.vue'

export default {
    name: 'home',
    components: {
        HomeCategory,
        HomeScrollPic,
        HomeBooksHot,
        BooksNew
    }
}
</script>
```
Home组件比较简单，只是用于拼接各个子组件。Home组件的渲染效果如图17-10所示。

## 17.4 商品列表

商品列表页面以列表形式显示所有商品，我们将商品列表和商品列表项分别定义为单独的组件，商品列表组件作为父组件在其内部循环渲染商品列表项子组件。

### 17.4.1 商品列表项组件

在components目录下新建BookListItem.vue，代码如例17-13所示。

例17-13 BookListItem.vue
```
<template>
    <div class="bookListItem">
        <div>
            <img :src="item.bigImgUrl">
        </div>
        <p class="title">
            <router-link
                :to="{ name: 'book', params: { id: item.id }}"     //①
                target="_blank">         //②
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
        item: {         //③
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
                price: this.factPrice(item.price, item.discount),         //④
                quantity          //⑤
            };
            this.addCart(newItem);
            this.$router.push("/cart");       //⑥
        }
    }
}
</script>
```
说明：<br>
(1)\<router-link\>的to属性使用了表达式，因此要用v-bind指令（这里使用的是简写语法）进行绑定。params和path字段不能同时存在，如果使用了path字段，那么params将被忽略，所以这里使用了命名路由。当然，也可以采用前面例子中拼接路径字符串的方式。

(2)\<router-link\>默认渲染为\<a\>标签，所有路由的跳转都是在当前浏览器窗口中完成的，但有时希望在新的浏览器窗口中打开目标页面，那么可以使用target="_blank"。但要注意，如果使用v-slot API定制\<router-link\>，将其渲染为其他标签，那么就不能使用\<a\>标签的target属性，只能编写单击事件响应代码，然后通过windows.open()方法打开一个新的浏览器窗口。

(3)BookListItem组件需要的商品数据是由父组件通过prop传进来的，所以这里定义了一个item prop。

(4)单击“加入购物车”按钮时，会调用addCartItem()方法将该商品加入购物车中，由于购物车中的商品不需要商品的定价，所以这里先计算出商品的实际价格。

(5)购物车中保存的每种商品都有一个数量，通过quantity字段表示，在商品列表项页面中的“加入购物车”功能是一种便捷方式，商品的数量默认为1，后面会看到商品详情页面中加入任意数量商品功能的实现。

(6)在添加商品到购物车中后，路由跳转到购物车中页面，这也是电商网站通常采用的方式，可以刺激用户的冲动消费。

BookListItem组件的渲染效果如图17-11所示。

### 17.4.2 商品列表组件

商品列表组件作为商品列表项组件的父组件，负责为商品列表项组件提供商品数据，并通过v-for指令循环渲染商品列表项组件。

在components目录下新建BookList.vue，代码如例17-14所示。

例17-14 BookList.vue
```
<template>
    <div>
        <div v-for="book in list" :key="book.id">
            <BookListItem :item="book" />
        </div>
    </div>
</template>

<script>
import BookListItem form "./BookListItem"

export default {
    name: 'BookList',
    props: {
        list: {
            type: Array,
            default: () => []
        }
    },
    components: {
        BookListItem
    },
}
</script>
```
BookList组件的代码比较简单，主要就是通过v-for指令循环渲染BookListItem子组件。某些项目的实现是在列表组件中想服务器端请求数据渲染列表项，但在本项目中，BookList组件会被多个页面复用，并且请求的数据接口是不同的，因此BookList组件仅仅是定义了一个list prop用来接收父组件传递进来的商品列表数据。

BookList组件的渲染效果如图17-12所示。

## 17.5 分类商品和搜索结果页面

单击某个分类链接，将跳转到分类商品页面，在该页面下，将以列表形式列出该分类下的所有商品信息；当在搜索框中输入某个关键字，单击“搜索”按钮后，将跳转到搜索结果页面，在该页面下，也是以列表形式列出匹配该关键字的所有商品信息。既然这两个页面都是以列表形式显示商品信息，那么可以将它们合并为一个页面组价来实现，在该页面中无非就是根据路由的路径来动态切换页面标题，以及向服务器端请求不同的数据接口。

先给出这个页面的路由配置，编辑router目录下的index.js文件。修改后的代码如例17-15所示。

例17-15 router/index.js
```
...
const routes = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页'
        },
        component: Home
    },
    {
        path: '/category/:id',
        name: 'category',
        meta: {
            title: '分类图书'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/search',
        name: 'search',
        meta: {
            title: '搜索结果'
        },
        component: () => import('../views/Books.vue')
    },
]

//设置页面的标题
router.afterEach((to) => {
    document.title = to.meta.title;
})

...
```
在路由配置中，采用的是延迟加载路由的方式，只有在路由到该组件时才加载。关于延迟加载路由，可以参看14.14小节。

将分类图书（/category/:id)和搜索结果（/search）的导航链接对应到一个目标路由组件Books上，同时根据14.10.1小节介绍的知识，利用全局后置钩子来为路由跳转后的页面设置标题。

### 17.5.1 Loading组件

考虑到图书列表的数据是从服务器端去请求数据及网络状况的原因，图书列表的显示可能会延迟，为此，我们决定编写一个Loading组件，在图书列表数据还没有渲染时，给用户一个提示，让用户稍安勿躁。

在10.9小节的例10-6中，已经给出了一个使用loading图片实现加载提示的示例，读者可以沿用该示例实现加载提示。在这里换一种实现方式，考虑到图片本身加载也需要时间（虽然loading图片一般很小），采用CSS实现loading加载的动画效果，这种实现在网上很多，本项目从中找了一个实现，并将其封装为组件。

在components目录下新建Loading.vue。代码如例17-16所示。

例17-16 Loading.vue
```
<template>
    <div class="loading">
        <div class="shadow">
            <div class="loader">
                <div class="mask"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Loading",
};
</script>

<style scoped>
.shadow {
    position: absolute;
    top: 50%;
    left: 50%;
    border-radius: 50%;
    margin-top: -50px;
    margin-left: -50px;
    box-shadow: -2px 2px 10px 0 rgba(0, 0, 0, 0.5),
        2px -2px 10px 0 rgba(255, 255, 255, 0.5);
}

.loader {
    background: -webkit-linear-gradient(
        left,
        skyblue 50%,
        #fafafa 50%
    ); /* Foreground color, Backgroud color */
    border-radius: 100%;
    height: 100px;  /* Height and width */
    width: 100px;  /* Height and width */
    animation: time 8s steps(500, start) infinite;
}

.mask {
    border-radius: 100% 0 0 100% / 50% 0 0 50%;
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 50%;
    animation: mask 8s steps(250, start) infinite;
    transform-origin: 100% 50%;
}

@keyframes time {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes mask {
    0% {
        backgroud: #fafafa; /* Background color */
        transform: rotate(0deg);
    }
    50% {
        background: #fafafa; /* Background color */
        transform: rotate(-180deg);
    }
    50.01% {
        background: skyblue; /* Foreground color */
        transform: rotate(0deg);
    }
    100% {
        background: skyblue; /* Foreground color */
        transform: rotate(-180deg);
    }
}
</style>
```
主要代码就是CSS的样式规则，我们没必要去深究具体的实现细节，当然想研究CSS如何实现该种动画效果就另当别论。

Loading组件的渲染效果如图17-13所示。

### 17.5.2 Books组件

有了Loading组件，接下来就可以编写Books组件了。在views目录下新建Books.vue，代码如例17-17所示。

例17-17 Books.vue
```
<template>
    <div>
        <Loading v-if="loading" />   //1
        <h3 v-else>{{ title }}</h3>
        <BookList :list="books" v-if="books.length"/>  //6
        <h1>{{ message }}</h1>
    </div>
</template>

<script>
import BookList form "@/components/BookList"
import Loading from '@/components/Loading.vue'

export default {
    name: 'Books',
    data() {
        return {
            title: '',
            books: [],
            message: '',
            loading: true       //1
        };
    },

    beforeRouteEnter(to, from, next) {      //4
        next(vm => {
            vm.title = to.meta.title;
            let url = vm.setRequestUrl(to.fullPath);
            vm.getBooks(url);
        });
    },

    beforeRouteUpdate(to) {           //5
        let url = this.setRequestUrl(to.fullPath);
        this.getBooks(url);
        return true;
    },

    components: {
        BookList,
        Loading
    },

    methods: {
        getBooks(url) {
            this.message = '';
            this.axios.get(url)
                .then(response => {
                    if(response.status === 200) {
                        this.loading = false;            //1
                        this.books = response.data;
                        if(this.books.length === 0) {
                            if(this.$route.name === "category")      //3
                                this.message = "当前分类下没有图书！"
                            else
                                this.message = "没有搜索到匹配的图书！"
                        }
                    }
                })
                .catch(error => alert(error));
        },
        //动态设置服务器数据接口的请求URL
        setRequestUrl(path) {      //2
            let usl = path;
            if(path.indexOf("/category") != -1) {       //3
                url = "/book" + url;
            }
            return url;
        }
    }
}
</script>
```
说明：<br>
(1)为了控制Loading组件的显示与删除，定义一个数据属性loading，其值默认为true，然后使用v-if指令进行条件判断。当成功接收到服务端发回的数据时，将数据属性loading设置为false，这样v-if指令就会删除Loading组件。

(2)因为分类商品和搜索结果使用的是同一个组件，但是向服务端请求的数据接口是不同的，分类商品请求的数据接口是/book/category/6，而搜索请求的数据接口是/search?wd=keyword，为此定义了setRequestUrl方法动态设置请求的接口URL。

(3)判断目标路由有多种方式，可以在导航守卫中通过to.path或to.fullPath判断，也可以使用this.$route.path和this.$route.fullpath判断，如果在路由配置中使用了命名路由，还可以使用this.$route.name判断，如本例所示。

(4)在组件内导航守卫beforeRouteEnter()中请求初次渲染的数据，当然也可以利用created生命周期钩子完成相同的功能。

(5)由于搜索框是独立的，用户可能会多次进行搜索行为，所以使用组件内守卫beforeRouteUpdate()，在组件被复用的时候再次请求搜索。

(6)Booklist组件所需要的数据是通过list prop传出去的，由于父组件生命周期的调用时机问题，可能会出现子组件已经mounted，而父组件的数据才传过去，导致子组件不能正常渲染，为此可以添加一个v-if指令，使用列表数据的长度作为条件判断，确保子组件能正常接收到数据并渲染。在本项目使用的Vue.js版本和采用的实现方式下，不添加v-if指令也能正常工作，如果读者以后遇到子组件的列表数据不能正常渲染，可以试试这种解决办法。

Books组件的渲染效果与Booklist组件渲染的效果是类似的，只是多了一个标题，以及在没有请求到数据时给出的一个提示信息。

## 17.6 新书页面

当单击菜单栏的“新书”菜单时，将跳转到新书页面。这里直接复用了BooksNew组件（参看17.3.6小节），只是在路由配置中为新书页面添加了一项路由配置。代码如下所示：
```
const routes = [
    ...
    {
        path: '/newBooks',
        name: 'newBooks',
        meta: {
            title: '新书上市'
        },
        component: () => import('../components/BooksNew.vue')
    }
    ...
]
```
渲染效果参见图17-9。

## 17.7 图书详情页面

不管从何处单击图书链接，都将跳转到图书详情页面。图书详情页面中有两个子组件，其中一个是实现图书数量加减的组件，如图17-14所示；另一个是用动态组件实现的标签组件，用于在图书介绍、图书评价和图书问答三者之间进行切换，如图17-15所说。

### 17.7.1 加减按钮组件

加减按钮组件由3部分组成：一个输入框和两个加减按钮。当然，至于采用什么页面元素实现加减按钮都无所谓了，本项目采用的是\<a\>标签实现加减按钮。

在components目录下新建AddSubtractButton.vue，代码如例17-18所示。

例17-18 AddSubtractButton.vue
```
<template>
    <div class="addSubtractButton">
        <input v-model="quantity" type="number">
        <div>
            <a class="add" href="javascript:;" @click="handleAdd">+</a>
            <a class="sub" @click="handleSubtract"
                :class="{ disabled: quantity === 0 , actived: quantity > 0 }"
                href="javascript:;" >
                -
            </a>
        </div>
    </div>
</template>

<script>
    
export default {
    name: 'AddSubtractButton',
    data() {
        return {
            quantity: 0
        }
    },
    methods: {
        handleAdd() {
            this.quantity++;
            this.$emit("update-quantity", this.quantity);
        },
        handleSubtract() {
            this.quantity--;
            this.$emit("update-quantity", this.quantity);
        }
    }
}
</script>
```
用户可直接在输入框中输入购买数量，也可以通过加减按钮增减数量，当数量为0时，通过CSS样式控制减按钮不可用。加减组件通过自定义事件updateQuantity向父组件传递数据。

另外要注意的是，提交的自定义事件必须采用kebab-case风格命名。

### 17.7.2 标签页组件

在本项目中的标签页组件是根据10.7小节介绍的动态组件只是编写的，并进行了封装。该标签页组件有3个子组件，分别是图书介绍、图书评价和图书问答。下面分别介绍标签页组件及其子组件。

**1. 标签页组件**

在components目录下新建BookTabComponent.vue,代码如例17-19所示。

例17-19 BookTabComponent.vue
```
<template>
    <div class="tabComponent">
        <button
            v-for="tab in tabs"
            :key="tab.title"
            :class="['tab-button', { active: currentTab === tab.title }]"
            @click="currentTab = tab.title">
            {{ tab.displayName }}
        </button>

        <keep-alive>
            <component :is="currentTabComponent" :content="content" class="tab"></component>
        </keep-alive>
    </div>
</template>

<script>
import BookIntroduction from './BookIntroduction'
import BookCommentList from './BookCommentList'
import BookQA from './BookQA'

export default {
    name: 'TabComponent',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            currentTab: 'introduction',
            tabs: [
                { title: 'introduction', displayName: '图书介绍' },
                { title: 'comment', displayName: '图书评价' },
                { title: 'qa', displayName: '图书问答' },
            ]
        };
    },
    components: {
        BookIntroduction,
        BookComment: BookCommentList,
        BookQa: BookQA,
    },
    computed: {
        currentTabComponent: function() {
            return 'book-' + this.currentTab
        }
    }
}
</script>
```
多标签页面的实现方式已经在10.7小节中讲述过，这里不再赘述。

**2. 图书介绍组件**

在components目录下新建BookIntroduction.vue,代码如例17-20所示。

例17-20 BookIntroduction.vue
```
<template>
    <div>
        <p>{{ content }}</p>
    </div>
</template>

<script>
export default {
    name: 'BookIntroduction',
    props: {
        content: {
            type: String,
            default: '',
        }
    }
}
</script>
```
组件代码很简单，只是定义了一个content prop,用于接收父组件传出来的图书内容，并进行显示。

**3. 图书评价组件**

图书评价组件负责渲染图书的评论信息，评论信息以列表方式呈现，在本项目中，将单条评论信息封装为一个组件BookCommentListItem，评论信息列表封装为一个组件BookCommentList。

在components目录下新建BookCommentListItem.vue，代码如例17-21所示。

例17-21 BookCommentListItem.vue
```
<template>
    <div class="bookCommentListItem">
        <div>
            <span>{{ item.username }}</span>
            <span>{{ formatTime(item.commentDate) }}</span>
        </div>
        <div>{{ item.content }}</div>
    </div>
</template>

<script>
export default {
    name: 'BookCommentListItem',
    props: {
        item: {
            type: Object,
            default: () => {}
        }
    },
    inject: ['formatTime'],
}
</script>
```
该组件比较简单，只是接收父组件传来的item prop，并进行相应的渲染。唯一需要注意的是，在渲染评论日期时，调用了一个formatTime()函数。这是因为服务端传过来的日期时间数据有时并不是我们平常使用的格式。例如Java服务器程序传过来的日期和时间中间会有一个T字符。代码如下所示：
```
2019-10-03T09:15:09
```
很显然，直接将该日期时间渲染到页面，用户体验不好。为此，在utils/util.js文件中又编写了一个函数，负责日期时间的格式化。该函数的实现代码如下所示：
```
export function formatTime(value) {
    return value.toLocaleString().replace(/T/G, ' ').replace(/\.[\d]{3}Z/, ''))
}
```
同样在App.vue中使用provide选项向后代组件提供该函数，代码如下所示：
```
<script>
import Header from '@/components/Header.vue'
import Menus from '@/components/Menus.vue'
import { factPrice, currency, formatTime } from './utils/util.js'
export default {
    components: {
        Header,
        Menus,
    },
    provide() {
        return {
            factPrice,
            currency,
            formatTime,
        }
    }
}
</script>
```
接下里，在components目录下新建BookCommentList.vue，代码入例17-22所示。

例17-22 BookCommentList.vue
```
<template>
    <div>
        <h3>{{ message }}</h3>
        <BookCommentListItem
            v-for="comment in comments"
            :item="comment"
            :key="comment.id" />
    </div>
</template>

<script>
import BookCommentListItem from './BookCommentListItem.vue'

export default {
    name: 'BookCommentList',
    data() {
        return {
            comments: [],
            message: '',
        };
    },
    components: {
        BookCommentListItem,
    },
    created() {
        this.message = '',
        let url = this.$route.path + "/comment";
        this.axios.get(url)
            .then(response => {
                if(response.status === 200) {
                    this.comments = response.data;
                    if(this.comments.length === 0) {
                        this.message = "当前没有任何评论！"
                    }
                }
            })
            .catch(error => alert(error));
    },
}
</script>
```
BookCommentList组件在created生命周期钩子中向服务端请求数据。数据接口如下：<br>
http://111.229.37.167/api/book/:id/comment。


返回的数据形式如下：
```
[
    {
        "id": 1,
        "content": "本书是VC",
        "commentDate": "2019-11-12T09:14:30",
        "usenname": "张三",
        "book": null
    },
    {
        "id": 2,
        "content": "书收到了",
        "commentDate": "2019-11-12T09:15:09",
        "usenname": "李四",
        "book": null
    },
        {
        "id": 3,
        "content": "确实不错",
        "commentDate": "2019-11-14T18:14:30",
        "usenname": "王五",
        "book": null
    },
]
```
接收到数据后，使用v-for指令循环渲染BookCommentListItem组件。

读者可能会考虑是否要给该组件添加组件复用时再次请求评论数据的功能，其实这是没有必要的。当用户在浏览评论信息时切换了标签页再回到评论标签页时，多一两条评论信息并不会影响用户的购买需求，而且并不是每个购买图书的用户都会发表评论。也就是说，图书评论的频次实际上很低的。所以在created生命周期钩子中请求一次数据足以满足我们的应用需求。

**4. 图书问答组件**

图书问答组件其实就是一个摆设，并没有实际的功能。该组件的名字为BookQA，就显示一句话：图书问答。这里就不浪费篇幅介绍代码。

说明：<br>
(1)BookIntroduction组件定义了一个content prop，用来接收图书的内容，而图书的内容数据是在17.7.3小节介绍的Book组件中得到的，BookTabComponent将作为Book组件的子组件来使用，因此为BookTabComponent组件也定义了一个content prop，在接收到Book组件的图书内容数据后，依次向下级组件传递。当然，可以采用其他方式实现向后代组件传递数据的功能。如利用依赖注入，或者利用Vuex的状态管理来实现。此外，读者可能担心切换到其他标签页是，其所对应的组件没有content prop会不会出错，在第10章中介绍过，如果子组件返回单个根节点，且没有定义prop，那么父组件在该组件上设置的属性会被添加到子组件的根元素上，浏览器对于不识别的属性，并不会提示错误，所以不用担心。实际上，很早之前有一些前端框架和库通过在HTML元素上添加自定义属性来扩展页面的功能。

(2)在《Vue.js从入门到实战》一书中提到过，图书的评论数据只有在切换到评论标签页时才会显示，而且有些用户在购买图书时并不查看评论信息，所以采用异步加载的方式按需加载BookCommentList组件会更合适一些，不过在Vue 3.0中，这里如果采用异步加载组件会报错，这应该是Vue 3.0内部的一个Bug。

### 17.7.3 Book组件

Book组件作为页面级组件，放在views目录下，在该目录下新建Book.vue。代码如例17-23所示。

例17-23 Book.vue
```
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
```
说明：

1.我们接收到的折扣数据格式形如0.95，在显示时，直接显示0.95折，显然不合适，为此我们编写了一个方法，将0.95这种形式化为95折。

2.前面提到过BookIntroduction组件有一个content prop，用于接收图书的详细介绍数据，这里得到图书数据后，将图书的介绍数据通过BookTabComponent组件向下传递。

Book组件在created生命周期钩子中请求服务器端的图书数据。数据接口如下：<br>
http://111.229.37.167/api/book/:id。<br>
返回的数据格式入下：
```
{
    "id": 1,
    "title": "VC++教程",
    "author": "李四",
    "price": 168.0,
    "discount": 0.95,
    "imgUrl": "/api/img/vc++.jpg",
    "bigImgUrl": "/api/img/vc++big.jpg",
    "publishDate": "2019-06-01",
    "brief": "...",
    "inventory": 1000,
    "detail": "...",
    "newness": true,
    "hot": true,
    "specialOffer": false,
    "slogan": "...",
    "category": {
        ...
    }
}
```
## 17.8 购物车

在一个电商网站中，购物车很多页面都需要用到，因此非常适合放在Vuex的store中进行集中管理。在本项目中，我们采用模块化的方式管理应用中不同的状态。

### 17.8.1 购物车状态管理配置

在项目中的store目录下新建modules目录，在该目录下新建cart.js。代码如例17-24所说。

例17-24 cart.js
```
const state = {
    items: []
}
//mutations
const mutations = {
    //添加商品到购物车中
    pushProductToCart(state, { id, imgUrl, title, price, quantity}) {
        if( ! quantity )
            quantity = 1;
        state.items.push({ id, imgUrl, title, price, quantity });
    },

    //增加商品数量
    icrementItemQuantity(state, { id, quantity }) {
        let cartItem = state.items.find(item => item.id == id);
        cartItem.quantity += quantity;
    },

    //用于清空购物车
    setCartItems(state, { item }) {
        state.items = items
    },

    //删除购物车中的商品
    deleteCartItem(state, id) {
        let index = state.items.findIndex(item => item.id === id);
        if(index > -1)
            state.items.splice(index, 1);
    }
}

//getters
const getters = {
    //计算购物车所有商品的总价
    cartTotalPrice: (state) => {
        return state.items.reduce(( total, product ) => {
            return total + product.price * product.quantity
        }, 0)
    },
    //计算购物车中单项商品的价格
    cartItemPrice: (state) => (id) => {
        if(state.items.length > 0) {
            const cartItem = state.items.find(item => item.d === id);
            if(cartItem) {
                return cartItem.price * cartItem.quantity;
            }
        }
    },
    //获取购物车中商品的数量
    itemsCount: (state) => {
        return state.items.length;
    }
}

//actions
const actions = {
    //增加任意数量的商品购物车
    addProductToCart({ state, commit }, { id, imgUrl, title, price, inventory, quantity }) {
        if(inventory > 0) {
            const cartItem = state.items.find(item => item.id == id);
            if(!cartItem) {
                commit('pushProductToCart', { id, imgUrl, title, price, quantity })
            } else {
                commit('incrementItemQuantity', { id, quantity })
            }
        }
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions,
}
```
items数组用于保存购物车中所有商品信息的状态属性。

接下来，编辑store目录下的index.js文件，导入cart模块。代码如例17-25所示。

例17-25 store/index.js
```
import { createStore } from 'vuex'
import cart from './modules/cart'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        cart
    },
    plugins: [ createPersistedState() ]
})
```
在刷新浏览器窗口时,store中存储的状态信息会被重置，这样就会导致加入购物车中的商品信息丢失。所以一般会选择一种浏览器端持久存储方案解决这个问题，比较常用且简单的方案就是localStorage，保存在store中的状态信息也要同步加入localStorage，在刷新浏览器窗口前，或者用户重新访问网站时，从localStorage中读取状态信息保存到store中。在整个应用期间，需要考虑各种情况下store与localStorage数据同步的问题，这比较麻烦。为此，我们可以使用一个第三方的插件解决store与localStorage数据同步的问题，即例17-25中所用的vuex-persistedstate插件。

首先安装vuex-persistedstate插件，在vscode的终端窗口中执行以下命令进行安装。
```
npm install vuex-persistedstate -S
```
vue-persistedstate插件的使用非常简单，从例17-25中可以看到，只需要两句代码就可以实现store的持久化存储，这会将整个store的状态以vuex为键名存储到localStorage中。

如果只想持久化存储store中的部分状态信息，那么可以在调用createPersistedState()方法时传递一个选项对象，在该选项对象的reducer()函数中返回要存储的数据。例如：
```
plugin: [createPersistedState({
    reduce(data) {
        return {
            //设置只存储cart模块中的状态
            cart: data.cart,
            //或者设置只存储cart模块中的items数据
            //products: data.cart.items
        }
    }
})]
```
reducer()函数的data参数是完整的state对象。

如果想改变底层使用的存储机制，如使用sessionStorage,那么可以在选项对象中通过storage指定。代码如下所示：
```
plugins: [createPersistedState({
    storage: window.sessionStorage,
    ...
})]
```
vuex-persistedstate更多的用法请参看下面的网址：<br>
https://github.com/robinvdvleuten/vuex-persistedstate。<br>
配置好Vuex的状态管理后，就可以开始编写购物车组件了。

### 17.8.2 购物车组件

在views目录下新建ShoppingCart.vue,代码如例17-26所示。

例17-26 ShoppingCart.vue
```
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
```
ShoppingCart组件提供了两种方式删除购物车中的某项商品：(1)单击“删除”按钮，将直接删除购物车中的该项商品；(2)用户单击数量下的减号按钮时，如果判断数量减1后为0，则删除该项商品项。

## 17.9 结算页面

在购物车页面中单击“结算”按钮，则进入结算页面，结算页面再一次列出购物车中的所有商品，不同的是，在结算页面不能再对商品进行修改。

在views目录下新建Checkout.vue，代码如例17-27所示。

例17-27 Checkout.vue
```
<template>
    <div class="shoppingCart">
        <h1 v-if="success">{{ msg }}</h1>
        <table>
            <caption>商品结算</caption>
            <tr>
                <th></th>
                <th>商品名称</th>
                <th>单价</th>
                <th>数量</th>
                <th>金额</th>
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
                    {{ book.quantity }}
                </td>
                <td>{{ currency(cartItemPrice(book.id)) }}</td>
            </tr>
        </table>
        <p>
            <span><button class="pay" @click="pay">付款</button></span>
            <span>总价: {{ currency(cartTotalPrice) }}</span>
        </p>
    </div>
</template>

<script>
import { mapGetters, mapState, mapMutations } from 'vuex'

export default {
    name: "Checkout",
    data() {
        return {
            success: false,
            msg: '付款成功！'
        };
    },
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
            'setCartItems'
        ]),
        pay() {
            this.setCartItems({ items: [] });
            this.success = true;
        }
    }
};
</script>
```
在线支付涉及各个支付平台或银联的调用接口，所以本项目的购物流程到这一步就结束了，当用户单击“付款”按钮时，只是简单地清空购物车，稍后提示用户“付款成功”。

## 17.10 用户管理

在实际场景中，当用户提交购物订单准备结算时，系统会判断用户是否已经登录，如果没有登录，会提示用户先进行登录，本节实现用户注册和用户登录组件。

### 17.10.1 用户状态管理配置

用户登录后的状态需要保存，不仅可以用于向用户显示欢迎信息，还可以用于对受保护的资源进行权限验证。同样，用户的状态存储也是用Vuex管理。

在store/modules目录下新建user.js，代码例17-28所示。

例17-28 user.js
```
const state = {
    user: null
}
//mutations
const mutations = {
    saveUser(state, {username, id}) {
        state.user = { username, id}
    },
    deleteUser(state) {
        state.user = null;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
}
```
对于前端，存储用户名和用户ID已经足矣，像用户中心等功能的实现，是需要重新向服务器端去请求数据的。

编辑store/index.js文件，导入user模块，并在modules选项下进行注册。代码如例17-29所示。

例17-29 store/index.js

```
import { createStore } from 'vuex'

import cart from './modules/cart'
import user from './modules/user'
import createPersistedState from "vues-persistedstate"

export default createStore({
    modules: {
        cart,
        user,
    },
    plugins: [createPersistedState()]
})
```

### 17.10.2 用户注册组件

当用于单击Header组件中的“注册”链接时，将跳转到用户注册页面。

在components目录下新建UserRegister.vue，代码如例17-30所示。

例17-30 UserRegister.vue
```
<template>
    <div class="register">
        <form>
            <div class="lable">
                <lable class="error">{{ message }}</lable>
                <input name="username" type="text"
                    v-model.trim="username"
                    placeholder="请输入用户名" />
                <input type="password"
                    v-model.trim="password"
                    placeholder="请输入密码" />
                <input type="password"
                    v-model.trim="password2"
                    placeholder="请输入确认密码" />
                <input type="tel"
                    v-model.trim="mobile"
                    placeholder="请输入手机号" />
            </div>
            <div class="submit">
                <input type="submit" @click.prevent="register" value="注册" />
            </div>
        </form>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "UserRegister",
    data() {
        return {
            username: "",
            password: "",
            password2: "",
            mobile: "",
            message: '',
        };
    },
    watch: {             //①
        username(newVal) {
            //取消上一次请求
            if(newVal) {
                this.cancelRequest();          //①
                this.axios
                    .get("/user/" + newVal, {
                        cancelToken: new this.axios.CancelToken(         //①
                            cancel => this.cancel = cancel
                        )
                    })
                    .then(response => {
                        if(response.data.code == 200) {
                            let isExist = response.data.data;
                            if(isExist) {
                                this.message = "该用户已经存在";
                            } 
                            else {
                                this.message = "";
                            }
                        }
                    })
                    .catch(error => {
                        if(this.axios.isCancel(error)) {             //①
                            //如果是请求被取消产生的错误，则输出取消请求的原因
                            console.log("请求取消: ", error.message);
                        }
                        else {
                            //错误处理
                            console.log("请求取消")
                        }
                    });
            }
        }
    },
    methods: {
        register() {
            this.message = '';
            if(!this.checkForm())
                return;
            this.axios.pos("/user/register",
                {username:this.username, password: this.password, mobile: this.mobile})
                .then(response => {
                    if(response.data.code === 200) {
                        this.saveUser(response.data.data);
                        this.username = '';
                        this.password = '';
                        this.password2 = '';
                        this.mobile = '';
                        this.$router.push("/");
                    }else if(response.data.code === 500) {
                        this.message = "用户注册失败";
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
        },
        cancelRequest() {            //①
            if(typeof this.cancel === "function") {
                this.cancel("终止请求");
            }
        },
        checkForm() {
            if(!this.username || !this.password || !this.password2 || !this.mobile) {
                this.$msgBox.show({title:"所有字段不能为空"});
                return false;
            }
            if(this.password !== this.password2) {
                this.$msgBox.show({ title: "密码和确认密码必须相同"});
                return false;
            }
            return true;
        },
        ...mapMutations('user', [
            'saveUser'
        ])
    },
};
</script>
```
说明：<br>
①处在这里实现了一个功能，当用户输入用户名时，实时去服务器端检测该用户名是否已经存在，如果存在，则提示用户，这是通过Vue的监听器来实现的。不过由于v-model指令内部实现机制的原因（对于输入文本框，默认绑定的是input事件），如果用户快捷输入或快速用退格删除用户名时，监听器将触发多次，由于导致频繁地想服务器端发起请求。为了解决这个问题，可以利用axios的cancel token取消重复的请求。使用axios发起请求时，可以传递一个配置对象，在配置对象中使用cancelToken选项，通过传递一个executor()函数到CancelToken的构造函数中来创建cancel token。
```
this.axios.get("/user/" + newVal, {
    cancelToken: new this.axios.CancelToken(function executor(c) {
        //executor()函数接收一个cancel()函数作为参数
        this.cancel = c;
    })
})
```
使用箭头函数可以简化上述代码，如下所示。
```
<template>
    <div class="register">
        <form>
            <div class="lable">
                <lable class="error">{{ message }}</lable>
                <input name="username" type="text"
                    v-model.trim="username"
                    placeholder="请输入用户名" />
                <input type="password"
                    v-model.trim="password"
                    placeholder="请输入密码" />
                <input type="password"
                    v-model.trim="password2"
                    placeholder="请输入确认密码" />
                <input type="tel"
                    v-model.trim="mobile"
                    placeholder="请输入手机号" />
            </div>
            <div class="submit">
                <input type="submit" @click.prevent="register" value="注册" />
            </div>
        </form>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "UserRegister",
    data() {
        return {
            username: "",
            password: "",
            password2: "",
            mobile: "",
            message: '',
        };
    },
    watch: {
        username(newVal) {       //①
            //取消上一次请求
            if(newVal) {
                this.cancelRequest();        //①
                this.axios
                    .get("/user/" + newVal, {
                        cancelToken: new this.axios.CancelToken(        //①
                            cancel => this.cancel = cancel
                        )
                    })
                    .then(response => {
                        if(response.data.code == 200) {
                            let isExist = response.data.data;
                            if(isExist) {
                                this.message = "该用户已经存在";
                            } 
                            else {
                                this.message = "";
                            }
                        }
                    })
                    .catch(error => {
                        if(this.axios.isCancel(error)) {         //①
                            //如果是请求被取消产生的错误，则输出取消请求的原因
                            console.log("请求取消: ", error.message);
                        }
                        else {
                            //错误处理
                            console.log("请求取消")
                        }
                    });
            }
        }
    },
    methods: {
        register() {
            this.message = '';
            if(!this.checkForm())
                return;
            this.axios.pos("/user/register",
                {username:this.username, password: this.password, mobile: this.mobile})
                .then(response => {
                    if(response.data.code === 200) {
                        this.saveUser(response.data.data);
                        this.username = '';
                        this.password = '';
                        this.password2 = '';
                        this.mobile = '';
                        this.$router.push("/");
                    }else if(response.data.code === 500) {
                        this.message = "用户注册失败";
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
        },
        cancelRequest() {            //①
            if(typeof this.cancel === "function") {
                this.cancel("终止请求");
            }
        },
        checkForm() {
            if(!this.username || !this.password || !this.password2 || !this.mobile) {
                this.$msgBox.show({title:"所有字段不能为空"});
                return false;
            }
            if(this.password !== this.password2) {
                this.$msgBox.show({ title: "密码和确认密码必须相同"});
                return false;
            }
            return true;
        },
        ...mapMutations('user', [
            'saveUser'
        ])
    },
};
</script>
```
说明：代码①处这里实现了一个功能，当用户输入用户名时，实时去服务端检测该用户名是否已经存在，如果存在，则提示用户，这是通过Vue的监听器来实现的。不过由于v-model指令内部实现机制的原因（对于文本输入框，默认绑定的是input事件），如果用户快速输入或快速用退格键删除用户名时，监听器将触发多次，由此导致频繁地想服务器端发起请求。为了解决这个问题，可以利用axios的cancel token取消重复的请求。使用axios发起请求时，可以传递一个配置对象，在配置对象中使用cancelToken选项，通过传递一个executor()函数到CancelToken的构造函数中来创建cancel token。
```
this.axios.get("/user/" + newVal, {
    cancelToken: new this.axios.CancelToken(function executor(c) {
        //executor()函数接收一个cancel()函数作为参数
        this.cancel = c;
    })
})
```
使用箭头函数可以简化上述代码，如下所示。
```
this.axios.get("/user/" + newVal, {
    cancelToken: new this.axios.CancelToken(
        c => this.cancel = c
    )
})
```
将cancel()函数保存为组件实例的方法，之后如果取消请求，调用this.cancel()即可。cancel()函数可以接收一个可选的消息字符串参数，用于给出取消请求的原因。同一个cancel token可以取消多个请求。在发生错误时，可以在catch()方法中使用this.axios.isCancel(error)判断该错误是否是由取消请求而引发的。

当然，这里也可以通过修改v-model的监听事件为change解决快速输入和删除导致的重复请求问题，只需要给v-model指令添加.lazy修饰符即可。

用户名是否已注册的判断，请求的服务器数据接口如下：
http://111.229.37.167/api/user/{用户名}。

返回的数据解构形式如下：
```
{
    "code": 200,
    "data": true    //如果要注册的用户名不存在，则返回false
}
```
用户注册请求的服务器数据接口如下：<br>
http://111.229.37.167/api/user/register。

需要采用Post()方法向该接口发起请求，提交的数据是一个JSON格式的对象，该对象要包含username、password和mobile三个字段。

返回的数据解构形式如下：
```
{
    "code": 200,
    "data": {
        "id": 18,
        "username": "小鱼儿",
        "password": "1234",
        "mobile": "1333333333",
    }
}
```
实际开发时，服务端不用把密码返回给前端，如果前端需要用到密码，则可以采用加密形式传输。

例如17-30剩余的代码并不复杂，这里不再详述。UserRegister组件渲染的效果如图17-18所示。

当用户注册成功后，将用户名和ID保存到store中，并跳转到根路径下，即网站的首页。然后Header组件会自动渲染出用户名，显示欢迎信息，如果17-19所示。

### 17.10.3 用户登陆组件

当用户单击Header组件中的“登录”链接时，将跳转到用户登录页面。

在components目录下新建UserLogin.vue，代码如例17-31所示。

例17-31 UserLogin.vue
```
<template>
    <div class="login">
        <div class="error">{{ message }}</div>
        <from>
            <div class="lable">
                <input
                    name="username"
                    type="text"
                    v-model.trim="username"
                    placeholder="请输入用户名"
                />
                <input
                    type="password"
                    v-model.trim="password"
                    placeholder="请输入密码"
                />
            </div>
            <div class="submit">
                <input type="submit" @click.prevent="login" value="登录" />
            </div>
        </from>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "UserLogin",
    data() {
        return {
            username: '',
            password: '',
            message: '',
        };
    },
    methods: {
        login() {
            this.message = '';
            if(!this.checkForm())
                return;
            this.axios.post("/user/login",
                {username: this.username, password: this.password})
                .then(response => {
                    if(response.data.code === 200) {
                        this.saveUser(response.data.data);
                        this.username = '';
                        this.password = '';
                        //如果存在查询参数
                        if(this.$route.query.redirect) {
                            const redirect = this.$route.query.redirect;
                            //跳转至进入登录页面的路由
                            this.$router.replace(redirect);
                        }else{
                            //否则跳转至首页
                            this.$router.replace('/');
                        }
                    }else if(response.data.code === 500) {
                        this.message = "用户登录失败";
                    }else if(response.data.code === 400) {
                        this.message = "用户名或密码错误";
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
        },
        ...mapMutations('user', [
            'saveUser'
        ]),
        checkForm() {
            if(!this.username || !this.password) {
                this.$msgBox.show({ title: "用户名和密码不能空"});
                return false;
            }
            return true;
        }
    }
};
</script>
```
用户登录组件并不复杂，值得一提的就是在用户登录后需要跳转到进入登录页面前的路由，这会让用户的体验更好，实现方式已经在14.10.1小姐中介绍过，本项目也是利用beforeEach()注册的全局前置守卫保存用户登录前的路由路径，可以参看17.11小节。

用户登录请求的数据接口如下：<br>
http://111.229.37.167/api/user/login。

同样是以Post()方法发起请求，提交的数据是一个JSON格式的对象，该对象要包含username和password两个字段。

返回的数据格式与用户注册返回的数据格式相同。

UserLogin组件渲染的效果如图17-20所示。

## 17.11 路由配置

下面给出本项目的路由配置，其中包含了页面标题的设置，以及对结算页面的路由要求用户已登录的判断。代码如例17-32所示。

例17-32 router/index.js
```
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home'
import store from '@/store'

const routes = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页'
        },
        component: Home
    },
    {
        path: '/newBooks',
        name: 'newBooks',
        meta: {
            title: '新书上市'
        },
        component: () => import('../components/BooksNew.vue')
    },
    {
        path: '/category/:id',
        name: 'category',
        meta: {
            title: '图书分类'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/search',
        name: 'search',
        meta: {
            title: '搜索结果'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/book/:id',
        name: 'book',
        meta: {
            title: '图书'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/search',
        name: 'search',
        meta: {
            title: '搜索结果'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        meta: {
            title: '购物车'
        },
        component: () => import('../views/ShoppingCart.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: {
            title: '注册'
        },
        component: () => import('../components/UserRegister.vue')
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('../components/UserLogin.vue')
    },
    {
        path: '/check',
        name: 'check',
        meta: {
            title: '结算'
        },
        component: () => import('../components/Checkout.vue')
    },
]

coust router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach(to => {
    //判断该路由是否需要登录权限
    if(to.matched.some(record => record.meta.requiresAuth)) {
        //路由需要验证，判断用户是否已经登录
        if(store.state.user.user) {
            return true;
        }
        else {
            return {
                path: '/login',
                query: { redirect: to.fullPath }
            };
        }
    }
    else
        return true;
})


//设置页面标题
router.afterEach((to) => {
    document.title = to.meta.title;
})

export default router
```

## 17.12 分页组件

完善一下商品列表的显示,如果商品数量较多,就需要分页显示。分页功能可以使用element-plus组件库中的分页组件来实现。element-plus是一套支持Vue3.0的组件库,提供的组件涵盖了绝大部分页面UI的需求.关于该组件库的详细介绍可以参考下面的网址:

https://element-plus.gitee.io/#/zh-CN/component/installation

在本项目中只是使用了它的分页组件Pagination。

首先是安装element-plus的npm包.在vscode终端执行以下命令:
```
npm install element-plus -S
```
编辑main.js,引入整个element-plus组件和所需的样式,由于element-plus组件内部默认使用英语,而本项目需要使用中文,因此还需要引入中文的语言包.代码如下:
```
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

createApp(App).use(store).use(router).use(VueAxios, axios).use(ElementPlus, { locale }).mount('#app')
```
如果想按需引入,本项目中只用到了分页组件,不想引入整个element-plus组件库,则需要借助babel-plugin-component插件。首先,在终端窗口中执行下面的命令安装babel-plugin-component。
```
npm install babel-plugin-component -D
```
然后编辑项目目录下的babel.config.js文件,添加以下内容:
```
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-plus",
                "styleLibraryName": "theme-chalk",
            }
        ]
    ]
}
```
接下来,在main.js文件中就可以按需引入分页组件ElPagination.代码如下:
```
import { ElPagination } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import lang from 'element-plus/'lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

// 使用中文语言
locale.use(lang)

createApp(App).use(store).use(router).use(VueAxios, axios).use(ElPagination, { locale }).mount('#app')
```
作为分页实现,至少需要3个属性控制分页的显示和跳转,即每页显示的条数、总条数和当前页数.有了当前页数就可以记录用户要跳转的分页。

编辑views目录下的Books.vue,添加3个数据属性.代码如下:
```
data() {
    return {
        ...
        total: 5,
        pageNum: 1,
        pageSize: 2,
    }
}
```
这3个数据属性分别代表总条数、当前页数、每页显示的条数。由于服务端数据较少,为了能够看到分页组件的效果,这里将每页显示的条数初始值为2。

接下来在Books组件中使用ElPagination组件实现分页功能,代码如下:
```
<template>
    <div>
        <Loading v-if="loading" />
        <h3 v-else>{{ title }}</h3>
        <BookList :list="book" />
        <h1>{{ message }}</h1>
        <el-pagination
            :hide-on-single-page="true"       //当只有一页时隐藏分页
            @size-change="handleSizeChange"   //当pageSize改变时触发
            :page-sizes="[2, 10, 20, 40]"     //设置每页显示条数的选项
            @current-change="handleCurrentChange"  //当前页发生改变触发
            :current-page="pageNum"           //当前页数
            :page-size="pagSize"              //每页显示条数
            layout="total, sizes, prev, pager, next, jumper" //设置组件布局
            :total="total">
        </el-pagination>
    </div>
</template>
```
接下来就是编写当前页数改变和每页显示条数改变的事件响应函数代码,以及修正服务器端发起请求获取数据的接口,因为服务器端对于分页数据的返回提供了不同的接口.代码如下:
```
<script>
    ...
    export default {
        data() {
            ...
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.title = to.meta.title;
                let url = vm.setRequestUrl(to.fullPath);
                vm.getBooks(url, vm.pageNum, vm.pageSize);
            });
        },
        
        beforeRouteUpdate(to) {
            let url = this.setRequestUrl(to.fullPath);
            this.getBooks(url, this.pageNum, this.pageSize);
            return true;
        },

        components: {
            ...
        },

        methods: {
            getBooks(url, pageNum, pageSize) {
                this.message = '';
                //get 请求增加两个参数pageNum和pageSize
                this.axios.get(url, {params: { pageNum, pageSize } })
                    .then(response => {
                        if(response.data.code == 200) {
                            this.loading = false;
                            this.books = response.data.data;
                            this.total = response.data.total;
                            if(this.books.length === 0) {
                                if(this.$route.name === "category)
                                    this.message = "当前分类下没有图书!"
                                else
                                    this.message = "没有搜索到匹配的图书!"
                            }
                        }
                    })
                    .catch(error => alert(error));
            },
            //动态设置服务端数据接口的请求URL
            setRequestUrl(path) {
                let url = path;
                if(path.indexOf("/category") != -1) {
                    url = "/book" + url + "/page";
                }
                return url;
            },
            //当修改了每页显示的条数时,重新请求数据
            handleSizeChange(selectedSize) {
                this.pageSize = selectedSize;
                let url = this.setRequestUrl(this.$route.fullPath);
                this.getBooks(url, this.pageNum, this.pageSize);
            },
            //当用户切换而选择了某一页时,重新请求数据
            handleCurrentChange(currentPage) {
                this.pageNum = currentPage
                let url = this.setRequestUrl(this.$route.fullPath);
                this.getBooks(url, this.pageNum, this.pageSize);
            },
        }
    }
</script>
```

## 17.13 会话跟踪

传统Web项目的会话跟踪是采用服务器端的Session实现的.当客户初次访问资源时,Web服务器为该客户创建一个Session对象,并分配一个唯一个的Session ID,将其作为Cookie(或者作为URL的一部分,利用URL重写机制)发送给浏览器,浏览器在内存中保存这个会话Cookie.当客户再次发送HTTP请求时,浏览器将Cookie随请求一起发送,服务器程序从请求对象中读取Session ID,然后根据Session ID找到对应的Session对象,从而得到客户的状态信息。

传统Web项目的前端和后端是在一起的,所以会话跟踪实现起来很简单.当采用前后端分离的开发方式时,前后端分别部署在不同的服务器上.由于是跨域访问,前端向后端发起的每次请求都是一个新的请求,在这种情况下,如果还想采用Session跟踪会话,就需要前后端都做一些配置。

对于前端而言,配置很简单,只需要在main.js文件中添加下面这句代码即可。
```
axios.defaults.withCredentials = true
```
这会让前端的每次请求带上用于跟踪用户会话的Cookie报头。

服务器端也比较简单,只需要在响应报头中带上Access-Control-Allow-Origin和Access-Control-Allow-Credentials这两个报头.前者必须指定明确的访问源(即前端项目部署的服务器端域名或IP),不能使用星号(*);后者设置为true即可.代码如下:
```
response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
response.setHeader("Access-Control-Allow-Credentials", "true");
```
服务器端可以通过拦截器的方式来统一设置这两个响应报头。

目前还有一种流行的跟踪用户会话的方式就是使用一个自定义的token,服务器端根据某种算法生成唯一的token,必要时可以采用公私钥的方式来加密token,然后将这个token放到响应报头中发送到前端,前端在每次请求时在请求报头中带上这个token,以便服务器端可以获取该token进行权限验证以及管理用户的状态.在前端可以利用axios的拦截器(参见15.8节)进行token的统一处理,包括结合Vuex进行token的状态管理。

## 17.14 项目调试

在项目开发过程中,不可避免会遇到一些Bug,即使再有经验的开发人员也无法完全通过代码走读的方式来解决全部Bug,这就需要对程序进行调试,设置断点跟踪代码的执行,最终找到问题所在并解决它。

前端程序的调试不如某些高级语言的集成开发环境提供的调试那么容易,但利用一些扩展插件也能实现在编辑器环境和浏览器环境中进行调试。

### 17.14.1 在Visual Studio Code中调试

在vscode左侧的活动栏单击"扩展"图标按钮.在搜索框中输入debugger,在出现的插件中选中Debugger for chrome或Debugger for Firefox.按需安装。

修改Webpack的配置以构建source map,这是为了让调试器能够将压缩文件中的代码映射回原始文件中的位置,这可以确保即使在Webpack优化了应用中的资源后也可以调试应用程序。

编辑项目根目录下的vue.config.js文件,添加如下代码:
```
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    ...
}
```
单击左侧活动栏中的"运行"图标按钮,然后单击上方的齿轮图标,选择chrome环境.选中chrome后,会生成一个launch.json文件,代码如下:
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "vue.js: chrome",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "breakOnLoad": true,
            "sourceMapPathOverrides": {
                "webpack:///./src/*": "${webRoot}/*"
            }
        }
    ]
}
```
Firefox环境的配置如下:
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "firefox",
            "request": "launch",
            "name": "vue.js: firefox",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/ }]
        }
    ]
}
```
配置好后,开始调试程序.打开一个组件,如BookCommentList组件,在data上设置一个断点,在终端窗口运行项目,然后单击左侧活动栏上的"运行"图标按钮,切换到调试视图,选择vuejs:chrome或vuejs:firefox,按F5键运行或者左侧绿色的运行按钮。

打开浏览器窗口访问本项目,在图书详情页查看图书评论,跳转到设置的断点处.可以使用上方的调试工具栏单步执行,跟踪代码的执行情况。

### 17.14.2 在浏览器中调试

在浏览器中调试Vue程序利用2.3节介绍的vue-devtools工具完成的.首先确保该扩展程序已经安装并启用,在浏览器窗口中按F12键调出开发者工具窗口,选择Vue选项。

## 17.15 小结











