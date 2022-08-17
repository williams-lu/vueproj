# 16章 状态管理--Vuex

第10章介绍了父子组件之间的通信方式,父组件通过prop向子组件传递数据,子组件通过自定义事件向父组件传递数据。然而,在实际项目中,经常会遇到多个组件需要访问同一组数据的情况,且都需要根据数据的变化做出响应,而这些组件之间可能并不是父子组件这种简单的关系。在这种情况下,就需要一个全局的状态管理方案.在Vue开发中,官方推荐使用Vuex。

Vuex是一个专门为Vue.js应用程序开发的状态管理模式。它采用集中式存储来管理应用程序中所有组件的状态,并以相应的规则保证状态以一种可预测的方式发生变化。Vuex也被集成到了Vue的官方调试工具vue-devtools中,提供了诸如另配置的time-travel调试\状态快照导入/导出等高级调试功能。

![](images/vuex%E5%B7%A5%E4%BD%9C%E5%8E%9F%E7%90%86%E5%9B%BE.png)

## 16.1 简单的状态管理

Vue.js应用程序数据的真实来源是响应式数据对象,组件实例只是代理对它的访问,这一点经常被忽视。因此如果有一个需要被多个实例共享,可以使用reactive()方法使一个对象成为响应式数据。
```
const sourceOfTruth = Vue.reactive({
    message: 'Hello'
})

const appA = Vue.createApp({
    data() {
        return  sourceOfTruth
    }
}).mount('#app-a')

const appB = Vue.createApp({
    data() {
        return sourceOfTruth
    }
}).mount('#app-b')

<div id="app-a">App A: {{ message }}</div>

<div id="app-b">App B: {{ message }}</div>
```

现在每当sourceOfTruth发生变化时,appA和appB都会自动更新它们的视图。但现在有一个问题,因为sourceOfTruth是一个单一的数据源,任意一个app都可以随时更改数据,而不会留下任何痕迹,这使得我们很难调试应用程序。例如:
```
const appB = Vue.createApp({
    data() {
        return sourceOfTruth
    },
    mounted() {
        sourceOfTruth.message = 'Goodbye' //两个app都将渲染Goodbye信息
    }
}).mount('#app-b)
```
为了解决这个问题,可以采用store模式。代码如下所示:
```
const store = {
    debug: true,

    state: Vue.reactive({
        message: 'Hello!'
    }),
    
    setMessageAction(newValue) {
        if (this.debug) {
            console.log('setMessageAction triggered with', newValue)
        }
        this.state.message = newValue
    },

    clearMessageAction() {
        if (this.debug) {
            console.log('clearMessageAction triggered')
        }

        this.state.message = ''
    }
}
```
现在所有改变存储状态的操作都放在store内。这种集中式的状态管理让我们更容易理解什么类型的改变可能发生,以及它们是如何触发的。当出现问题时,还会有一个导致错误发生的日志。

对于应用程序程序实例或组件,它们仍然可以拥有和管理自己的私有状态。代码示例:
```
<div id="app-a">{{ shareState.message }}</div>
<div id="app-b">{{ shareState.message }}</div>

const appA = Vue.createApp({
    data() {
        return {
            privateState: {},
            shareState: store.state
        }
    },
    mounted() {
        store.setMessageAction('Goodbye!')
    }
}).mount('#app-a')

const appB = Vue.createApp({
    data() {
        return {
            privateState: {}
            shareState: store.state
        }
    }
}).mount('#app-b')
```

需要注意的是,不要在操作中替换原始对象,组件和store需要共享对同一对象的引用,以便观察到变化。

作为一种约定,组件永远不允许直接改变属于store的状态,而应该通过分发事件通知store执行操作。这种约定的好处是,可以记录store中发生的所有状态变化,并实现高级调试助手,如变化日志、快照和历史重放/时间旅行。

## 16.2 安装Vuex

可以使用CDN方式安装。代码如下：
```
<!-- 引用最新版 -->
<script src="https://unpkg.com/vuex@next"></script>
<!-- 引用指定版本 -->
<script src="https://unpkg.com/vuex@4.0.0-rc.1"></script>
```

