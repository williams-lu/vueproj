# 第10章 组件







## 10.9 组件的生命周期

每个组件实例在创建时都要经过一系列的初始化步骤。例如，它需要设置数据观察、编译模板、将实例挂载在DOM中，并在数据变化发生时更新DOM。在此过程中，它还运行称为生命周期钩子的函数，使用户有机会在特定阶段添加自己的代码。

例入created钩子可以在一个实例被创建后运行代码。如下所示：
```
Vue.createApp({
    data() {
        return { count: 1 }
    },
    created() {
        //this指向组件实例
        console.log('count is: ' + this.count) // => "count is: 1"
    }
})
```
为了方便在组件实例的不同阶段加入定制的功能，Vue提供以下生命周期钩子。

***1.beforeCreate***

在实例初始化之后，数据观测(data observation)和事件/监听器配置之前被调用。此时组件实例管理的根DOM元素$el为undefined，数据属性还不能访问。可以在这一段添加loading事件。

***2.created***

在实例创建完成后立即调用。在这一阶段，实例已经完成对选项的处理，这意味着以下选项已经被配置：数据观测、计算属性、方法、watch/event回调。然后，挂载阶段还没有开始，$el属性目前还不可用。此时数据属性已经可以访问，监听器、事件、方法也配置好了，在需要根据日后接口动态改变数据的场景下，可以使用这个钩子。可以在这一阶段结束loading，请求数据为mounted渲染做准备。

***3.beforeMount***

在挂载开始之前调用：render()函数将首次被调用。此时DOM还无法操作，相较于created钩子，在这一阶段只是多了一个$el属性，但其值仍然是undefined。关于render()函数，请参看12章。

***4.mounted***

在实例被挂载后调用，其中传递给Vue.createApp({}).mount()方法的元素被vm.$el替换。如果根实例被挂载到一个文档内元素，则调用mounted时，vm.$el也在文档内。此时元素已经渲染完成了，如果有依赖于DOM的代码可以放在这里，如手动监听DOM事件。可以在这个钩子中想服务端发起请求，获取数据。不过要注意，向服务端请求数据是异步行为，如果模板渲染依赖此数据，最好不要在这个钩子中去获取，因为可能出现此数据还没获取到，模板已经渲染了的情况。

注意，mounted并不保证所有的子组件也已挂载。如果希望等到整个视图渲染完毕，可以在mounted钩子中使用vm.$nextTick。

***5.beforeUdate***

在修补DOM之前，当数据更改时调用。这里适合在更新之前访问现有的DOM，如手动移除了已添加的事件监听器。可以在这个钩子中进一步修改组件实例的数据属性，而不会触发额外的重新渲染过程。

***6.updated***

在数据更改导致的虚拟DOM被重新渲染和修补后调用该钩子。当这个钩子被调用时，组件的DOM已经被更新，所以在这里可以执行依赖于DOM的操作。然后在大多数情况下，应该避免此钩子中更改状态（即修改组件实例的数据属性），这容易导致致死循环。要对状态更改做出响应，最好使用计算属性或监听器。注意，updated并不保证所有子组件已重新渲染。如果希望等到整个视图渲染完毕，可以在updated钩子中使用vm.$nextTick。

***7.activated***

当keep-alive组件激活时调用。

***8.deactivated***

当keep-alive组件激活时调用。

***9.beforeUnmount***

在卸载组件实例之前调用。在这一阶段，实例仍然是完全可用的。

***10.unmounted***

在卸载组件实例后调用。调用这个钩子时，组件实例的所有指令都已解除锁定，所有的事件监听器都已移除，所有的子组件实例也已卸载。

***11.errorCaptured***

当捕获一个来自任何后代组件的错误时被调用。此钩子接收3个参数：错误对象、发生错误的组件实例，以及一个包含错误来源信息的字符串。此钩子可以返回false，以阻止错误进一步传播。

***12.renderTracked***

在跟踪虚拟DOM重新渲染时调用。钩子接收调试器事件作为参数，此事件告诉你哪个操作跟踪了组件以及该操作的目标对象和键。

