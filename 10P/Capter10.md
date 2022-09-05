# 第10章 组件

组件是Vue.js最核心的功能，在前端应用程序中可以采用模块化的开发，实现可重用、可扩展。组件是带有名字的可复用的实例，因此在根组件实例中的各个选项在组件中也一样可以使用。组件系统让我们可以使用独立可复用的小组件构建大型应用，几乎任意类型应用的界面都可以抽象为一个组件树。

## 10.1 全局注册与本地注册

与自定义指令类似，组建也有两种注册方式；全局注册与本地注册。
全局注册组件使用应用程序实例的component()方法注册，该方法接受两个参数，
第一个参数是组件的名字，第二个参数是一个函数对象，或者是一个选项对象。 

语法形式
```
app.componet({string} name, {Funtion | Object} definition (optional) )
```
本地注册是在组件实例的选项对象中使用components选项注册

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>案例1</title>

<body>

    <div id="app">
        <Button-Counter></Button-Counter>
    </div>
    <!-- <div id="app">
        <button-counter></button-counter>
    </div> -->


    <!-- <div id="app">
         <ButtonCounter></ButtonCounter>
    </div> -->

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        app.component('ButtonCounter', {
            data() {
                return {
                    count: 0
                }
            },

            template: `
                <button @click="count++">
                    You clicked me {{ count }} times.
                </button>`
        });

        app.mount('#app');
    </script>

</body>
</html>
```
组件的内容通过template选项定义，当使用组件时，组件所在的位置将被template选项的内容所替换。

组件的使用，把组件当成自定义元素
```
<div id="app">
    <ButtonCounter></ButtonCounter>
</div>
```
上述代码不能生效，因为要在HTML并不区分元素和属性的大小写，所以浏览器会把所有大小写字符解释为小写字符，即buttoncounter，
而注册时使用的名称是ButtonCounter，这就导致了找不到组件而出现错误。解决办法就是在DOM模板中采用kebab-case命名引用组件。
```
<div id="app">
    <button-counter></button-counter>
</div>
```
只要组件注册时采用的是PascalCase（首字母大写）命名，就可以采用kebab-case命名来引用。
不过在非DOM模板中（如字符串模板或单文件组件内），是可以使用组件的原始名称的，即\<ButtonCounter\>和\<button-counter\>
都可以。如果想要保持名字的统一性，也可以在注册组件时，直接使用kebab-case命名组件。
```
app.component('button-counter', ...)
```
此外，由于HTML并不支持自闭合的自定义元素，所以在DOM模板中不要把ButtonCounter组件当作自闭合元素使用。例如不要使用
\<button-counter/\>，而是\<button-counter\>\</button-counter\>。在非DOM模板中没有这个限制，相反，还鼓励将没有内容的组件作为自闭合元素来使用，这可以明确该组件没有内容，由于省略了结束标签，代码也更简洁。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>案例2</title>
</head>
<body>
        
    <div id="app">
        <button-counter></button-counter>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const MyComponent = {
            data() {
                return {
                    count: 0
                }
            },
            template:
                `<button v-on:click="count++">
                    You clicked me {{ count }} times.
                </button>`
        };
    
        const app = Vue.createApp({
            components: {
                ButtonCounter: MyComponent
            }
        }).mount('#app');
    </script>

</body>
</html>
```
对于component选项对象，它的每个属性的名称就是自定义元素的名称，其属性值就是这个组件的选项对象。

全局注册组件可以在该应用程序中的任何组件实例的模板中使用，而局部注册组件只能在父组件的模板中使用。

## 10.2 使用prop向子组件传递数据

组件时当作自定义元素来使用的，元素一般是有属性的，同样，组件也是有属性。在使用组件时，当组件元素设置属性，组件内部如何接收呢？首先需要在组件内部注册一些自定义的属性，成为prop，这些prop是在组件的props选项中定义的；之后，在使用组件时，就可以将这些prop的名称作为元素的属性名来使用，通过属性向组件传递数据，这些数据作为组件实例的属性被使用。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.2章案例</title>
</head>
<body>
    <div id="app">
        <post-item post-title="Vue 完税"></post-item>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});
        app.component('PostItem', {
            //声明props
            props: ['postTitle'],
                //postTitle就像data中定义的数据属性一样，
                //在该组件中可以如"this.postTitle"这样使用
                template: '<h3>{{ postTitle }}</h3>'
        });
        app.mount('#app');
    </script>
</body>
</html>
```
说明：

1. 正如代码注释中所述，在props选项中定义的prop，可以作为组件实例的数据属性使用。
2. props选项中声明的每一个prop，，在使用组件时，作为元素的自定义属性使用，属性值会被传递给组件内部的prop。
3. 已不止一次提到过，HTML中的属性名是不区分大小写的，浏览器在加载HTML页面的时候，会统一转换成小写字符，采用camelCase（驼峰命名法）的prop名要使用其等价的kebab-case（短横线分隔命名）名称。如果在字符串模板中或单文件组件内使用，则没有这个限制。

说明3例子展示

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.2章案例</title>
</head>
<body>
    <div id="app">
        <post-list></post-list>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        const PostItem = {
            props: ['postTitle'],
            template: '<h3>{{ postTitle }}</h3>'
        };

        app.component('PostList', {
            components: {
                PostItem
            },
            //在字符串模板中可以直接使用PascalCase命名的组件名，
            //和camelCase命名的prop名
            template: '<div><PostItem postTitle="Vue 玩水" /></div>'
        });

        app.mount('#app');
    </script>
</body>
</html>
```
在本地注册组件中，使用了ES6的属性初始值的简写语法。