如果使用模块化开发，则使用npm安装方式。执行以下命令安装：
```
npm install vuex@next --save  
或者
yarn add vuex@next --save
```
在Vue3.0的脚手架项目中使用，在main.js文件导入createStore，并调用方法创建一个store实例，之后使用Vue.js应用程序实例的use()方法将该实例作为插件安装。
```
import { createApp } from 'vue'
import { createStore } from 'vuex'

//创建新的store实例
const store = createStore({
    state() {
        return {
            count: 1
        }
    }
})
const app = createApp({ /* 根组件 */ })

将store实例作为插件安装
app.use(store)
```

## 16.3 基本用法

Vuex使用单一状态树，也就是说，用一个对象包含了所有应用层级的状态，作为唯一数据源（single source of truth）而存在。每一个Vuex应用的核心就是store，store可以理解为保存应用程序状态的容器。store与普通的全局对象的区别有以下两点。

(1)Vuex的状态存储是响应式的。当Vue组件从store中检索状态的时候，如果store中的状态发生变化，那么组件也会相应地得到高效更新。

(2)不能直接改变store中的状态。改变store中的状态的唯一途径就是显示地提交mutation。这个可以确保每个状态更改都留下可跟踪的记录，从而能够启用一些工具来帮助我们更好理解应用。

接下来通过一个购物车的实例学习Vuex的使用，按照以下步骤创建脚手架项目，安装Vuex并进行基础配置。

(1)使用Vue CLI创建一个Vue3.0的脚手架项目，项目为statemanage，直接选择Default(Vue3.0 Preview)([Vue3] babel,eslint),开始项目创建。

(2)启动VScode，打开项目所在文件夹，为项目安装Vuex。选择[终端]-[新建终端]选项，在弹出的终端窗口输入以下命令安装Vuex。
```
npm install vuex@next --save
```
(3)在实际项目开发中，我们通常是把状态管理相关文件单独放在一个文件夹下，以集中管理和配置。在src目录下新建一个文件夹store，在该文件夹下新建一个index.js文件。

下面将按步骤编辑文件：

store/index.js
```
import { createStore } from 'vuex'

const store = createStore({
    //状态数据通过state()函数返回
    state() {
        return {
        }
    }
})

export default store
```
(4)在程序入口main.js文件中使用store实例，从而在整个应用程序中应用Vuex的状态管理功能。

main.js
```
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

createApp(App).use(store).mount('#app')
```
首先将购物车的商品数据放在store中统一管理。在实际项目中，购物车中的商品数据是用户在商品页面添加商品保存的，而所有的商品信息都是从后端服务器得到的。简单起见，在前端硬编码一些商品数据，作为购物车中用户选购的商品。在src目录下新建一个文件夹data，在该文件夹下新建一个book.js文件。

data/books.js
```
export default [
    {
        id: 1,
        title: 'Java教程',
        price: 188,
        count: 1,
    },
        {
        id: 2,
        title: 'C++教程',
        price: 144,
        count: 1,
    },
        {
        id: 3,
        title: 'Python教程',
        price: 166,
        count: 1,
    },
        {
        id: 4,
        title: 'Perl教程',
        price: 133,
        count: 1,
    },
]
```
在books模块中导出一个图书商品的数组，将该数组作为store中状态数据的来源。编辑store目录下的index.js文件。