renderTracked钩子的用法如下所示：
```
<div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
</div>

const app = Vue.createApp({
    data() {
        return {
            cart: 0
        }
    },
    renderTracked({ key, target, type }) {
        console.log({ key, target, type })
        /* 当组件第一次呈现时，它被记录下来：
        {
            key: "cart",
            target: {
                cart: 0
            },
            type: "get"
        }
        */
    },
    methonds: {
        addToCart() {
            this.cart += 1
        }
    }
})

app.mount('#app');
```

***13.renderTriggered***

当虚拟DOM重新渲染被触发时调用.与renderTracked钩子类似,它也接收调试器事件作为参数,此事件告诉你是什么操作触发了重新渲染,以及该操作的目标对象和键.

renderTriggered钩子的用法如下:
```
<div id="app">
    <button v-on:click="addToCart">Add to cart</button>
    <p>Cart({{ cart }})</p>
</div>

const app = Vue.createApp({
    data() {
        return {
            cart: 0
        }
    },
    renderTriggered({ key, target, type }) {
        console.log({ key, target, type })
    },
    methods: {
        addToCart() {
            this.cart += 1
            /* 这将导致renderTriggered调用
            {
                key: "cart",
                target: {
                    cart: 1
                },
                type: "set"
            }
            */
        }
    }
})

app.mount('#app');
```
需要注意的是,所有的生命周期钩子都自动将它们的this上下文绑定到实例,因此可以访问实例的数据、计算属性和方法.这也意味着不能使用箭头函数定义一个生命周期方法(如created:()=>this.fetchTodos()),这是因为箭头函数绑定的是父上下文,在箭头函数中的this并不是期望的组件实例,this.fetchTodos()将是undefined。

下面为例10-4的tab-comment组件添加生命周期钩子方法,直观感受一下组件的各个生命周期阶段。

例10-5 lifecycle.html
```
app.component('tab-comment', {
    template: '<div>这是一本好书</div>',
    data() {
        return {
            count: 0
        }
    },
    beforeCreate() {
        console.log('---------' + 'beforeCreated' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    created() {
        console.log('---------' + 'created' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    beforeMount() {
        console.log('---------' + 'created' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    mounted() {
        console.log('---------' + 'mounted' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    beforeUpdate() {
        console.log('---------' + 'beforeUpdate' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    updated() {
        console.log('---------' + 'updated' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    activated() {
        console.log('---------' + 'activated' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    deactivated() {
        console.log('---------' + 'deactivated' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    brforeUnmount() {
        console.log('---------' + 'brforeUnmount' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
    unmounted() {
        console.log('---------' + 'unmounted' + '-----------')
        console.log("$el: " + this.$el)
        console.log(this.$data)
        console.log("data.count: " + this.count)
    },
})
```
我们在组件中添加了一个数据属性count和大部分生命周期钩子方法,$el是组件实例管理的根DOM元素,$data是组件实例观察的数据对象,组件实例代理了对其数据对象的属性的访问。

需要注意的是,上例的组件使用了\<keep-alive\>元素进行包裹,组件的状态会被缓存,这样当组件切换时,才会触发activated和deactivated两个钩子方法;如果去掉该元素,当组件切换时,先前的组件实例会被销毁,当切换回来时,又会重新创建该实例。

接下来利用生命周期钩子实现loading事件,主要作用是界面渲染较慢时,或者向服务器请求一个比较耗时的操作时,给用户一个提示信息。

将loading图片的加载、显示、销毁放在一个Javascript脚本中实现.代码如下所示:

js/loading.js
```
const Loading = {
    img: '',
    init() {
        img = document.createElement("img");
        img.setAttribute("src", "./images/loading.gif);
    },
    show() {
        document.body.appendChild(img);
    },
    close() {
        if(img)
            document.body.removeChild(img);
    }
}
Loading.init();
```
接下来组件的beforeCreate钩子中显示loading图片,在created钩子中销毁loading图片。代码如下:

lifecycle-loading.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.9 lifecycle-loading</title>
</head>
<body>
    <div id="app">
        <my-component></my-component>
    </div>

    <script src="js/loading.js"></script>
    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});
        app.component('my-component', {
            data: function() {
                return {
                    message: ''
                }
            },
            template: '<p>{{ message }}</p>',
            beforeCreate() {
                Loading.show();
            },
            created() {
                // 准备数据,例如,从服务器获取数据,当响应成功后,关闭loading,设置数据
                //此处用setTimeout模拟耗时的操作
                setTimeout(() => {
                    Loading.close();
                    this.message = "Vue教程";
                }, 2000) 
            }
        });
        app.mount('#app');
    </script>
</body>
</html>
```

## 10.10 单文件组件

在很多Vue项目中,全局组件使用app.component()方法定义,然后使用app.mount('#app')在页面内绑定一个容器元素.这种方式在很多小规模的项目中运作得很好,在这些项目里Javascript只是被用来加强特定的视图.然而,在更复杂的项目中,或者前端完全由Javascript驱动时,以下缺点将变得明显:
+ 全局定义强制要求每个组件的命名不能重复。
+ 字符串模板缺乏语法高亮显示,在HTML有多行的时候,需要用到反斜杠(\),或者ECMAScript6中的反引号(`),而后者依赖于支持ECMAScript6的浏览器。
+ 没有CSS的支持意味着当HTML和Javascript被模块化为组件时,CSS明显被遗漏了。
+ 没有构建步骤,这限制了为只能使用HTML和ES5 Javacript,而不能使用预处理器,如Pug(以前的Jade)和Babel。

在Vue.js中,可以使用单文件组件解决上述所有问题.在一个文件扩展名为.vue的文件编写组件,可以将组件模板代码以HTML的方式书写,同时Javascript与CSS代码也在同一个文件中编写.例如:
```
<template>
    <div>
        <ul class="item">
            <li class="username">用户名: {{ post, user, username }},留言时间: {{ getTime }}</li>
            <li class="title">主题: {{ post.title }}, </li>
            <li>内容: {{ post.content }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'postItem',
    data() {
        return {
        }
    },
    props: ['post'],
    computed: {
        gstTime: function() {
            let d = new Date(this.post.gstTime);
            d.setHours(d.getHours() - 8);
            return d.toLocaleString();
        }
    }
}
</script>
<style scoped>
.item {
    border-top: solid 1px grey;
    padding: 15px;
    font-size: 14px;
    color: grey;
    line-height: 21px;
}
.username {
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #009a61;
}
.title {
    font-size: 16px;
    font-weight: bold;
    line-height: 24px;
    color: #009a61;
}
ul li {
    list-style: none;
}
</style>
```
在单文件组件中编写CSS样式规则时,可以添加一个scoped属性.该属性的作用是限定CSS样式只作用于当前组件的元素,相当于是组件作用域的CSS

## 10.11 杂项

本节介绍一些不常用但特殊需求下会用到的功能

### 10.11.1 组件通信的其他方式

总结一下前面介绍的组件通信的3种方式：
+ 父组件通过prop向子组件传递数据。
+ 子组件通过自定义事件向父组件发起通知或进行数据传递。
+ 子组件通过\<slot\>元素充当占位符，获取父组件分发的内容；也可以在子组件的\<slot\>元素上使用v-bind指令绑定一个插槽prop，向父组件提供数据。

其他实现方式:

***1.访问根实例***

在每一个根组件实例的子组件中，都可以通过$root属性访问根实例。例如：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.1访问根实例</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({
            data() {
                return {
                    price: 98
                }
            },
            computed: {
                totalPrice() {
                    return this.price * 10;
                }
            },
            methods: {
                hello() {
                    return "Hello, Vue教程";
                }
            }
        });

        app.component('parent', {
            template: '<child></child>'
        });

        app.component('child', {
            methods: {
                accessRoot() {
                    console.log("单价： " + this.$root.price);
                    console.log("总价： " + this.$root.totalPrice);
                    console.log(this.$root.hello());
                }
            },
            template: '<button @click="accessRoot">访问根实例</button>'
        });

        app.mount('#app');
    </script>