在字符串模板中，除了各种命名可以直接使用外，组件还可以作为自闭合元素使用。

下面修改一下PostList组件，给它定义一个数据属性title，然后用title的值给子组件PostItem的postTitle属性赋值。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.2章案例</title>
</head>
<body>
    <div id="app">
        <post-list></post-list>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        const PostItem = {
            props: ['postTitle'],
            template: '<h3>{{ postTitle }}</h3>'
        };
        
        app.component('PostList', {
            data() {
                return {
                    title: 'Vue 睇水 回水 跺水 潲水'
                }
            },
            components: {
                PostItem
            },
            template: '<div><PostItem :postTitle="title"></PostItem></div>'       //改动后
        });

        app.mount('#app');
    </script>
</body>
</html>
```
渲染的结果是 \<h3\>title\</h3\>。为什么没有输出title属性？因为在解析的时候，title并没有作为表达式来解析，而仅仅是作为一个静态的字符串传递给PostTitle属性。与普通HTML元素的属性传值一样，想要接收动态值，需要使用v-bind指令，否则，接收的值都是静态的字符串值。

修改PostList组件的模板字符串，代码如下：
```
template: '<div><PostItem :postTitle="title"></PostItem></div>'
```
输出结果：
```
<h3>Vue 睇水 回水 跺水 潲水</h3>
```
如果组件需要接收多个传值，那么可以定义多个prop。代码如下所示：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.2章案例3</title>
</head>
<body>
    <div id="app">
        <post-list></post-list>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({});

        const PostItem = {
            props: ['author', 'title', 'content'],
            template: `
            <div>
                <h3>{{ title }}</h3>
                <p> 作者：{{ author }}</p>
                <p>{{ content }}</p>
            </div>`
        };
        
        app.component('PostList', {
            data() {
                return {
                    author: '孙鑫',
                    title: 'Vue教程',
                    content: '书不错',
                }
            },
            components: {
                PostItem
            },
            template: `
            <div>
                <PostItem
                    :author="author"
                    :title="title"
                    :content="content">
                </PostItem>
            </div>`
        });

        app.mount('#app');
    </script>
</body>
</html>
```
从例子可以看到，如果子组件定义的prop较多，调用时就需要写较多的属性，然后一一赋值，显然不科学。为此，可以使用不带参数的v-bind命令传入一个对象，只需要将该对象的属性和组件的prop一一对应即可。代码如下：
```
app.component('PostList', {
    data() {
        return {
            post: {
                author: '孙鑫',
                title: 'Vue教程',
                content: '书不错',
            }
        }
    },
    template: '<div><PostItem v-bind="post" /></div>'
});
```
在data中，定义了一个post对象，它的属性值是和PostItem的prop一一对应。在\<PostItem\>元素上使用了不带参数的v-bind指令，传入post对象，该对象的所有属性将作为post传入。

虽然直接传入一个对象，将其所有属性值作为prop传入可以简化代码的编写，但也容易造成一些混乱，而在实际业务组件开发时，子组件通常是以对象接收数据，父组件以对象的方式传值。示例代码：
```
const app = Vue.createApp({});

const PostItem = {
    props: ['post'],
    template: `
    <div>
        <h3>{{ post.title }}</h3>
        <p> 作者：{{ post.author }}</p>
        <p>{{ post.content }}</p>
    </div>`
};

app.component('PostList', {
    data() {
        return {
            post: {
                author: '孙鑫',
                title: 'Vue教程',
                content: '书不错',
            }
        }
    },
    template: '<div><PostItem :post="post" /></div>'
});
```
### 10.2.1 单向数据流

通过prop传递数据是单向的，父组件的属性变化会向下传递给子组件，但是反过来不行。这可以防止子组件意外改变父组件的状态，从而导致应用程序的数据流难以理解。

每次父组件更新时，子组件中的所有prop都会刷新为最新的值。这意味着不应该在一个子组件内去改变prop，如果这样做，则Vue会在Chrome浏览器的Console窗口中给出警告。

下面两种情况下可能需要改变组件的prop。

第一种情况是定义一个prop，以方便父组件传递初始值，在子组件内将这个prop作为一个本地的数据使用。遇到这种情况的解决办法是定义一个本地的data属性，然后将prop的值作为其初始值，后续操作只访问这个data属性。代码如下：
```
props: ['initialCounter'],
data: function () {
    return {
        counter: this.initialCounter
    }
}
```
第二种情况是prop接收数据后需要转换后使用。在这种情况下，可以使用计算属性解决。代码示例如下：
```
props: ['size'],
computed: {
    normalizedSize() {
        return this.size.trim().toLowerCase()
    }
}
```
后续的操作直接访问计算机属性normalizedSize。

>注意：<br>
>Javacript中对象和数组是通过引用传入的，所以对于一个数组或对象类型的prop,在子组件中改变这个对象或数组本身将影响到父组件的状态。

### 10.2.2 prop验证

当开发一个通用组件时，我们希望父组件通过prop传递的数据类型是符合要求的。例如，组件定义的一个prop是数组类型，，结果父组件传的是一个字符串类型的值，这显然不合适。为此，Vue也提供了prop的验证机制，在定义props选项时，用一个带验证需求的对象代替之前，一直使用的字符串数组(props:['author', 'tilte', 'content'])。代码如下：
```
app.component('my-component', {
    props: {
        //基本类型检查（'null'和'undefined'会通过任何类型验证）
        age: Number,
        //多个可能的类型
        tel: [String, Number],
        //必填的字符串
        username: {
            type: String,
            required: true
        },
        //具有默认值的数字
        sizeOfPage: {
            type: Number,
            default: 10
        },
        //具有默认值的对象
        greeting: {
            type: Object,
            //对象或数组默认值必从一个工厂函数获取
            default: function () {
                return { message: 'hello' }
            }
        },
        //自定义函数验证
        info: {
            validator: function (value) {
                //这个值必须匹配下列字符串中的一个
                return ['success', 'warning', 'danger'].indexOf(value) !== -1
            }
        },
        //具有默认值的函数
        msg: {
            type: Funtion,
            //与对象或数组默认值不同，这不是一个工厂函数，而是一个用作默认值的函数
            default: function () {
                return 'Default function'
            }
        }
    }
})
```
当prop验证失败时，在开发板中，Vue会在Console中抛出一个警告。

