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
需要注意的是,所有的生命周期钩子都自动将它们的this上下文绑定到实例,因此可以访问实例的数据,,计算属性和方法.这也意味着不能使用箭头函数定义一个生命周期方法(如created:()=>this.fetchTodos()),这是因为箭头函数绑定的是父上下文,在箭头函数中的this并不是期望的组件实例,this.fetchTodos()将是undefined.

下面为例10-4的tab-comment组件添加生命周期钩子方法,直观感受一下组件的各个生命周期阶段.

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
我们在组件中添加了一个数据属性count和大部分生命周期钩子方法,$el是组件实例管理的根DOM元素,$data是组件实例观察的数据对象,组件实例代理了对其数据对象的属性的访问

需要注意的是,上例的组件使用了\<keep-alive\>元素进行包裹,组件的状态会被缓存,这样当组件切换时,才会触发activated和deactivated两个钩子方法;如果去掉该元素,当组件切换时,先前的组件实例会被销毁,当切换回来时,又会重新创建该实例.

接下来利用生命周期钩子实现loading事件,主要作用是界面渲染较慢时,或者向服务器请求一个比较耗时的操作时,给用户一个提示信息.

将loading图片的加载,,显示,,销毁放在一个Javascript脚本中实现.代码如下所示:

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
接下来组件的beforeCreate钩子中显示loading图片,在created钩子中销毁loading图片.代码如下:

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
+ 全局定义强制要求每个组件的命名不能重复.
+ 字符串模板缺乏语法高亮显示,在HTML有多行的时候,需要用到反斜杠(\),或者ECMAScript6中的反引号(`),而后者依赖于支持ECMAScript6的浏览器
+ 没有CSS的支持意味着当HTML和Javascript被模块化为组件时,CSS明显被遗漏了.
+ 没有构建步骤,这限制了为只能使用HTML和ES5 Javacript,而不能使用预处理器,如Pug(以前的Jade)和Babel.

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