# 第11章 组合API

组合（Composition）API是在Vue3.0中引入的，它是一组附加的、基于函数的API，允许灵活地组合组件逻辑。

组合API并没有引入新的概念，更多地是将Vue的核心功能（如创建和观察响应状态）公开为独立的函数，以此来代替Vue2.x中的表达组件逻辑的选项。

## 11.1 为什么引入组合API

使用Vue构建中小型应用程序失很容易的，但随着Vue逐渐被开发人员认可，许多用户开始使用Vue构建大型项目，这些项目由一个多名开发人员的团队在很长一段时间内迭代和维护，在一些项目中遇到了Vue2.x所要求的编程模型的限制，遇到的问题可以归纳为以下两类。
<p style="text-indent:2em">(1)随着时间的推移，复杂组件的代码越来越难以理解，尤其是当开发人员在阅读不是自己编写的代码时。根本原因是Vue2.x的现有API强制按选项组织代码，但在某些情况下，按逻辑关注点组织代码更有意义。</p>
<p style="text-indent:2em">(2)缺乏在多个组织之间提取和重用逻辑的干净且无成本的机制。</p>
Vue3.0新增的组合API为用户组织组件代码提供了更强大的灵活性。现在，可以将代码编写为函数，每个函数处理一个特定的功能，而不再需要按选项组织代码了。组合API还使组件之间甚至外部组件之间提取和重用逻辑变得更加简单。

此外，由于组合API是一套基于函数的API，因此能够更好地与TypeScript集成，使用组合API编写的代码可以享受完整的类型推断。

组合API也可以与现有的基于选项的API一起使用，不过组合API在选项（data、computed和methods）之前解析，因此在组合API中是无法访问这些选项所定义的属性的。

## 11.2 setup()函数

setup()函数时一个新的组件选项，它作为在组件内部使用组合API的入口点。setup()函数在初始的prop解析之后，组件实例创建之前被调用。对于组件的生命周期钩子，setup()函数在beforeCreate钩子之前调用。

如果setup()函数返回一个对象，该对象上的属性将被合并到组件模板的渲染上下文中。在1.3.3小节中，我们已经使用过setup()函数，现在回顾代码。如下：
```
setup() {
    //为目标对象创建一个响应式对象
    const state = Vue.reactive({ count: 0 });
    function increment() {
        state.count++;
    }
    // 返回一个对象，该对象上的属性可以在模板中使用
    return {
        state,
        increment,
    }
}
```
setup()函数返回的对象有两个属性，一个是响应式对象（即为原始对象创建的代理对象），另一个是函数。在DOM模板中，可以直接使用这两个属性。代码如下：
```
<button @click="increment">count值：{{ state.count }}</button>
```
需要注意的是，当和现有的基于选项的API一起使用时，从setup()函数返回的属性在选项中可以通过this访问。

setup()函数可以接受两个可选的参数，第一个参数是已解析的props，通过该参数可以访问在props选项中定义的prop。代码如下：
```
app.component('PostItem', {
    //声明props
    props: ['postTitle'],
    setup(props) {
        console.log(props.postTitle)
    }
})
```
setup()函数接收的props对象是响应式的，也就是说，在组件外部传入新的prop值时，props对象会更新，可以调用watchEffect()或watch()方法监听该对象并对更改做出响应。代码如下setup-prop.html：
```
<div id="app">
    <post-item :post-title="title"></post-item>
</div>

<script>
    const app = Vue.createApp({
        data() {
            return {
                title: 'Vue教程'
            }
        }
    });

    app.component('PostItem', {
        //声明props
        props: ['postTitle'],
        setup(props) {
            Vue.watchEffect(() => {
                console.log(props.postTitle);
            })
        },
        template: '<h3>{{ postTitle }}</h3>'
    });

    const vm = app.mount('#app');
```
在Chrome浏览器打开Console窗口中输入vm.title="VC++教程"，会看到除了页面内容发生更新外，Console窗口也会输出“VC++教程”。

需要注意的是，不要去解构props对象，否则会失去响应性。
```
app.component('PostItem', {
    props: ['postTitle'],
    setup({postTitle}) {
        Vue.watchEffect(() => {
            console.log(postTitle);       //不再是响应式的
        })
    }
})
```
同时注意，不要试图去修改props对象，否则，将得到一个警告。