>注意：<br>
>prop类型发证在组件实例创建之前，因此实例的属性（如data、计算属性等）在default或validator函数中是不可用的。

验证的类型（type）可以是下列原生构造函数中的一个：
+ String
+ Number
+ Boolean
+ Array
+ Object
+ Date
+ Function
+ Symbol

此外，type还可以是一个自定义的构造函数。代码如下：
```
function Person (firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
}

app.component('blog-post', {
    props: {
        //验证author的值是否是通过new Person创建的
        author: Person
    }
})
```

### 10.2.3 非prop的属性

在使用组件时，组件的使用者可能会向组件传入未定义prop的属性。在Vue.js中，这也是被允许的，常见的例子包括class、sytle和id属性，可以通过$attrs访问这些属性。

当组件返回单个节点时，非prop的属性将自动添加到根节点的属性中。

1. 属性继承
请看代码:
```
<style>
    .child {
        background-color: red;
    }

    .parent {
        opacity: 0.5;
    }
</sytle>

<div id="app">
    <my-input type="text" class="parent"></my-input>
</div>

<script>
    const app = Vue.createApp({});
    app.component('MyInput', {
        template: '<input class="child">'
    });

    app.mount('#app');
</script>
```
MyInput组件没有定义任何的prop，根元素是\<input\>, 在DOM模板中使用\<my-input\>元素时设置了type属性，这个属性将被添加到MyInput组件的根元素\<input\>上，渲染结果为\<input type="text"\>。此外，在MyInput组建的模板中还使用了class属性，同时在DOM模板中也设置了class属性，在这种情况下，两个class属性的值会被合并，最终渲染为\<input class="clild parent" type="text"\>。需要注意的是，只有class和style属性的值会合并，对于其他属性，从外部提供给组件的值会替代掉组件内部设置好的值。假设MyInput组件的模板是\<input type="text"\>, 如果父组件传入type="checkbox",就会替代掉type="text", 最后渲染结果就变成了\<input type="checkbox"\>。

2. 禁用属性继承

如果不希望组件自动继承属性，可以在组件的选项中设置inheritAttrs:false。例如：
```
app.component('my-component', {
    inheritAttrs: false,
    // ...
})
```
禁用属性继承的常见情况是需要将属性应用于根节点之外的其他元素。将inheritAttrs选项设置为false后，可以通过使用组件的$attrs属性将在组件上设置的属性应用到其他元素上。代码如下：
```
<data-picker data-status="activated"></data-picker>

app.component('data-picker', {
    inheritAttrs: false,
    template: `
        <div class="data-picker">
            <input type="datetime" v-bind="$attrs" />
        </div>
    `
})
```
3. 多个根节点上的属性继承
与单个根节点组件不同，具有多个根节点的组件无法自动继承属性，需要显式地在指定元素上绑定$attrs属性，如果没有绑定，会发出运行时警告。代码如下所示：
```
<custom-layout id="custom-layout" @click="changeValue"></custom-layout>

app.component('custom-layout', {
    template: `
        <header>...</header>
        <main v-bind="$attrs">...</main>
        <footer>...</footer>
    `
})
```
custom-layout组件最终渲染结果如下：
```
        <header>...</header>
        <main id="custom-layout">...</main>
        <footer>...</footer></div>
```
如果\<main\>元素上单击，将触发父组件实例的changeValue()方法。

## 10.3 监听子组件事件

前面介绍了父组件可以通过prop向子组件传递数据，反过来，子组件的某些功能需要与父组件进行通信，那该如何实现？

在Vue.js中，这是通过自定义事件实现的。子组件使用$emit()方法触发事件，父组件使用v-on指令监听子组件的自定义事件。$emit()方法的语法形式如下。
```
$emit( eventName, [...args] )
```
eventName为事件名，args为附加参数，这些参数会传给事件监听器的回调函数。如果子组件需要向父组件传递参数，就可以通过第二个参数来传。

例如如下子组件：
```
app.component('child', {
    data: function () {
        return {
            name: '张三'
        }
    },
    methods: {
        handleClick() {
            //调用实例的$emit()方法触发自定义事件greet，并传递参数
            this.$emit('greet', this.name);
        }
    },
    template: '<button @click="handleClick">开始欢迎</button>'
})
```
子组件的按钮接收到click时间后，调用$emit()方法触发一个自定义事件。使用组件时，可以使用v-on指令监听greet事件。代码如下：
```
<div id="app">
    <child @greet="sayHello"></child>
</div>

const app = Vue.createApp({
    methods: {
        //自定义事件的附加参数会自动传入方法
        sayHello(name) {
            alert("Hello, " + name)
        }
    }
});
```
与组件和prop不同，事件名不提供任何自动大小写转换。调用$emit()方法触发的事件名称与用于监听该事件名称要完全匹配。

