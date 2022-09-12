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

reactive()方法为一个JavaScript对象创建响应式代理，如果需要对一个原始值（如字符串）创建响应式代理对象，一种方式是将该原始值作为某个对象的属性，调用reactive()方法为该对象创建响应式代理对象，另一种方式就是使用Vue给出的另一个方法ref,该方法接受一个原始值，返回一个响应式和可变的ref对象，返回的对象只有一个value属性指向内部值。代码如下：

ref.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3.2 ref.html</title>
</head>
<body>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { ref, watchEffect } = Vue;
        const state = ref(0)

        watchEffect(() => {
            document.body.innerHTML = `count is ${state.value}`
        })
    </script>
</body>
</html>
```
此时取值需要访问state对象的value属性。上例在Chrome浏览器中的运行效果，如果要观察响应式对象的依赖跟踪，在Console窗口中需要修改state.value的值，而不是直接修改state对象。

当ref作为渲染上下文中的属性返回（从setup返回的对象）并在模板中访问时，它将自动展开为内部值，不需要在模板中添加.value。代码如下：

ref-unwrapping.html
```
<div id="app">
    <span>{{ count }}</span>
    <button @click="count ++">Increment count</button>
</div>

<script>
    const {ref} = Vue;
    const app = Vue.createApp({
        setup() {
            const count = ref(0);
            return {
                count
            }
        }
    })
    app.mount('#app');
</script>
```
当ref作为响应式对象的属性被访问或更改时，它会自动展开为内部值，其行为类似于普通属性。代码如下：
```
const count = ref(0)
const state = reative({
    count
})
console.log(state.count)  //0

state.count = 1
console.log(count.value) //1
```
如果一个新的ref被赋值给一个链接到现有ref的属性，它将替换旧的ref。代码如下：
```
const otherCount = ref(2)

state.count = otherCount
console.log(state.count)  //2
console.log(count.value)  //1
```
ref展开仅在嵌套在响应式对象内时发生，当从数组或本地集合类型（如Map）中访问ref时，不会执行展开操作。
```
const books = reactive([ref('Vue3从入门到实战')])
// 需要添加.value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]
// 需要添加.value
console.log(map.get('count').value)
```

### 11.3.3 readonly

有时候我们希望跟踪响应对象（ref或reactive）的变化，但还希望阻止从应用程序的某个位置对其进行更改。例如，当我们有一个提供的响应式对象时，想要防止它在注入的地方发生改变，为此，可以为原始对象创建一个只读代理。代码如下：
```
import { reactive, readonly } from 'vue'

const original = reactive({ count: 0 })

const copy = readonly(original)

//改变origin将触发依赖copy的观察者
original.count++

//修改copy将失败并导致警告
copy.count++ //warning:"set operation on key'count' fialed: target is readonly."
```

### 11.3.4 computed

computed()方法与computed选项作用一样，用于创建依赖于其他状态的计算属性，该方法接收一个getter函数，并为getter返回的值返回一个不可变的响应式ref对象。代码如下：
```
const count = ref(1)
const plusOne = computed(() => count.value + 1)

const.log(plusOne.value)  // 2

plusOne.value++ // error
```
我们使用组合API重新实现6.1节的内容，代码如下；

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3.4 computed</title>
</head>
<body>
    <div id="app">
        <p>原始字符： {{ name }}</p>
        <p>计算后的反转字符串： {{ reversedMessage }}</p>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { ref, computed } = Vue;
        const vm = Vue.craeteApp({
            setup() {
                const message = ref("Hello, Vue教程")
                const reversedMessage = computed(() => 
                    message.value.split('').reverse().join('')
                );
                return {
                    message,
                    reversedMessage,
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```
与computed选项一样，computed()方法也可以接受一个带有get()和set()函数的对象来创建一个可写的ref对象。代码如下：
```
const count = ref(1)
const plusOne = computed({
    get: () => count.value + 1,
    set: val => {
        count.value = val - 1
    }
})

plusOne.value = 1
console.log(count.value)   // 0
```
我们使用组合API重新实现6.1节的例，代码如下所示：