</body>
</html>
```
不管组件是根实例的子组件，还是更深层级的后代组件，$root属性总是代表了根实例。

***2.访问父组件实例***

与$root类似，$parent属性用于在一个子组件中访问父组件的实例，这可以替代父组件通过prop向子组件传递数据的方式。例如：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.1-2访问父组件实例</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        app.component('parent', {
            data() {
                return {
                    price: 188
                }
            },
            computed: {
                totalPrice() {
                    return this.price * 10
                }
            },
            methods: {
                hello() {
                    return "Hello, Vue教程"
                }
            },
            template: '<child></child>'
        });

        app.component('child', {
            methods: {
                accessParent() {
                    console.log("单价： " + this.$parent.price);
                    console.log("总价： " + this.$parent.totalPrice);
                    console.log(this.$parent.hello());
                }
            },
            template: '<button @click="accessParent">访问父组件实例</button>'
        });

        app.mount('#app');
    </script>
</body>
</html>
```
$parent属性只能用于访问父组件实例，如果父组件之上还有父组件，那么该组件是访问不到的。

***3.访问子组件实例或子元素***

现在反过来，如果父组件要访问子组件实例，在Vue中，父组件要访问子组件实例或子元素，可以给子组件或子元素添加一个特殊的属性ref，为子组件或子元素分配一个引用ID，然后父组件就可以通过$refs属性访问子组件实例或子元素。代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.1-3访问子组件实例或子元素</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        app.component('parent', {
            mounted() {
                // 访问子元素<input>,让其具有焦点
                this.$refs.inputElement.focus();
                // 访问子组件<child>的message数据属性
                console.log(this.$refs.childComponent.message);
            },
            template: 
                `<div>
                    // 子元素
                    <input ref="inputElement"><br>
                    // 子组件
                    <child ref="childComponent"></child>
                </div>`
        });

        app.component('child', {
            data() {
                return {
                    message: 'Vue教程'
                }
            },
            template: '<p>{{ message }}</p>'
        });

        app.mount('#app');
    </script>
</body>
</html>
```
需要注意的是，$refs属性只在组件渲染完成之后生效，并且它们不是响应式的。要避免在模板和计算属性中访问$refs。

***4.provide和inject***

$root属性用于访问根实例，$parent属性用于访问父组件实例，但如果组件嵌套的层级不确定，某个组件的数据或方法需要被后代组件所访问，那这时候就需要用到两个新的实例选项：provide和inject。provide选项允许指定要提供给后代组件的数据和方法，在后代组件中使用inject选项接收要添加到该实例中的特定属性。代码如下：

ProvideAndInject.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.1-4 Provide和Inject</title>
</head>
<body>
    <div id="app">
        <parent></parent>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        app.component('parent', {
            data() {
                return {
                    msg: 'Vue教程'
                }
            },
            methods: {
                sayHello(name) {
                    console.log("Hello, " + name);
                }
            },
            provide() {
                return {
                    //数据message和sayHello方法可供后代组件访问
                    message: msg,
                    hello: this.sayHello
                }
            },
            template: '<child/>'
        });

        app.component('child', {
            // 接收message数据属性和hello方法
            inject: ['message', 'hello'],
            mounted() {
                // 当自身的方法来访问
                this.hello('zhangsan');
            },
            // 当自身的数据属性来访问
            template: '<p>{{ message }}</p>'
        });

        const vm = app.mount('#app');
    </script>
</body>
</html>
```
使用provide和inject，父组件不需要知道哪些后代组件要使用它提供的属性，后代组件不需要知道被注入的属性来自哪里。

不过上述代码也存在一些问题。首先，注入的message属性并不是响应式的，当修改父组件的msg数据属性时，message属性并不会跟着改变。这是因为默认情况下，provide/inject绑定并不是响应式的，可以通过传递ref属性或reactive对象更改这一行为。第11章讲述。

其次，provide和inject将应用程序中的组件与它们当前的组织方式耦合起来，使重构变得更加困难。如果数据需要在多个组件中访问，并且能够响应更新，可以考虑第16章介绍的状态管理解决方案--Vuex。

### 10.11.2 递归组件

组件可以在自己的模板中递归调用自身，但这需要使用name选项为组件指定一个内部调用名称。当调用Vue.createApp({}).component({})全局注册组件时，这个全局的ID会自动设置为该组件的name选项。