如果在v-on指令中直接使用JavaScript语句，则可以通过$event访问自定义事件的附加参数。例如，在子组件中：
```
<button @click="$emit('enlarge-text', 0.1)">
    Enlarge text
</button>
```
在父组件的模板中：
```
<blog-post ... @enlarge-text="postFontSize += $event"></blog-post>
```
下面看一个实际的例子。通过帖子列表功能设计两个组件，实现一个BBS项目：PostList和PostListItem，PostList负责整个帖子列表的渲染，PostListItem负责单个帖子的渲染。帖子列表数据在PostList组件中维护，当增加新帖子或删除旧帖子时，帖子列表数据会发生变化，从而引起整个列表数据的重新渲染。这里有一个问题，就是每一个帖子都有一个“点赞”按钮，当单击按钮时，点赞数加1。对于单个帖子，除了点赞数要变化外，其他信息（如标题、发帖人等）都不会发生变化，，那么如果在PostListItem中维护点赞数，状态的管理就会比较混乱，子组件和父组件都会发生状态变化，显然这不是很合理。为此，我们决定在PostList中维护点赞数，而把PostListItem设计成无状态组件，这样所有的状态变化都在父组件中维护。“点赞”按钮在子组件中，为了向父组件通知单击事件，可以使用自定义事件的方式，通过$emit()方法触发，父组件通过v-on指令监听自定义事件。代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.3监听子组件事件</title>
</head>
<body>
    <div id="app">
        <post-list></post-list>
    </div>

    <script>
        const app = Vue.createApp({});

        //子组件
        const PostListItem = {
            methods: {
                handleVote() {
                    //触发自定义事件
                    this.$emit('vote');
                }
            },
            props: ['post'],
            template: 
            `
                <li>
                    <p>
                        <span>标题： {{ post.title }} | 发帖人：{{ post.author }} | 发帖时间： {{ post.date }} | 点赞数： {{ post.vote }}</span>
                    <p>
                <li>
            `
        };
        // 父组件

        app.component('PostList', {
            data() {
                return {
                    posts: [
                        { id: 1, title: '《Servlet/JSP深入详解》', author: '张三', date: '2019-10-21 20:10:15', vote: 0 },
                        { id: 1, title: '《VC++深入详解》', author: '李四', date: '2019-10-11 20:10:15', vote: 0 },
                        { id: 1, title: '《Vue深入详解》', author: '王五', date: '2020-10-21 20:10:15', vote: 0 },
                    ]
                }
            },
            components: {
                PostListItem
            },
            methods: {
                //自定义事件vote的事件处理器方法
                handleVote(id) {
                    this.posts.map(item => {
                        item.id === id ? { ...item, vote: ++item.vote } : item;
                    })
                }
            },
            template:
            `
                <div>
                    <ul>
                        <PostListItem
                            v-for="post in posts"
                            :key="post.id"
                            :post="post"
                            @vote="handleVote(post.id)"/> <!-- 监听自定义事件 -->
                    </ul>
                </div>
            `
        });

        app.mount('#app');
    </script>
</body>
</html>
```
在子组件中触发的事件可以在emits选项中进行定义。例如：
```
app.component('custom-form', {
    emits: ['in-focus', 'submit', ]
})
```
如果在emits选项中定义了原生事件（如click事件），那么将使用组件事件而不是原生事件监听器。

Vue3.0删除了v-on指令的.native修饰符，该修饰符用于让组件可以监听原生事件，而现在，Vue3.0会把子组件上中未定义为组件触发的事件的所有事件监听器作为原生事件侦听器添加到子组件的根元素上（除非在子组件的选项中设置了inheritAttrs: false)。

建议在组件中定义所有要触发的事件，以便可以更好地记录组件应该如何工作。

与prop的类型验证类似，也可以采用对象语法而不是数组语法为定义的事件进行验证。要添加验证，需要为事件分配一个函数，该函数接收传递给$emit调用的函数，并返回一个布尔值以指示事件是否有效。代码如下：
```
app.component('custom-form', {
    emits: {
        //无验证
        click: null,

        //验证submit事件
        submit: ({ email, password }) => {
            if (email && password) {
                return true
            } else {
                console.warn('Invalid submit event payload!')
                return false
            }
        }
    },
    methods: {
        submitForm() {
            this.$emit('submit', { email, password})
        }
    }
})
```

## 10.4 在组件上使用v-model指令

在表单元素上使用v-model指令可以实现数据双向绑定。例如：
```
<input type="text" v-model="message" />
```
等同于:
```
<input :value="message" @input="message = $event.target.value" />
```
很多表单UI组件都是对HTML的表单控件的封装，在使用浙这些UI组件时，也可以使用v-model指令实现数据双向绑定。但是在组件上使用v-model指令时，情况会有所不同，代码如下：
```
<my-input v-model="message"></my-input>
```
v-model会执行以下操作：
```
<my-input
    :model-value="message"
    @update:model-value="message = $event">
</my-input>
```
这样的话，组件内部\<input\>元素就必须将value属性绑定到modelValue prop上，在input事件发生时，使用新的输入值触发update:modelValue事件。按照这个要求，可以给出如下的MyInput组件的实现代码：
```
const app = Vue.createApp({
    data() {
        return {
            message: 'Vue教程'
        }
    }
});
app.component('MyInput', {
    props: ['modelValue'],
    template: 
    `
        <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
    `
});