store/index.js
```
import { createStore } from 'vuex'
import books from '@/data/books.js'

const store = createStore({
    state() {
        return {
            items: books   //使用导入的books对items进行初始化
        }
    }
})

export default store
```
现在可以使用store.state.items访问商品数据。前面在main.js中已经引入了store实例，该store实例会被注入根组件下的所有子组件中，因此在组件中，就可以通过this.$store访问store。如果在组件中要展示store中的状态，应该使用计算属性返回store的状态。
```
computed: {
    books() {
        return this.$store.state.items;
    }
}
```
之后在组件的模板中就可以直接使用boobs。当store中的items发生改变时，组件内的计算属性books也会同步发生改变。
```
methods: {
    addCart() {
        this.$store.state.items.push({ ... });    //不要这么做
    }
}
```
既然选择了Vuex作为应用的状态管理方案，那么就应该遵照Vuex的要求：通过提交mutation()函数更改store中的状态。在严格模式下，如果store中的状态改变不是由mutation()函数引起的，则会抛开错误，而且如果直接修改store中的状态，Vue的调试工具无法跟踪状态的改变。在开发阶段，可以启用严格模式，以避免直接的状态修改，在创建store时，传入strict: true。
```
const store = createStore({
    //....
    strict: true
})
```
Vuex中的mutation()函数非常类似于事件：每个mutation()函数都有一个字符串的事件类型和一个处理器函数。这个处理器函数就是实际进行状态更改的地方，它接收state作为第一个参数。
```
const store = createStore({
    state() {
        return {
            count: 1
        }
    },

    //mutations选项中定义修改状态的方法
    //这些方法接收state作为第1个参数
    mutations: { 
        increment (state) {
            state.count++
        }
    }
})
```
我们不能直接调用一个mutation()处理函数，mutations选项更像是事件注册，当触发一个类型为increment的mutation时，调用此函数。要调用一个mutation()处理器函数，需要用它的类型调用store.commit()方法。示例：
```
store.commit('increment')
```
实际上，提交时指定的mutation的类型就是我们在mutation选项中定义的mutation()处理器函数的名字。

在使用store.commit()方法提交mutation()时，还可以传入额外的参数，即mutation()的载荷(payload)。代码如下所示：
```
// ...
mutations: {
    increment (state, n) {
        state.count += n
    }
}

store.commit('increment', 10)
```
载荷也可以是一个对象。代码如下：
```
//...
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}

store.commit('increment', {
    amount: 10
})
```
提交mutation时，也可以使用包含type属性的对象，这样传一个参数就可以了。代码如下所示：
```
store.commit({
    type: 'increment',
    amount: 10,
})
```
当使用对象风格提交时，整个对象将作为载荷传给mutation函数，因此处理器保持不变。代码如下：
```
mutations: {
    increment (state, payload) {
        state.count += payload.amount
    }
}
```
还可以用常量替代mutation的类型。可以把常量放到一个单独的JS文件中，有助于项目团队对store中所包含的mutation一目了然。例如：
```
//mutation-types.js
export const SOME_MUTATION = 'SOME_MUTATION'

//store.js
import { createStore } from 'vuex'
import { SOME_MUTATION } from './mutation-types'

const store = createStore({
    state: { ... },
    mutations: {
        //可以使用ES2015的计算属性命名功能来使用一个常量作为函数名
        [SOME_MUTATION] (state) {
            // mutate状态
        }
    }
})
```
接下来，在store中定义一个mutation，通过提交该mutation向购物车中添加商品。修改store目录下的index.js文件。修改的代码如下所示：

store/index.js
```
import { createStore } from 'vuex'
import books from '@/data/books.js'

const store = createStore({
    state() {
        return {
            items: books      //使用导入的books对items进行初始化
        }
    }，
    mutations: {
        pushItemToCart (state, book) {
            state.items.push(book);
        }
    }
})

export default store
```
购物车组件。在components目录下新建Cart.vue。代码如下所示：

Cart.vue
```
<template>
    <div>
        <table>
            <tr>
                <td>商品编号</td>
                <td><input type="text" v-model.number="id"></td>
            </tr>
            <tr>
                <td>商品名称</td>
                <td><input type="text" v-model="title"></td>
            </tr>
            <tr>
                <td>商品价格</td>
                <td><input type="text" v-model="price"></td>
            </tr>
            <tr>
                <td colspan="2"><button @click="addCart">加入购物车</button></td>
            </tr>
        </table>
        <table>
            <thead>
                <tr>
                    <th>编号</th>
                    <th>商品名称</th>
                    <th>价格</th>
                    <th>数量</th>
                    <th>金额</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="book in books" :key="book.id">
                    <td>{{ book.id }}</td>
                    <td>{{ book.title }}</td>
                    <td>{{ book.price }}</td>
                    <td>
                        <button>-</button>
                        {{ book.count }}
                        <button>+</button>
                    </td>
                    <td>金额</td>
                    <td><button>删除</button></td>
                </tr>
            </tbody>
        </table>
        <span>总价：￥0.00</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id: null,
            title: '',
            price: '',
            quantity: 1
        }
    },
    computed: {
        books() {
            return this.$store.state.items;
        }
    },
    methods: {
        addCart() {
            this.$store.commit('pushItemToCart', {
                id: this.id,
                title: this.title,
                price: this.price,
                count: this.quantity,
            })
            this.id = '';
            this.title = '';
            this.price = '';
        }
    }
};
</script>

...  //省略了CSS样式代码
```
简单起见，我们使用表格对购物车中的商品项进行布局。