递归组件和程序语言中的递归函数调用一样，都需要有一个条件结束递归，否则会无限循环。例如通过v-if指令（表达式计算为假时）结束递归。

分类树状显示，代码如下：

RecursiveComponents.html
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.2递归组件RecursiveComponents</title>
</head>
<body>
    <div id="app">
        <category-component :list="categories"></category-component>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const CategoryComponent = {
            name: 'catComp',
            props: {
                list: {
                    type: Array
                }
            },
            data() {
                return {
                    count: 0
                }
            },
            template: 
            `
            <ul>
                <!-- 如果list为空,则表示没有子分类了,结束递归 -->
                <template v-if="list">
                    <li v-for="cat in list">
                        {{ cat.name }}
                        <catComp :list="cat.children"/>
                    </li>
                </template>
            </ul>
            `
        }

        const app = Vue.createApp({
            data() {
                return {
                    categories: [
                        {
                            name: '程序设计',
                            children: [
                                {
                                    name: 'Java',
                                    children: [
                                        {name: 'Java SE'},
                                        {name: 'Java EE'},
                                    ]
                                },
                                {
                                    name: 'C++'
                                }
                            ]
                        },
                        {
                            name: "前端架构",
                            children: [
                                { name: "Vue.js" },
                                { name: "React" },
                            ]
                        }
                    ]
                }
            },
            components: {
                CategoryComponent
            }
        }).mount('#app');
    </script>
</body>
</html>
```

### 10.11.3 异步更新队列

示例代码nextTick.html：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.11.3异步更新队列nextTick</title>
</head>
<body>
    <div id="app">
        <my-component></my-component>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});
        app.component('my-component', {
            data() {
                return {
                    message: 'Vue教程'
                }
            },
            methods: {
                change() {
                    this.message = 'VC++教程';
                    console.log(this.$refs.msg.textContent);
                }
            },
            template:
            `<div>
                <p ref="msg">{{ message }}</p>
                <button @click="change">修改内容</button>
            </div>`
        });

        app.mount('#app');
    </script>
</body>
</html>
```
代码简单，当单击“修改内容”按钮时，修改组件message数据属性的值，然后再Console窗口中输出组件模板中\<p\>元素的内容都是message属性的值，修改了message属性的值，在change()方法中理应输出修改后的值，但实际上输出的是“Vue教程”。

这是因为Vue在数据变化需要更新DOM时并不是同步执行，而是异步执行的。每当侦听到数据更改时，Vue将开启一个队列，并缓冲在同一时间循环中发生的所有数据变更。如果同一个观察者被多次触发，只会将其放入队列中一次。Vue在缓冲时会去除重复数据，这样可以避免不必要的计算和DOM操作。然后，在下一个事件循环tick中，Vue刷新队列并执行实际的工作。Vue在内部对异步队列尝试使用原生的Promise.then、MutationObserver和setImmediate，如果执行环境不支持，则会采用setTimeout(fn,0)代替。

对于本例，当在change()方法中修改message属性值的时候，该组件不会立即重新渲染。当队列重新刷新时，组件会在下一个tick中更新。多数情况下，不需要关心这个过程，但是如果想在数据更改后立即访问更新后的DOM，这是就需要用到Vue.nextTick(callback)方法，传递给Vue.nextTick()方法的回调函数会在DOM更新完成后被调用。

修改上例的change()方法，代码如下：
```
change() {
    this.message = "VC++教程";
    Vue.nextTick(() => console.log(this.$refs.msg.textContent))
}
```
使用浏览器，单击“修改内容”按钮，在Console窗口中的输出为VC++教程。

除了使用全局的Vue.nextTick()方法外，在组件内部还可以使用实例的$nextTick()方法，这样在回调函数中的this会自动绑定到当前的组件实例上，而不用像上面的代码需要用箭头函数来绑定this到组件实例了。
```
change() {
    this.message = "VC++教程";
    this.$nextTick(function() {
        console.log(this.$refs.msg.textContent);
    })
}
```

### 10.11.4 Teleport

Vue可以通过将UI和相关行为封装到组价中构建UI，组件之间可以嵌套，从而构成一个UI树。然而，有时候组件模板的一部分在逻辑上属于该组件，但从技术角度看，应该将模板的这一部分移到DOM中的其他地方，位于Vue应用程序实例之外。