app.mount('#app');
```
在自定义组件中创建v-model功能的另一种方法是使用计算属性，在计算属性中定义get()和set()方法，get()方法返回modelValue属性或用于绑定的任何属性，set()方法为该属性触发相应的$emit。

修改上述MyInput组件的代码如下所示：
```
app.component('MyInput', {
    props: ['modelValue'],
    template:
    `
        <input v-model="value">
    `,
    computed: {
        value: {
            get() {
                return this.modelValue
            },
            set(newValue) {
                this.$emit('update:modelValue', newValue);
            }
        }
    }
});
```
完整代码如下：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.4 components-input-v-model</title>
</head>
<body>
    <div id="app">
        <my-input v-model="message"></my-input>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({
            data() {
                return {
                    message: 'Vue教程'
                }
            }
        });

        app.component('MyInput', {
            data: function() {
                return {
                    inpuStyles: {
                        'background-color': '#cdcdcd',
                        opacity: 0.5,
                    },
                }
            },
            props: ['modelValue'],
            template:
            `
                <div>
                    <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)">
                    <label>{{ modelValue }}</label>
                </div>
            `
        });

        const vm = app.mount('#app');
    </script>
</body>
</html>
```
代码部分，在props选项中定义了modelValue prop，modelValue可以作为数据属性使用。

在Console窗口中输入vm.message="hello",可以看到文本输入控件中的内容和\<label\>元素的内容都发生了改变。

### 10.4.1 v-model的参数

默认情况下，组件上的v-model使用modelValue作为prop,update:modelValue作为事件，可以给v-model指令传递一个参数来修改默认的名称。

例如，要使用名字title作为prop，可以将title作为参数传递给v-model指令。代码如下：
```
<my-input v-model:title="message"></my-input>
```
在这种情况下，MyInput组件需要一个title prop,以及触发update:title事件保证同步。代码如下；
```
app.component('MyInput', {
    props: {
        title: String
    }，
    template:
    `
        <div>
            <input :value="title" @input="$emit('update:title', $event.target.value)">
            <label>{{ title }}</label>
        </div>
    `
});
```
从Vue3.0开始，可以在同一个组件上进行多个v-model绑定。利用v-model的参数机制，每个v-model可以同步到不同的prop,而不需要在组价中添加额外的选项。

如下所示：
```
<user-name
    v-model:first-name="firstName"
    v-model:last-name="lastName"
></user-name>

const app = Vue.createApp({})

app.component('user-name', {
    props: {
        firstName: String,
        lastName: String,
    },
    template:
    `
        <input
            type="text"
            :value="firstName"
            @input="$emit('update:lastName', $event.target.value)">
    `
})
```

### 10.4.2 处理v-model的修饰符

在第9章讲解v-model指令时，我们介绍了.trim、.lazy和.number这3个内置修饰符，但某些情况下，我们可能想要添加自定义修饰符。

接下来创建一个自定义修饰符capitalize,它将v-model绑定提供的字符串的第一个字母大写。添加到组件v-model的修饰符将通过modelModifiers prop提供给组件。代码如下：
```
<my-input v-model.capitalize="message"></my-input>

app.component('MyInput', {
    props: {
        modelValue: String,
        // modelModifiers prop 默认为空对象
        modelModifiers: {
            default: () => ({})
        }
    },
    template:
    `
        <div>
            <input
                :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)">
            <label>{{ modelValue }}</label>
        </div>
    `,
    created() {
        console.log(this.modelModifiers) // { capitalize: true}
    }
});
```
当组件的created生命周期钩子触发时，modelModifiers prop包含capitalize属性，它的值为true。接下来可以通过检查capitalize值的真假，在\<input\>元素触发input事件时，将字符串的首字母大写。代码如下：
```
<my-input v-model.capitalize="message"></my-input>

const app = Vue.createApp({
    data() {
        return {
            message: ''
        }
    }
});

app.component('MyInput', {
    props: {
        modelValue: String,
        // modelModifiers prop 默认为空对象
        modelModifiers: {
            default: () => ({})
        }
    },
    methods: {
        emitValue(e) {
            let value = e.target.value
            if (this.modelModifiers.capitalize) {
                value = value.charAt(0).toUpperCase() + value.slice(1)
            }
            this.$emit('update:modelValue', value)
        }
    },
    template:
    `
        <div>
            <input :value="modelValue" @input="emitValue">
            <label>{{ modelValue }}</label>
        </div>
    `
});
const vm = app.mount('#app');
```
在文本输入框输入英文字符，其首字母会自动转换为大写。

对于带参数的v-model绑定，生成的prop的名字是arg + "Modifiers"。我们看下面代码：
```
<my-input v-model:title.capitalize="message"></my-input>

app.component('MyInput', {
    props: {
        title: String,
        titleModifiers: {
            default: () => ({})
        }
    },
    methods: {
        emitValue(e) {
            let value = e.target.value
            if (this.titleModifiers.capitalize) {
                value = value.charAt(0).toUpperCase() + value.slice(1)
            }
            this.$emit('update:title', value)
        }
    },
    template:
    `
        <div>
            <input :value="title" @input="emitValue">
            <latel>{{ title }}</latel>
        </div>
    `
});
```

## 10.5 实例：combobox

很多界面UI库都有组合框（combobox），它是由一个文本框和下拉框组成的，HTML远程的表单控件中时没有组合框的，不过我们可以利用提供的组件功能自己实现一个组合框。

下面是文本框、下拉框的组合案例，10.5combobox.html:
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Combobox</title>
</head>
<body>
    <div id="app">
        <combobox 
            label="请选择了解信息的渠道"
            :list="['报纸','网络','朋友介绍']"
            v-model="selectedVal">
        </combobox>
        <span>选中的值是： {{ selectedVal }}</span>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const app = Vue.createApp({
            data() {
                return {
                    selectedVal: ''
                }
            }
        });

        app.component('combobox', {
            props: ['label','list','modelValue'],
            template: `
                <div>
                    <label style="float: left;">
                        {{ label }}
                    </label>
                    <table>
                        <tr>
                            <td>
                                <input 
                                    :value="modelValue"
                                    @input="$emit('update:modelValue',$event.target.value)">
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <select
                                    :value="modelValue"
                                    @change="$emit('update:modelValue',$event.target.value)">
                                    <option disabled value="">请选择</option>
                                        <option v-for="item in list" :value="item">
                                            {{item}}
                                        </option>
                                </select>
                            </td>
                        </tr>
                    </table>
                </div>
            `
        })
        app.mount('#app');
    </script>