setup()函数接收的第二个可选的参数是一个context对象，该对象是一个普通的JavaScript对象，它公开了3个组件属性。代码如下：
```
const MyComponent = {
    setup(props, context) {
        //属性（非响应式对象）
        console.log(context.attrs)
        //插槽（非响应式对象）
        console.log(context.slots)
        //发出的事件(方法)
        console.log(context.emit)
    }
}
```
context对象是一个普通的JavaScript对象，也就是说，它不是响应式的，这意味着可以安全地使用ES6的对象解构语法对context进行解构。

attrs和slots是有状态的对象，当组件本身被更新时，他们也总是被更新。但attrs和slots对象本身并不是响应式的，所以不应该对它们进行解构，并始终将属性引用为attrs.x或slots.x。代码如下：
```
const MyComponent = {
    setup(props, { attrs }) {
        //在稍后阶段可能被调用的函数
        function onClick() {
            console.log(attrs.foo) //保证是最新的引用
        }
    }
}
```
最后，要强调的是，当setup()函数和选项API一起使用时，在setup()函数内部不要使用this。原因很简单，因为setup()函数是在选项被解析之前调用的。也就是说，在setup()函数内不能访问data、computed和methods组件选项。例如，下面的代码是错误的。
```
setup() {
    function onClick() {
        this //并不是你预期的this
    }
}
```

## 11.3 响应式API

Vue3.0的核心功能主要是通过响应式API实现的，组合API将它们公开为独立的函数，本节介绍Vue3.0的响应式API。

### 11.3.1 reactive()方法和watchEffect()方法

**1. reactive()方法**

reactive()方法可以对一个JavaScript对象创建响应式状态。在HTML页面中，可以编写如下代码：
```
<script src="https://unpkg.com/vue@next"></script>
<script>
    //响应式状态
    const state = Vue.reactive({
        count: 0
    })
</script>
```
在单文件组件中，可以编写如下：
```
import { reactive } from 'vue'

//响应式状态
const state = reactive({
    count: 0
})
```
reactive()方法相当于Vue2.x中的Vue.observable()方法。

**2. watchEffect()方法**

watchEffect()方法返回的是一个响应式对象，我们可以在渲染期间使用它。由于依赖关系的跟踪，当state对象发生变化时，视图会自动更新。在DOM中渲染内容被认为是一个“副作用”，要应用和自动重新应用基于响应式的state对象，可以使用watchEffect API。完整代码如下：

watchEffect.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3 watchEffect</title>
</head>
<body>
    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { reactive, watchEffect } = Vue;
        const state = reactive({
            count: 0
        })

        watchEffect(() => {
            document.body.innerHTML = `count is ${state.count}`
        })
    </script>
</body>
</html>
```
watchEffect()方法接收一个函数对象作为参数，它会立即运行该函数，同时响应式地跟踪其依赖项，并在依赖项发生更改时重新运行该函数。watchEffect()方法类似于Vue2.x中的watch选项，但是它不需要分类监听的数据源和副作用回调。结合API还提供了一个watch()方法，其行为与Vue2.x中的watch选项完全相同。

在Chrome浏览器中打开上例的页面，在页面中初始显示内容为：count is 0，在浏览器的Console窗口中输入： state.count=1,会发现页面同时发生更新。

**3. 解构响应性状态**

当要使用一个较大的响应式对象的一些属性时，可能会考虑使用ES6的对象解构语法获得想要的属性。例如：

destructuring-reactive-state.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3-3destructuring-reactive-state</title>
</head>
<body>
    <div id="app">
        <p>作者：{{ author }}</p>
        <p>书名：{{ title }}</p>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { reative } = Vue
        const app = Vue.createApp({
            setup() {
                const book = reative({
                    author: '孙鑫',
                    year: '2020',
                    title: 'Java无难事',
                    description: '让Java的学习再无难事',
                    price: '188',
                })
                let { author, title } = book;
                return {
                    author,
                    title,
                }
            }
        })
        const vm = app.mount('#app');
    </script>
</body>
</html>
```
但是，通过这种解构，author和title的响应性将丢失，读者可以自行在Chrome浏览器的Console窗口中修改vm.author或vm.title，就会发现页面内容并没有更新。遇到这种情况，需要将响应式对象转换为一组ref，这些ref将保留到源对象的响应式连接。这个转换是通过调用toRefs()方法完成的，该方法将响应式对象转换为普通对象，其中结果对象上的每个属性都是指向原始对象中相应属性的ref。关于ref请参看11.3.2小节。