最后在App.vue组件中删除HelloWord组件，使用Cart组件。代码如下：

App.vue
```
<template>
    <Cart />
</template>

<script>
import Cart from './component/Cart.vue'

export default {
    name: 'App',
    components: {
        Cart
    }
}
</script>

...  //省略了CSS样式代码
```
打开终端窗口，执行npm run serve命令，打开浏览器，访问http://localhost:8080/

## 16.4 mapMutation

继续完善购物车程序，为购物车添加删除商品功能。删除商品同样要修改store中保存的购物车商品数据，因此继续在mutations选项中定义一个deleteItem mutation。编辑store目录下的index.js文件，修改后的代码。
```
const store = createStore({
    ...,

    mutations: {
        pushItemToCart (state, book) {
            state.items.push(book);
        },
        deleteItem (state, id) {
            //根据提交的id载荷，查找是否存在相同id的商品，返回商品的索引
            let index = state.items.findIndex(item => item.id === id);
            if(index >= 0) {
                state.items.splice(index, 1);
            }
        }
    }
})

export default store
```
编辑Cart.vue,为“删除”按钮添加click事件处理，提交deleteItem mutation。代码如下所示：
```
<td><button @click="$store.commit('deleteItem', book.id)">删除</button></td>
```
再次运行项目，单击“删除”按钮，可以看到购物车中的商品项被成功删除。

如果组件中需要提交的mutation较多，使用this.$store.commit()方法来提交就会很烦琐，为了简化mutation的提交，可以使用mapMutations()辅助函数将组件中的方法映射为store.commit()调用。

代码如下：
```
import { mapMutations } from 'vuex'
methods: mapMutations({
    //将this.increment()映射为this.$store.commit('increment')
    'increment',

    //将this.incrementBy(amount)映射为this.$store.commit('incrementBy', amount)
    'incrementBy'
})
```
除了使用字符串数组外，mapMutations()函数的参数也可以是一个对象。代码如下所示：
```
import { mapMutation } from 'vuex'
methods: mapMutations({
    //将this.add()映射为this.$store.commit('increment')
    add: 'increment'
})
```
在大多数情况下，组件还有自己的方法，在这种情况下，可以使用ES6的展开运算符提取mapMutations()函数返回的对象属性，复制到methods选项中。代码如下所示：
```
import { mapMutations } from 'vuex'

export default {
    //...
    methods: {
        ...mapMutations([
            //将this.increment()映射为this.$store.commit('increment')
            'increment',

            //mapMutations也可以载荷
            //将this.incrementBy(amount)映射为this.$store.commit('incrementBy', amount)
            'incrementBy'
        ]),
        ...mapMutations({
            //将this.add()映射为this.$store.commit('increment')
            add: 'increment'
        })
    }
}
```
修改Cart.vue,使用mapMutations()辅助函数简化mutation的提交。代码如例所示：

Cart.vue
```
...
<td><button @click="deleteItem(book.id)">删除</button></td>

    ...
    import { mapMutations } from 'vuex'

    ...
    methods: {
        ...mapMutations({
            addItemToCart: 'pushItemToCart'
        }),
        ...mapMutations({
            'deleteItem'
        }),
        addCart() {
            this.addItemToCart({
                id: this.id,
                title: this.title,
                price: this.price,
                count: this.quantity,
            })
            this.id = '';
            this.title = '';
            this.price = '';
        }
    }
```
代码中为了演示mapMutations()辅助函数的用法，采用了两种方式映射mutation,实际开发中当然不必如此，采用统一的映射方式更有助于代码的维护和修改。

## 16.5 mapState