</body>
</html>
```
组建部分请结合10.4章节一起看。combobox组件还有需要完善的地方，如list属性现在只能接收数组，也应该允许能够接收一个对象，然后用对象属性名作为\<option\>元素value属性的值，用对象属性的值作为\<option\>元素的内容，可以自行完善代码。

## 10.6 使用插槽分发内容

组件是当作自定义元素使用的，元素可以有属性和内容，通过组件定义的prop接收属性值，可以解决属性问题，那么内容呢？可以通过\<slot\>元素解决。此外，插槽（slot）也可以作为父子组件之间通信的另一种实现方式。

下面是一个简单的自定义组件。
```
Vue.component('greeting', {
    template: '<div><slot></slot></div>'
})
```
在组件模板中，\<div\>内部元素使用了一个\<slot\>元素，可以把这个元素理解为占位符。

使用该组件的代码如下：
```
<greeting>Hello,Vue.js</greeting>
```
\<greeting\>元素在给出了内容，在渲染组件时，这个内容会置换组件内部的\<slot\>元素。最终渲染结果如下：
```
<div>Hello, Vue.js</div>
```

### 10.6.1 编译作用域

如果想通过插槽向组件传递动态数据。例如：
```
<greeting>Hello, {{ name }}</greeting>
```
那么要清楚一点，name是在父组件的作用域下解析的，而不是在greeting组件的作用域下解析。在greeting组件内部定义的name数据属性，在这里访问不到的，name必须存在于父组件的data选项中。这就是编译作用域的问题。

父组件模板中的所有内容都是在父级作用域内编译；子组件模板中的所有内容都是在子作用域内编译。

### 10.6.2 默认内容

在组件内部使用\<slot\>元素时，可以在该元素指定一个默认内容，以防止组件的使用者没有给该组件传递内容。例如，一个用作提交按钮的组件\<submit-button\>的模板内容如下：
```
<button type="submit">
    <slot>提交</slot>
</button>
```
在父级组件中使用\<submit-button\>,但是不提供插槽内容。代码如下：
```
<submit-button></sumbit-button>
```
那么该组件的渲染结果如下：
```
<button type="submit">
    提交
</button>
```
如果父级组件提供了插槽内容，代码如下所示：
```
<submit-button>注册</submit-button>
```
那么该组件的渲染结果如下：
```
<button type="submit">
    注册
</button>
```

### 10.6.3 命名插槽

在开发组件时，可能需要用到多个插槽。例如，有一个布局组件\<base-layout\>,它的模板内容需要如下的形式：
```
<div class="container">
    <head>
        <!-- 我们希望把页头放这里 -->
    </head>

    <main>
        <!-- 我们希望把主要内容放这里 -->
    </main>

    <footer>
        <!-- 我们希望把页脚放这里 -->
    </footer>
</div>
```
遇到这种情况，可以使用命名的插槽，\<slog\>元素有一个name属性，可以定义多个插槽。代码如下：
```
<div class="container">
    <header>
        <slot name="header"></slot>
    </header>
    <main>
        <slot></slot>
    </main>
    <footer>
        <slot name="footer"><slot>
    </footer>
</div>
```
没有使用name属性的\<slot\>元素具有隐匿名称default。

在向命名插槽提供内容的时候，在一个\<template\>元素上使用v-slot指令，并以v-slot参数的形式指定插槽的名称。代码如下所示：
```
<base-layout>
    <template v-slot:header>
        <h1>这里是页头部分，如导航栏</h1>
    </template>

    <p>主要内容的一个段落</p>
    <p>另一个段落</p>

    <template v-slot:footer>
        <p>这里是页脚部分，如联系方式，友情链接</p>
    </template>
</base-layout>
```
现在\<template\>元素中的所有内容都将被传递到相应的插槽（不包含\<template\>元素本身）。任何没有被包裹在带有v-slot的\<template\>元素中的内容都会被视为默认插槽的内容。

对于默认插槽的内容传递，也可以利用默认插槽的隐含名称default,使用\<template\>元素对内容进行包裹。代码如下：
```
<base-layout>
    <template v-slot:header>
        <h1>这里是页头部分，如导航栏</h1>
    </template>

    <template v-slot:default>
        <p>主要内容的一个段落</p>
        <p>另一个段落</p>
    </template>

    <template v-slot:footer>
        <p>这里是页脚部分，如联系方式，友情链接</p>
    </template>
</base-layout>
```
无论采用哪种方式，最终渲染的结果都是一样的。代码如下：
```
<div class="container">
    <header>
        <h1>这里是页头部分，如导航栏</h1>
    </header>
    <main>
        <p>主要内容的一个段落</p>
        <p>另一个段落</p>
    </main>
    <footer>
        <p>这里是页脚部分，如联系方式，友情链接</p>
    </footer>
</div>
```
要注意，v-slot指令只能在\<template\>元素或组件元素上使用。在组件元素上使用有一些限制，请参见第10.6.4章节

与v-bind和v-on指令一样，v-slot指令也有缩写语法，即用“#”号替换“v-slot:”。代码如下：
```
<base-layout>
    <template #header>
        <h1>这里是页头部分，如导航栏</h1>
    </template>

    <template #default>
        <p>主要内容的一个段落</p>
        <p>另一个段落</p>
    </template>

    <template #footer>
        <p>这里是页脚部分，如联系方式，友情链接</p>
    </template>
