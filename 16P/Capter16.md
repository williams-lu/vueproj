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