当一个组件需要使用多个store状态属性时，将这些状态都声明为计算机属性就会有些重复和冗余。为了解决这个问题，可以使用mapState()辅助函数生成计算属性。例如在store中定义了两个状态。代码如下所示：
```
const store = createStore({
    state() {
        return {
            count: 0,
            message: 'Vue不难呀'
        }
    },
    ...
})
```
在组件中使用mapState()辅助函数生成计算属性。代码如下所示：
```
import { mapState } from 'vuex'

export default {
    //...
    computed: mapState({
        count: 'count',
        msg: 'message',
    })
}
```
可以看到不管是使用普通函数，还是箭头函数，都没有直接使用字符串方便。但如果在计算属性中还要访问组件内的数据属性，那么就只能使用普通函数的方式。代码如下：
```
import { mapState } from 'vuex'

export default {
    data() {
        return {
            price: 99
        }
    },
    computed: mapState({
        totalPrice(state) {
            return this.price * state.count;
        }
    })
}
```
这里不能使用箭头函数

如果计算属性的名字和store中状态属性的名字相同，那么还可以进一步简化，直接给mapState()函数传递一个字符串数组即可。代码如下：
```
computed: mapState([
    //映射 this.count为store.state.count
    'count',
    //映射 this.message为store.state.message
    'message'
])
```
与mapMutations()一样，mapState()函数返回的也是一个对象，因此可以使用展开运算符将它和组件内的本地计算属性结合一起使用。代码如下：
```
computed: {
    localComputed() { /*....*/ },
    //使用对象展开运算符将此对象混入外部对象中
    ...mapState({
        //...
    })
}
```
接下来修改Cart.vue,使用mapState()辅助函数生成books计算属性。修改的代码如下：
```
import { mapMutations, mapState } from 'vuex'
...
computed: {
    ...mapState({
        books: 'items'
    })
},
```

## 16.6 getter

假如在store的状态中定义了一个图书数组。代码如下：
```
const store = createState({
    state() {
        return {
            books: [
                { id: 1, title: 'vue教程', isSold: false },
                { id: 2, title: 'C++教程', isSold: true},
                { id: 3, title: 'Python教程', isSold: true },
            ]
        }
    },
    ...
})
```
在组件内需要得到正在销售的图书，于是定义一个计算属性sellingBooks，对state中的books进行过滤。代码如下：
```
computed: {
    sellingBooks() {
        return this.$store.state.books.filter(book => book.isSold === true);
    }
}
```
如果多个组件都需要用到sellingBooks属性，那么应该怎么办？

Vuex允许我们在store中定义getters(可以认为是store的计算属性)。与计算属性一样，getter的返回值会根据它的依赖项被缓存起来，且只有在它的依赖项发生改变时才会重新计算。

getter接收state作为其第1个参数。代码如下：
```
const store = createStore({
    state() {
        return {
            books: [
                { id: 1, title: 'vue教程', isSold: false },
                { id: 2, title: 'C++教程', isSold: true},
                { id: 3, title: 'Python教程', isSold: true },
            ]
        }
    },
    getters: {
        sellingBooks: state => state.books.filter(book => book.isSold === true)
    }
})
```
我们定义的getter将作为store.getters对象的属性来访问。代码如下：
```
<ul>
    <li v-for="book in this.$store.getters.sellingBooks" :key="book.id">
        {{ book.title }}
    </li>
</ul>    
```
getter也可以接收其他getter作为第2个参数。代码如下：
```
getters: {
    sellingBooks: state => state.books.filter(book => book.isSold === true),
    sellingBooksCount: (state, getters) => {
        return getters.sellingBooks.length
    }
}
```
在组件内，要简化getter的调用，同样可以使用计算属性。代码如下：
```
computed: {
    sellingBooks() {
        return this.$store.getters.sellingBooks;
    },
    sellingBooksCount() {
        return this.$store.getters.sellingBooksCount;
    }
}
```
要注意,作为属性访问的getter作为Vue的响应式系统的一部分被缓存.