</base-layout>
```

### 10.6.4 作用域插槽

前面介绍过，在父级作用域下，在插槽内容中是无法访问到子组件的数据属性的，但有时候需要在父级的插槽内容中访问子组件的数据，为此，可以在子组件的\<slot\>元素上使用v-bind指令绑定一个prop。代码如下：
```
app.component('my-button', {
    data() {
        return {
            titles: {
                login: '登录',
                register: '注册',
            }
        }
    },
    template: 
    `
        <button>
            <slot :values = "titles">
                {{ titles.login }}
            </slot>
        </button>
    `
});
```
这个按钮的名称可以在“登录”和“注册”之间切换，为了让父组件可以访问titles，在\<slot\>元素上使用v-bind指令绑定一个values属性，称为插槽prop，这个prop不需要在props选项中声明。

在父级作用域下使用该组件时，可以给v-slot指令一个值来定义组件提供的插槽prop的名字。代码如下：
```
<my-button>
    <template v-slot:default="slotProps">
        {{ slotProps.values.register }}
    </template>
</my-button>
```
因为\<my-button\>组件内的插槽是默认插槽，所有这里使用其隐含的名字default，然后给出一个名字slotProps，这个名字可以随便取，代表的是包含组件内所有插槽prop的一个对象，然后就可以利用这个对象访问组件的插槽prop，values prop是绑定到titles数据属性上的，所以可以进一步访问titles的内容。最后渲染的结果是：\<button\>注册\</button\>。

在上面的例子中，父级作用域只是给默认插槽提供了内容，在这种情况下，可以省略\<template\>元素，把v-slot指令直接用在组件的元素标签上。代码如下：
```
<my-button v-slot:default="slotProps">
    {{ slotProps.values.register }}
</my-button>
```
上述代码还可以进一步简化，省略default参数。代码如下：
```
<my-button v-slot="slotProps">
    {{ slotProps.values.register }}
</my-button>
```
正如未指明的内容对应默认的插槽一样，不带参数的v-slot指令被假定为对应默认插槽。

默认插槽的简写语法写好，但不能与命名的插槽混合使用，因为它会导致作用域不明确。例如：
```
<!-- 无效，会导致警告 -->
<my-button v-slot="slotProps">
    {{ slotProps.values.register }}
    <template v-slot:other="otherSlotProps">
        slotProps在这里不可用
    </template>
</my-button>
```
只要出现多个插槽，就应该始终为所有的插槽使用完整的基于\<template\>的语法。代码如下：
```
<my-button>
    <template v-slot:default="slotProps">
        {{ slotProps.values.register }}
    </template>

    <template v-slot:other="otherSlotProps">
        ...
    </template>
</my-button>
```
作用域插槽的内部工作原理是将插槽内容包装到传递单个参数的函数中来工作。代码如下：
```
function (slotProps) {
    //插槽内容
}
```
这意味着v-slot的值实际上是可以在任何能够作为函数定义中的参数的JavaScript表达式。所以在支持ES6的环境下，可以使用解构语法提取特定的插槽prop。代码如下：
```
<my-button v-slot="{values}">
    {{ valuse.register }}
</my-button>
```
这使模板更加简洁，尤其是在该插槽提供了多个prop的时候。与对象解构语法（参考3.7.1节）中可以重命名对象属性一样，提取插槽prop的时候也可以重命名。代码如下：
```
<my-button v-slot="{values:titles}">
    {{ titles.register }}
</my-button>
```

### 10.6.5 动态插槽名

动态指令参数也可以用在v-slot指令上，定义动态的插槽名。代码如下：
```
<base-layout>
    <template v-slot:[dynamicSlotName]
        ...
    </template>
</base-layout>
```
dynamicSlotName需要在父级作用域下能够正常解析，如存在对应的数据属性或计算属性。如果是在DOM模板中使用，还要注意元素属性名的大小写问题。

## 10.7 动态组件

在页面应用程序中，经常遇到多标签页面，在Vue.js中，可以通过动态组件来实现。组件的动态切换是通过在\<component\>元素上使用is属性实现的。

下面通过一个例子学习动态组件的使用。本例的界面显示效果如图所示：

3个标签是3个按钮，下面的内容部分由组件来实现，3个按钮对应3个组件，按钮响应click事件，单击不同按钮时切换至不同的组件，组件切换通过\<component\>元素和其上的is属性实现。

3个组件的实现代码如下：
```
app.component('tab-introduce', {
    data() {
        return {
            content: 'Vue教程'
        }
    },
    template: '<div><input v-model="content"></div>'
});
app.component('tab-comment', {
    template: '<div>这是一本好书</div>'
});
app.component('tab-qa', {
    template: '<div>有人看过吗？怎么样？</div>'
});
```
第一组件的模板使用了一个\<input\>元素，便于我们修改内容，这主要是为了引出后面的知识点。

在根实例中定义了两个数据属性和一个计算属性，主要是为了便于使用v-for指令循环渲染button按钮，以及动态切换组件。代码如下：
```
const app = Vue.createApp({
    data() {
        return {
            currentTab: 'introduce',
            tabs: [
                { title: 'introduce', displayName: '图书介绍' },
                { title: 'comment', displayName: '图书评价' },
                { title: 'qa', displayName: '图书问答' },
            ]
        }
    },
    computed: {
        currentTabComponent: function() {
            return 'tab-' + this.currentTab
        }
    }
})
...
app.mount('#app');
```
数据属性currentTab代表当前的标签页，tabs是一个数组对象，通过v-for指令渲染代表标签的3个按钮，计算属性currentTabComponent代表当前选中的组件。

接下来就是在与实例关联的DOM模板中渲染按钮，以及动态切换组件的代码。代码如下：
```
<div id="app">
    <button
        v-for="tab in tabs"
        :key="tab.title"
        :class="['tab-button', { active: currentTab === tab.title }]"
        @click="currentTab = tab.title">
        {{ tab.displayName }}
    </button>

    <component
        :is="currentTabComponent"
        class="tab">
    </component>