一个常见的场景是创建一个包含全屏模态的组件。在大多数情况下，模态的逻辑都存在于组件中的，但是我们会发现，模态的定位很难通过CSS来解决，我们不得不考虑对组件进行拆分。

官网例子：
```
<body>
    <div style="position: relative;">
        <h3>Tooltips with Vue 3.0 Teleport</h3>
        <div>
            <modal-button></modal-button>
        </div>
    </div>
</body>
```
modal-button组件在嵌套很深的div元素中渲染。modal-button组件的代码如下：
```
const app = Vue.createApp({});
app.component('modal-button', {
    template:
    `<button @click="modalOpen = true">
        Open full screen modal!
    </button>

    <div v-if="modalOpen" class="modal">
        <div>
            I'm a modal!
            <button @click="modalOpen = false">
                Close
            </button>
        </div>
    </div>
    `,
    data() {
        return {
            modalOpen: false
        }
    }
})
```
modal-button组件有一个\<button\>元素触发模态的打开，以及一个具有.modal样式类的div元素，它包含模态的内容和一个用于自我关闭的按钮。

.modal样式类使用了一个样式表属性"position: absolute;"，当modal-button组件在上面的HTML解构中渲染时，会发现由于模态在嵌套很深的div中渲染，样式属性position: relative将相对于父级div元素应用。为了解决这个问题，Vue3.0给出一个内置组件teleport，该组件允许控制在DOM中的哪个父节点下渲染HTML片段。

teleport组件有两个porp,如下所示：
+ to: 字符串类型，必须的prop。其值必须是有效的查询选择器或HTML的元素名（如果在浏览器的环境中使用）。teleport组件的内容将被移动到指定的目标元素中。
+ disabled: 布尔类型，可选的prop。disabled可以用于禁用teleport组件的功能，这意味着它的插槽内容将不会被移动到任何位置，而是在周围父组件中指定\<teleport\>的地方渲染。

修改modal-button组件的代码，使用\<teleport\>来告诉Vue“将这个HTML传送到body标签下”。代码如下：
```
app.component('modal-button', {
    template: `
    <button @click="modalOpen = true">
        Open full screen modal! (with teleport!)
    </button>

    <teleport to="body">
        <div v-if="modalOpen" class="modal">>
            <div>
                I'm a teleported modal!
                (My parent is "body")
                <button @click="modalOpen = false">
                    Close
                </button>
            </div>
        </div>
    </teleport>
    `,
    data() {
        return {
            modalOpen: false
        }
    }
})
```
现在，当单击“ I'm a teleported modal!(My parent is "body")”按钮，Vue会正确地将模态的内容在body标签下渲染。

如果\<teleport\>的内容包含了Vue组件，那么该组件在逻辑上任然是\<teleport\>父组件下的子组件。代码如下：
```
const app = Vue.createApp({
    template: `
        <h1>Root instance</h1>
        <parent-comment />
    `
})

app.component('parent-component', {
    template: `
        <h2>this is a parent component</h2>
        <teleport to="#endofbody">
            <child-component name="John" />
        </teleport>
    `
})

app.component('child-component', {
    porps: ['name'],
    template: `
        <div>Hello, {{ name }}</div>
    `
})
```
不管child-component组件在什么位置渲染，它仍将是parent-component组件的子组件，并从父组件接收name prop。这意味着来自父组件的注入将按预期工作，并且子组件将嵌套在Vue Devtools中父组件之下，而不是放在实际内容移动到的位置。

一个常见的用例场景是一个可重用的\<modal\>组件，其中可能同时有多个活动实例。对于这种情况，多个\<Modal\>组件可以将它们的内容挂载到同一个目标元素下。挂载顺序将是一个简单的追加，在目标元素中，后挂载的将位于先挂载的之后。代码如下：
```
<teleport to="#modals">
    <div>A</div>
</teleport>
<teleport to="#modals">
    <div>B</div>
</teleport>

<!-- 结果 -->
<div id="modals">
    <div>A</div>
    <div>B</div>
</div>
```