如果想简化上述getter在计算属性中的访问形式,则可以使用mapGetters()辅助函数,这个辅助函数的用法和mapMutations(),mapState()类似.代码如下:
```
computed: {
    //使用对象展开运算符将getter混入computed中
    //传递数组作为参数
    ...mapGetters({
        'sellingBooks',
        'sellingBooksCount',
        //...
    }),
    //传递对象作为参数
    ...mapGetters({
        //将this.booksCount 映射为 this.$store.getters.sellingBooksCount
        booksCount: 'sellingBooksCount'
    })
}
```
getter还有更灵活的用法,通过让getter返回一个函数来实现给getter传参.例如, 下面的getter根据图书id查找图书对象.
```
getters: {
    ...
    getBookById: function(state) {
        return function(id) {
            return state.books.find(book => book.id === id);
        }
    }
}
```
可以使用箭头函数简化上述代码.如下:
```
getters: {
    ...
    getBookById: state => id => state.books.find(book => book.id === id);
}
```
下面在组件模板中的调用将返回{"id": 2,"title":"C++教程","isSold": true}
```
<p>{{ $store.getters.getBookById(2) }}</p>
```
下面完成购物车中单项商品价格和所有商品总价的计算,单项商品价格是商品的价格乘以总量,总价是单项商品价格相加的结果.由于购物车中的商品是存储在store中的,因此单项商品价格和所有商品总价的计算应该通过getter完成,而不是直接在组件内定义计算属性来完成.

编辑store目录下的index.js文件,添加计算单项商品价格和所有商品总价的getter.代码如下:

store/index.js
```
const store = createStore({
    ...,
    getters: {
        cartItemPrice(state) {
            return function(id) {
                let item = state.items.find(item => item.id === id);
                if(item) {
                    return item.price * item.count;
                }
            }
        },
        cartTotalPrice(state) {
            return state.items.reduce((total, item) => {
                return total + item.price * item.count;
            }, 0);
        }
    }
})
```
如果getter要接收参数,则需要getter返回一个函数来实现给getter传参.

编辑Cart.vue,在computed选项中使用mapGetters()映射上述两个getter, 然后修改模板代码,完善单项商品价格计算和购物车中所有商品总价的计算.代码如下:


Cart.vue
```
...
<table>
    <thead>
        <tr>
            <th>编号</th>
            <th>商品名称</th>
            <th>价格</th>
            <th>数量</th>
            <th>金额</th>
            <th>操作</th>
        </tr>
    </thead>
    <tbody>
        <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.price }}</td>
            <td>
                <button>-</button>
                {{ book.count }}
                <button>+</button>
            </td>
            <td>{{ itemPrice(book.id) }}</td>
            <td><button @click="deleteItem(book.id)">删除</button></td>
        </tr>
    </tbody>
</table>
<span>总价: ${{ totalPrice }}</span>

...
import { mapMutations, mapState, mapGetters } from 'vuex'

computed: {
    ...mapState({
        books: 'items'
    }),
    ...mapGetters({
        itemPrice: 'cartItemPrice',
        totalPrice: 'cartTotalPrice',
    })
},
```
下面实物购物车中商品数量加1和减1的功能,这个功能的实现和getter无关,因为要修改store中所存储的商品的数量,因此是通过mutation实现商品数量的变化.

编辑store目录下的index.js文件,修改后的代码如下所示:

store/index.js
```
...
mutations: {
    ...
    incrementItemCount(state, {id, count}) {
        let item = state.items.find(item => item.id === id);
        if(item) {
            item.count += count;  //如果count为1,则加1;如果count为-1,则减1
        }
    }
},
```
编辑Cart.vue,在methods选项中使用mapMutations()辅助函数映射incrementItemCount,并为减号按钮和加号按钮添加click事件的处理代码.修改后的代码如下所示:

Cart.vue
```
<td>
    <button :disabled="book.count===0" @click="increment({id: book.id, count: -1})">-</button>
    {{ book.count }}
    <button @click="increment({id: book.id, count: 1})">+</button>
</td>

...

methods: {
    ...mapMutations({
        addItemToCart: 'pushItemToCart',
        increment: 'incrementItemCount'
    }),
    ...mapMutations([
        'deleteItem'
    ]),
    addCart() {
        ...
    }
}
```
运行项目,访问http://localhost:8080/, 随意增加某项商品的数量

