# 第17章 网上商城项目



## 17.1 脚手架项目搭建




## 17.2 安装和配置axios




## 17.3 首页




### 17.3.1 页面头部组件

**1. 头部搜索框组件**


**2. 头部购物车组件**

**3. 头部组件**



### 17.3.2 菜单组件


### 17.3.3 图书分类组件


### 17.3.4 广告图片轮播组件


### 17.3.5 热门推荐组件


### 17.3.6 新书上市组件


### 17.3.7 首页组件


## 17.4 商品列表

### 17.4.1 商品列表项组件

### 17.4.2 商品列表组件

## 17.5 分类商品和搜索结果页面

### 17.5.1 Loading组件

### 17.5.2 Books组件

## 17.6 新书页面

## 17.7 图书详情页面

### 17.7.1 加减按钮组件

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


**4. 图书问答组件**

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