computedSetter.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.3.4computedSetter</title>
</head>
<body>
    <div id="app">
        <p>First name: <input type="text" v-model="firstName"></p>
        <p>Last name: <input type="text" v-model="lastName"></p>
        <p>{{ fullName }}</p>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { ref, computed } = Vue;
        const vm = Vue.createApp({
            setup() {
                const firstName = ref('Smith');
                const lastName = ref('Will');
                const fullName = computed({
                    get: () => firstName.value + ' ' + lastName.value,
                    set: val => {
                        let names = val.split(' ')
                        firstName.value = names[0]
                        lastName.value = names[names.length - 1]
                    }
                });
                return {
                    firstName,
                    lastName,
                    fullName,
                }
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### 11.3.5 watchEffect

watch()方法等同于Vue2.x的this.$watch()方法，以及相应的watch选项。watch()方法需要监听特定的数据源，并在单独的回调函数中应用副作用。默认情况下，它也是惰性的，即只有当被监听的数据源发生变化时，才会调用回调函数。

与watchEffect()方法相比，watch()方法有以下功能：
+ 惰性地执行副作用；
+ 更具体地说什么状态应该触发监听器重新运行；
+ 访问被监听状态的前一个值和当前值。

watch()与watchEffect()方法共享行为，包括手动停止、副作用失效（将onInvalidate作为第3个参数传递给回调）、刷新时间和调试。

监听的数据源可以是返回值的getter函数，也可以是直接的ref对象。例如：
```
const state = reactive({ count: 0 })
// 监听的数据源可以是返回值的getter函数
watch(
    () => state.count,
    (count, prevCount) => {
        /* ... */
    }
)

const count = ref(0)
// 直接监听一个ref对象
watch(count, (count, prevCount) => {
    /* ... */
})
```
监听器还可以使用数组同时监听多个数据源。例如：
```
watch([fooRef, barRef], ([foo, bar], [prevFoo, prevBar]) => {
    /* ... */
})
```

## 11.4 生命周期钩子

在组合API中，生命周期钩子通过调用onXxx()函数显式地进行注册。这些生命周期钩子注册函数只能在setup()期间同步使用，因为它们依赖内部全局状态定位当前活动实例\[即其setup()正在被调用的组件实例\]。在没有当前活动实例的情况下调用它们将导致错误。组件实例上下文也是在生命周期钩子的同步执行期间设置的，因此在生命周期钩子内同步创建的监听器和计算属性也会在组件卸载时被自动删除。

在10.9章节，我们介绍了生命周期选项，这些选项与组合API之间的对应关系如下：
+ beforeCreate和created没有对应的onXxx()函数，取而代之使用setup()函数
+ beforeMount -> onBeforeMount
+ mounted -> onMounted
+ beforeUpdate -> onBeforeUpdate
+ updated -> onUpdated
+ beforeUnmount -> onBeforeUnmount
+ unmounted -> onUnmounted
+ activated -> onActivated
+ deactivated -> onDeactivated
+ errorCaptured -> onErrorCaptured
+ renderTracked -> onRenderTracked
+ renderTriggered -> onRenderTriggered

实际上很容易就可以看出，组合API中对应的声明周期钩子注册函数的名字就是声明周期选项的名字首字母大写并添加前缀on。

下面是一个在单文件组件内使用组合API注册声明周期钩子的示例：
```
import { onMounted, onUpdated, onUnmounted } from 'vue'

const MyComponent = {
    setup() {
        onMounted(() => {
            console.log('mounted!')
        })
        onUpdated(() => {
            console.log('updated!')
        })
        onUnmounted(() => {
            console.log('unmounted!')
        })
    }
}
```

## 11.5 依赖注入

在10.11.1小节中,介绍过provide和inject选项,组合API中也给出了对应的provide()和inject()方法,以支持注入.这两个方法只能在setup()期间使用当前活动实例来调用.

在10.11.1小节的例子中,提到过注入的message属性不是响应式的,下面组合API的provide()和inject()方法改写例子,同时解决message属性的响应式更改问题.代码如下:

computedSetter.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.5computedSetter</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { provide, inject, ref, onMounted } = Vue;
        const app = Vue.createApp({});

        const msgKey = Symbol();
        const helloKey = Symbol();

        app.component('parent', {
            setup() {
                const msg = ref('Vue教程');
                const sayHello = function(name) {
                    console.log("Hello, " + name);
                }
                //provide()方法需要指定一个Symbol类似的key
                provide(msgKey, msg);
                provide(helloKey, sayHello);
                return {
                    msg
                }
            },
            template: '<child/>'
        })

        app.component('child', {
            setup() {
                // inject()方法接受一个可选的默认值作为第2个参数
                // 如果没有提供默认值,并且在provide上下文中未找到该属性,则inject返回undefined
                const message = inject(msgKey, ref('VC++教程'));
                const hello = inject(helloKey);
                onMounted(() => hello('zhangsan'));

                return {
                    message
                }
            },
            // 当自身的数据属性来访问
            template: '<p>{{ message }}</p>'
        })
        
        const vm = app.mount('#app');
    </script>
</body>
</html>
```
现在如果修改parent组件的msg属性的值,则会引起child组件中注入的message属性的更改.为了便于观察响应式依赖注入的更新,我们可以将parent组件的代码放到根组件实例中,这样Console窗口中就可以通过修改vm.msg的值来观察child组件的模板内容的重新渲染.

修改上例,代码如下:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>11.5computedSetter</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const { provide, inject, ref, onMounted } = Vue;

        const msgKey = Symbol();
        const helloKey = Symbol();

        const app = Vue.createApp({
            setup() {
                const msg = ref('Vue教程');
                const sayHello = function(name) {
                    console.log("Hello, " + name);
                }
                //provide()方法需要指定一个Symbol类似的key
                provide(msgKey, msg);
                provide(helloKey, sayHello);
                return {
                    msg
                }
            },
            template: '<child/>'
        });

        app.component('child', {
            setup() {
                // inject()方法接受一个可选的默认值作为第2个参数
                // 如果没有提供默认值,并且在provide上下文中未找到该属性,则inject返回undefined
                const message = inject(msgKey, ref('VC++教程'));
                const hello = inject(helloKey);
                onMounted(() => hello('zhangsan'));

                return {
                    message
                }
            },
            // 当自身的数据属性来访问
            template: '<p>{{ message }}</p>'
        });
        
        const vm = app.mount('#app');
    </script>
</body>
</html>
```
在Chrome浏览器中的显示效果请自行查看.

## 11.6 逻辑提取和重用