## 16.7 action

在定义mutation时,一条重要的原则就是mutation必须是同步函数.换句话,在mutation()处理器函数中,不能存在异步调用.例如:
```
mutations: {
    someMutation (state) {
        api.callAsyncMethod(() => {
            state.count++
        })
    }
}
```
在someMutation()函数中调用api.callAsyncMethod()方法,传入了一个回调函数,这是一个异步调用.记住,不要这么做,因为这会让调试变得困难.假设正在调试应用程序并查看devtool中的mutation日志,对于每个记录的mutation,devtool都需要捕捉到前一状态和后一状态的快照.然而,在上面的例子中,mutation中的api.callAsyncMethod()方法中的异步回调让这不可能完成.因为当mutation被提交的时候,回调函数还没有被调用,devtool也无法知道回调函数什么时候真正被调用.实质上,任何在回调函数中执行的状态的改变都是不可追踪的.

如果确实需要执行异步操作,那么应该使用action.action类似于mutation,不同之处在于:

+ action提交的是mutation,而不是直接变更状态.
+ action可以包含任意异步操作.

一个简单的action如下所示:
```
const store = createStore({
    state() {
        return {
            count: 0
        }
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }
})
```
action处理函数接收一个与store实例具有相同方法和属性的context对象,因此可以利用该对象调用commit()方法提交mutation,或者通过context.state和context.getters访问state和getter.甚至可以用context.dispatch()调用其他的action.要注意的是,context对象并不是store实例本身.

如果在action中需要多次调用commmit, 则可以考虑使用ES6中的结构语法简化代码.代码如下:
```
actions: {
    increment ({ commit }) {
        commit('increment')
    }
}
```

### 16.7.1 分发action

action通过store.dispatch()方法分发.代码如下:
```
store.dispatch('increment')
```
action和mutation看似没什么区别,实际上,它们之间最大的区别就是action中可以包含异步操作.例如:
```
actions: {
    incrementAsync ({ commit }) {
        setTimeout(() => {
            commit('increment')
        }, 1000)
    }
}
```
action同样支持以载荷和对象方式进行分发.代码如下:
```
//载荷是一个简单值
store.dispatch('incrementAsync', 10)

//载荷是一个对象
store.dispatch('incrementAsync', {
    amount: 10
})

//直接传递一个对象进行分发
store.dispatch({
    type: 'incrementAsync',
    amount: 10
})
```
一个实际的例子是购物车结算操作,该操作涉及调用一个异步API和提交多个mutation.代码如下:
```
actions: {
    chechout ({ commit, state }, produces) {
        //保存购物车中当前的商品项
        const savedCartItems = [...state.cart.added]
        //发出结算请求, 并乐观地清空购物车
        commit(types.CHECKOUT_REQUEST)
        //shop.buyProducts()方法接收一个成功回调和一个失败回调
        shop.buyProducts(
            products,
            //处理成功
            () => commit(types.CHECKOUT_SUCCESS),
            //处理失败
            () => commit(types.CHECKOUT_FAILURE, savedCartItems)
        )
    }
}
```
checkout执行一个异步操作流,并通过提交这些操作记录action的副作用(状态更改).

### 16.7.2 在组件中分发action

在组件中可以使用this.$store.dispatch('XXX')方法分发action,或者使用mapActions()辅助函数将组件的方法映射为store.dispatch调用.代码如下:

store.js
```
const store = createStore({
    state() {
        return {
            conunt: 0
        }
    },
    mutations: {
        increment (state) {
            state.count++;
        },
        incrementBy (state, n) {
            state.count += n;
        },
    },
    actions: {
        increment ({ commit }) {
            commit('increment');
        },
        incrementBy ({ commit }, n) {
            commit('incrementBy', n);
        }
    }
})
```
组件
```
<template>
    `<button @click="incrementBy(10)">
        You clicked me {{ count }} times.
    </button>`
</template>

import { mapActions } from 'vuex'
export default {
    //...
    methods: {
        ...mapActions([
            //将this.increment()映射为this.$store.dispatch('increment')
            'increment',
            //mapActions也支持载荷
            //将this.increment(n)映射为this.$store.dispatch('incrementBy', n)
            'incrementBy',
        ])
        ...mapActions([
            //将this.add()映射为this.$store.dispatch('increment')
            add: 'increment',
        ])
    }
}
```