修改上例，调用toRefs()方法对book对象进行转换。代码如下：
```
<script>
    const { reactive, toRefs } = Vue;
        const app = Vue.createApp({
            setup() {
                const book = reative({
                    author: '孙鑫',
                    year: '2020',
                    title: 'Java无难事',
                    description: '让Java的学习再无难事',
                    price: '188',
                })
                let { author, title } = toRefs(book);
                // title.value = 'VC++'          //title现在是一个ref,需要使用.value
                // console.log(book.title)       //'VC++'
                return {
                    author,
                    title,
                }
            }
        })
        const vm = app.mount('#app');
    </script>
```
现在可以在Console窗口修改vm.author或vm.title,可以发现页面内容也随之更新。

Vue3.0还要一个toRef()方法，该方法是为响应式源对象的某个属性创建ref，然后可以传递这个ref，并保持对其源属性的响应性连接。修改上上例，调用toRef()方法分别为boot对象的author和title属性创建ref对象。代码如下：
```
<script>
    const { reactive, toRef } = Vue;
        const app = Vue.createApp({
            setup() {
                const book = reative({
                    author: '孙鑫',
                    year: '2020',
                    title: 'Java无难事',
                    description: '让Java的学习再无难事',
                    price: '188',
                })
                const author = toRefs(book, 'author');
                const title = toRefs(book, 'title');

                return {
                    author,
                    title,
                }
            }
        })
        const vm = app.mount('#app');
    </script>
```
当把一个prop的ref传递给组合函数时，toRef()方法就很有用了。代码如下：
```
export default {
    setup(props) {
        useSomeFeature(toRef(props, 'foo'))
    }
}
```
**4. 深入watchEffect()函数**

当watchEffect()函数在组件的setup()函数或生命周期钩子中被调用时，监听器(watcher)被链接到组件的生命周期中，并在组件卸载(unmounted)时自动停止。在其它情况下，watchEffect()函数返回一个停止句柄，可以调用该句柄显式地停止监听器。代码如下：
```
const stop = watchEffect(() => {
    /* ... */
})

//之后想要停用监听器，可以调用stop()函数
stop()
```
有时候，watchEffect()函数将执行异步副作用，当它失效时，需要清楚这些副作用。例如，在副作用完成之前状态发生了改变，watchEffect()函数可以接收一个onInvalidate()函数，该函数可用于注册一个无效回调，无效回调将在下面两种情况发生时被调用。
+ 副作用将再次运行
+ 监听器被停止（例如，如果在组件的setup()函数或生命周期中使用watchEffect()函数，则当组件被卸载时停止）。

看以下代码：
```
watchEffect(onInvalidate => {
    const token = performAsyncOperation(id.value)
    onInvalidate(() => {
        //id已更改或监听器已停止时，取消挂起的异步操作
        token.cancel()
    })
})
```
在执行数据抓取时，effect()函数（即副作用）通常是异步函数。代码如下：
```
const data = ref(null)
watchEffect(async() => {
    //在Primise解析之前注册清理函数
    onInvalidate(() => { ... })
    date.value = await fetchData(props.id)
})
```
异步函数隐式地返回一个Promise，但是清理函数需要在Promise解析之前立即注册。此外，Vue依赖返回的Promise来自动处理Promise链中的潜在错误。

在10.11.3小节中，介绍过异步更新队列，effect()函数的执行也是如此，当用户定义的effect()函数排队时，它总是在所有组件更新effect()函数之后调用。代码如下：

effect-flush-timing.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3-4effect-flush-timing</title>
</head>
<body>
    <div id="app">
        {{ count }}
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { ref, watchEffect } = Vue;
        const vm = Vue.createApp({
            setup() {
                const count = ref(0);
                watchEffect(() => {
                    console.log(count.value);
                })
                return {
                    count
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```
当初运行时，将同步记录count值，之后当count发生变化后，传入watchEffect()方法的回调函数会在组件更新后被调用。需要注意的是，第一次运行时在挂载组件之前执行的，如果想要在一个监听的effect()函数中访问DOM或模板的ref(关于模板的ref,可回顾10.11.1小节的“访问子组件实例或子元素”部分)，则需要在mounted钩子中执行watchEffect()方法。代码如下：
```
onMounted(() => {
    watchEffect(() => {
        //访问DOM或模板的ref
    })
})
```
在需要同步或在组件更新之前重新运行监听的effect()函数的情况下，可以给watchEffect()方法传递一个附加的选项对象，在选项对象中使用flush选项，该选项的默认值为'post'，即在组件更新后再次运行监听的effect()函数。
```
//同步触发
watchEffect(
    () => {
        /* ... */
    },
    {
        flush: 'sync'
    }
)

//在组件更新之前触发
watchEffect(
    () => {
        /* ... */
    },
    {
        flush: 'pre'
    }
)
```

### 11.3.2 ref