</div>
```
当单击某个标签按钮时，更改数据属性currentTab的值，这将导致计算属性currentTabComponent的值更新，\<component\>元素的is属性使用v-bind指令绑定到一个已注册组件的名字上，随着计算属性currentTabComponent值的改变，组件也就自动切换了。

剩下的代码就是CSS样式的设置了。完整代码如下dynamic-component.html：
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>10.7 dynamic-component</title>
    <style>
        div {
            width: 400px;
        }
        .tab-button {
            padding: 6px 10px;
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
            border: solid 1px #ccc;
            cursor: pointer;
            background: #f0f0f0;
            margin-bottom: -1px;
            margin-right: -1px;
        }
        .tab-button:hover {
            background: #e0e0e0;
        }
        .tab-button.active {
            background: #cdcdcd;
        }
        .tab {
            border: solid 1px #ccc;
            padding: 10px;
        }
    </style>
</head>
<body>
    <div id="app">
        <button
            v-for="tab in tabs"
            :key="tab.title"
            :class="['tab-button', { active: currentTab === tab.title }]"
            @click="currentTab = tab.title">
            {{ tab.displayName }}
        </button>
        <keep-alive>
            <component
                :is="currentTabComponent"
                class="tab">
            </component>
        </keep-alive>
    </div>

    <script>
        const app = Vue.createApp({
            data() {
                return {
                    currentTab: 'introduce',
                    tabs: [
                        { title: 'introduce', displayName: '图书介绍' },
                        { title: 'comment', displayName: '图书评价' },
                        { title: 'qa', displayName: '图书问答' },
                    ]
                }
            },
            computed: {
                currentTabComponent: function() {
                    return 'tab-' + this.currentTab
                }
            }
        });

        app.component('tab-introduce', {
            data() {
                return {
                    content: 'Vue教程'
                }
            },
            template: '<div><input v-model="content"></div>'
        });
        app.component('tab-comment', {
            template: '<div>这是一本好书</div>'
        });
        app.component('tab-qa', {
            template: '<div>有人看过吗？怎么样？</div>'
        });

        app.mount('#app');
    </script>
</body>
</html>
```
上例第一个组件的模板中使用了一个\<input\>元素，修改后，切换到其他标签页，然后再切换回来，你会发现之前修改的内容并没有保存下来。

这是因为每次切换新标签的时候，Vue都创建一个新的currentTabComponent实例。在本例中，希望组件在切换的时候，可以保持组件的状态，以避免重复渲染导致的性能问题，也为了让用户的体验更好。要解决这个问题，可以用一个\<keep-alive\>元素将动态组件包裹起来。代码如下：
```
<keep-alive>
    <component
        v-bind:is="currentTabComponent"
        class="tab">
    </component>
</keep-alive>
```
再次测试页面，可以发现组件的状态被保存下来了。

## 10.8 异步组件

在大型的应用中，可能需要将应用分割成较小的代码块，并且只在需要时才从服务器加载组件。为了实现这一点，Vue给出了一个defineAsyncComponent()方法，该方法接收一个返回Pormise的工厂函数，当从服务器检索到组件定义的时候，应该调用Promise的resolve调用。代码如下：
```
const app = Vue.createApp({})

const AsyncComp = Vue.defineAsyncComponent(
    () =>
        new Promise(( resolve, reject) => {
            resolve({
                template: '<div>I am async!</div>'
            })
        })
)

app.component('async-example', AsyncComp)
```
当然也可以调用reject(reason)指示加载失败。

也可以在工厂函数中返回一个Promise，因此对于Webpack 2或更高版本，以及ES6语法，可以执行以下操作。
```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => 
    import('./components/AsyncComponent.vue')
)

app.component('async-component', AsyncComp)
```
在本地注册组件时，也可以使用defineAsyncComponent()方法。代码如下：
```
import { createApp, defineAsyncComponent } from 'vue'

createApp({
    //...
    components: {
        AsyncComponent: defineAsyncComponent(() => 
            import('./components/AsyncComponent.vue')
        )
    }
})
```
defineAsyncComponent()方法还可以接收一个对象作为参数。代码如下：
```
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent({
    //工厂函数
    loader: () => import('./Foo.vue')
    //加载异步组件时要使用的组件
    loadingComponent: loadingComponent,
    //加载失败时要使用的组件
    errorComponent: ErrorComponent,
    //显示加载组件前的延迟时间，默认值是200ms
    delay: 200,
    //如果给出了超时值并超过超时值，则显示错误组件。默认没有超时值
    timeout: 3000,
    //定义组件是否可悬挂，默认值是true
    suspensible: false,
    /**
    *
    * @param {*} error 错误消息对象
    * @param {*} retry 指示当加载器promise拒绝时异步组件是否应重试的函数
    * @param {*} fail 失败结束
    * @param {*} 允许重试的最大尝试次数
    */
    onError(error, retry, fail, attempts) {
        if (error.message.match(/fetch/) && attempts <= 3) {
            //获取错误时重试，最多尝试3次
            retry()
        } else {
            //请注意，重试/失败类似于promise的resolve/reject：
            //要继续进行错误处理，必须调用其中一个
            fail()
        }
    },
})
```

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