### 16.7.3 组合action

action通常是异步的,那么如何知道action何时完成?更重要的是,我们如何才能组合多个action来处理更复杂的异步流程呢?

首先,要知道store.dispatch()方法可以处理被触发的action的处理函数返回的Promise,并且store.dispatch()方法仍旧返回Promise.例如:
```
actions: {
    actionA ({ commit }) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                commit('someMutation')
                resolve()
            }, 1000)
        })
    }
}
```
现在可以:
```
store.dispatch('actionA').then(() => {
    //....
})
```
另外一个action中也可以:
```
actions: {
    //...
    actionB ({ dispatch, commit }) {
        return dispatch('actionA').then(() => {
            commit('someOtherMutation')
        })
    }
}
```
最后,如果使用store/await,则可以按以下方式组合action.
```
//假设getData()和getOtherData()返回的是Promise
actions: {
    async actionA ({ commit }) {
        commit('gotData', await getData())
    },
    async actionB ({ dispatch, commit }) {
        await dispatch('actionA')  //等待actionA完成
        commit('gotOtherData', await getOtherData())
    }
}
```
一个store.dispatch()方法在不同模块中可以触发多个action处理函数.在这种情况下,只有当所有触发的处理函数完成后,返回的Promise才会执行.

下面给出一个简单的例子,如何组合action来处理异步流程.代码没有采用单文件组件,而是在HTML页面中直接编写,如下所示:

ComposingActions.html
```
<div id="app">
    <book></book>
</div>

<script src="http://unpkg.com/vue@next"></script>
<script src="http://unpkg.com/vuex@next"></script>
<script>
    const app = Vue.createApp({});
    const store = Vuex.createStore({
        state() {
            return {
                book: {
                    title: "C++教程",
                    price: 168,
                    quantity: 1,
                },
                totalPrice: 0
            }
        },
        mutations: {
            //增加图书数量
            incrementQuantity (state, quantity) {
                state.book.quantity += quantity;
            },
            //计算图书总价
            calculateTotalPrice(state) {
                state.totalPrice = state.book.price * state.book.quantity;
            }
        },
        actions: {
            incrementQuantity({commit}, n) {
                //返回一个Promise
                return new Promise((resolve, reject) => {
                    //模拟异步操作
                    setTimeout(() => {
                        //提交mutation
                        commit('incrementQuantity', n)
                        resolve()
                    })
                }, 1000)
            }
        },
        updateBook({ dispatch, commit }, n) {
            // 调用dispatch()方法触发incrementQuantity action
            // incrementQuantity action返回一个Promise
            // dispatch对其进行处理,仍旧返回Promise
            // 因此可以继续调用then()方法
            return dispatch('incrementQuantity', n).then(() => {
                //提交mutation
                commit('calculateTotalPrice');
            })
        }
    });

    app.component('book', {
        data() {
            return {
                quantity: 1
            }
        },
        computed: {
            ...Vuex.mapState([
                'book',
                'totalPrice',
            ])
        },
        methods: {
            ...Vuex.mapAction([
                'updateBook',
            ]),
            addQuantity(){
                this.updateBook(this.quantity)
            }
        },
        template: 
            `<div>
                <p>书名: {{ book.title }}</p>
                <p>价格: {{ book.price }}</p>
                <p>数量: {{ book.quantity }}</p>
                <p>总价: {{ totalPrice }}</p>
                <p>
                    <input type="text" v-model.number="quantity">
                    <button @click="addQuantity">增加数量</button>
                </p>
            <div> `
    });

    app.use(store).mount('#app');
</script>
```
我们在store中定义了两个状态数据:book对象和totalPrice,并为修改它们的状态分别定义了mutation:incrementQuantity和calculateTotalPrice,之后定义了两个action:incrementQuantity和updateBook,前者模拟异步操作提交incrementQuantity mutation修改图书数量;后者调用dispatch()方法触发前者的调用,在前者成功完成后,提交calculateTotalPrice mutation, 计算图书的总价.