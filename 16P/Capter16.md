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