# 第12章 虚拟DOM和render()函数

Vue.js之所以执行性能高，一个很重要的原因就是它的虚拟DOM机制

## 12.1 虚拟DOM

浏览器在解析HTML文档时，会将文档中的元素、注释、文本等标记按照它们的层级关系组织成一棵树，这就是我们熟知的DOM树。元素、文本等是作为一个个DOM节点而存在的，对元素、文本的操作就是对DOM节点的操作。一个元素要想呈现在页面中，必须在DOM树中存在该节点，这也是在使用DOM API创建元素后，一个要将该元素节点添加到现有DOM树中的某个节点下才能渲染到页面中的原因。同样地，删除某个元素实际上就是从DOM树中删除该元素对应的节点。我们每一次对DOM的修改都会引起浏览器对页面的重新渲染，这个过程是比较耗时的。

因为早期的Web应用中页面的局部刷新不糊很多，所以对DOM进行操作的次数也就比较少，对性能的影响微乎其微，而现阶段由于单页应用程序的流行，页面跳转、更新都实在同一个页面中完成的，自然对DOM的操作也就愈加频繁，作为一款优秀的前端框架，必然要考虑DOM渲染效率的问题。Vue.js 2.0与React采用了相同的方案，在DOM之上增加一个抽象层来解决渲染效率的问题，这就是虚拟DOM。Vue3.0重写了虚拟DOM的实现，性能更加优异。

虚拟DOM使用普通的JavaScript对象描述DOM元素，在Vue.js中，每一个虚拟节点都是一个Vnode实例。

虚拟DOM是普通的JavaScript对象，访问JavaScript对象自然比访问真实DOM要快得多。Vue在更新真实DOM之前，会比较更新前后虚拟DOM解构中有差异的部分，然后采用异步更新队列的方式将差异部分更新到真是DOM中，从而减少了最终要在真实DOM上执行的操作次数，提高了页面渲染的效率。

## 12.2 render()函数

Vue推荐在大多数情况下使用模板构建HTML。然而，在一些场景下，可能需要JavaScript的编程能力，这时可以使用render()函数，它比模板更接近编译器。

下面来看一个实际应用中的例子。下面所示为一个问答页面，用户可以单击某个问题链接，跳转到对应的回答部分，也可以单击“返回顶部”链接，回到页面顶部。这是通过\<a\>标签的锚链接实现的。

![]插图

下面是带有锚点的标题的基础代码：
```
<h1>
    <a name="hello-world" href="#hello-world">
        Hello world!
    </a>
</h1>
```
如果采用组件实现上述代码，考虑到标题元素可以变化(\<1\>~\<h6\>),我们将标题的级别(1~6)定义成组件的prop,这样在调用组件时，就可以通过该prop动态设置标题元素的级别。组件的使用形式如下。
```
<anchored-heading :level="1">Hello world!</anchored-heading>
```
接下来就是组件的实现代码：
```
const app = Vue.createApp({})

app.component('anchored-heading', {
    template: 
    `
        <h1 v-if="level === 1">
            <slot></slot>
        </h1>
        <h2 v-else-if="level === 2">
            <slot></slot>
        </h2>
        <h3 v-else-if="level === 3">
            <slot></slot>
        </h3>
        <h4 v-else-if="level === 4">
            <slot></slot>
        </h4>
        <h5 v-else-if="level === 5">
            <slot></slot>
        </h5>
        <h6 v-else-if="level === 6">
            <slot></slot>
        </h6>
    `,
    props: {
        level: {
            type: Number,
            required: true,
        }
    }
})
```
虽然模板在大多数组件中都非常好用，但在本例中不太合适，模板代码冗余，且\<slot\>元素在每一级标题元素中都重复书写了。当添加锚元素时，我们还必须在每个v-if/v-else-if分支中再次复制\<slot\>元素。

下面改用render()函数重写上面的示例。代码入下archored-heading.html：
```
const app = Vue.createApp({})

app.component('anchored-heading', {
    render() {
        const { h } = Vue

        return h(
            'h' + this.level, // tag name
            {}, // props/attributes
            this.$slots.default() // array of children
        )
    },
    props: {
        level: {
            type: Number,
            required: true,
        }
    }
})
```
代码是不是精简了很多，熟悉React开发的读者是不是感到似曾相识。

$slot用于以编成方式访问由插槽分发的内容。每个命名的插槽都有相应的属性（例如，v-slot:foo的内容将在this.$slots.foo()中找到）。this.$slots.default()属性包含了所有未包含在命名插槽中的节点或v-slot:default的内容。

组件的调用代码如下：
```
<anchored-heading :level="3">
    <a name="hello-world" href="#hello-world">
        Hello world!
    </a>
</anchored-heading>
```

<br>
<br>
render()函数中最重要的就是h()函数了，下面是return语句的代码。
```
return h(
    'h' + this.level, // tag name
    {}, // props/attributes
    this.$slots.default() // array of children
)
```
h()函数返回的并不是一个真正的DOM元素，它返回的是一个纯JavaScript对象，其中包含向Vue描述应该在页面上渲染的节点类型的信息，包括任何子节点的描述，也就是虚拟节点(VNode).

h()函数的作用是创建VNode，或许将其命名为createVNote()更准确，但由于使用频繁且为了简洁，将命名为h()。

h()函数可以带3个参数，第一个参数是必须的，形式为{ String | Objecj | Function }，即该参数可以是字符串（HTML标签名）、对象（组件或一个异步组件）、函数对象（解析前两者之一的async函数）;第二个参数是可选的，形式为{ Objecj }，表示一个与模板中元素属性对应的数据对象；第三个参数也是可选的，用于生成子虚拟节点，形式为{ String | Array | Objecj }，即该参数可以是字符串（文本虚拟节点）、数组（子虚拟节点的数组）、对象（带插槽的对象）。

下面的代码给出了h()函数可以接收的各种参数的形式。
```
//@return {VNode}
h(
//-------第一个参数，必须填------------
    //{ String | Objecj | Function } tag
    //一个HTML标签名、组件或异步组件，或者解析上述任何一种的一个async()函数
    'div',

//-------第二个参数，可选------------
    //{ Objecj } props
    //一个与模板中元素属性（包括普通属性、prop和事件属性）对应的数据对象
    {},

//-------第三个参数，可选------------
    //{ String | Array | Objecj } children
    //子虚拟节点（VNodes）由h()函数构建而成
    //也可以使用字符串来生成“文本虚拟节点”或带有插槽的对象
    [
        '先写一些文本',
        h('h1', '一级标题'),
        h(MyComponent, {
            someProp: 'foobar'
        })
    ]
)
```
简单来说，h()函数的第一个参数是要创建的元素节点的名字（字符串形式）或组件（对象形式）；第二个参数是元素的属性集合（包括普通属性、prop、事件属性等），以对象形式给出；第三个参数是子节点的信息，以数组形式给出，如果该形式只有文本子节点，则直接以字符串形式给出即可，如果还有子元素，则继续调用h()函数。

下面进一步完善anchored-heading组件，将标题元素的子元素\<a\>也放到render()函数中构建。代码如下：

anchored-heading2.html
```
//递归调用将子节点的文本内容拼接成一个字符串
function getChildrenTextContent(children) {
    return children
        .map(node => {
            return typeof node.children === 'string'
            ? node.children
            : Array.isArray(node.children)
                ? getChildrenTextContent(node.children)
                : ''
        })
        .join('')
};
app.component('anchored-heading', {
    render() {
        //从子节点的文本内容创建kebab-case风格的ID
        const headingId = getChildrenTextContent(this.$slots.default())
            .toLowerCase()
            .replace(/\W+/g, '-')    //将非单词字符替换为短划线
            .replace(/(^-|-$)/g, '')   //删除前导和尾随的短横线

        return Vue.h('h' + this.level, [
            Vue.h(
                'a',
                {
                    name: headingId,
                    href: '#' + headingId,
                },
                this.$slots.default()
            )
        ])
    },
    props: {
        level: {
            type: Number,
            required: true,
        }
    }
})
```
之后就可以按照以下方式使用anchored-heading组件。
```
<anchored-heading :level="3">
    Hello world!
</anchored-heading>
```
组件树中的所有VNode必须是唯一的。例如，下面的render()函数时不合法的。
```
render() {
    const myParagraphVNode = Vue.h('p', 'hi')
    return Vue.h('div', [
        // 错误 - 重复的VNode
        myParagraphVNode, myParagraphVNode
    ])
}
```
如果真的需要重复很多相同的元素或组件，可以使用工厂函数实现。例如，下面的render()函数用完全合法的方式渲染了20个相同的段落。
```
render() {
    return Vue.h('div',
        Array.apply(null, { length: 20 }).map(() => {
            return Vue.h('p', 'hi')
        })
    )
}
```

## 12.3 用普通JavaScript代替模板功能

原先在模板中可以使用的一些功能在render()函数中没有再提供，需要我们自己编写JavaScript代码来实现。

### 12.3.1 v-if和v-foobar

只要普通JavaScript能轻松完成的操作，Vue的render()函数就没有提供专用的替代方案。例如，在使用v-if和v-for的模板中：
```
<ul v-if="items.length">
    <li v-for="item in items">{{ item.name }}</li>
</ul>
<p v-else>No Item found.</p>
```
在render()函数中可以使用JavaScript的if/else和map实现相同的功能。代码如下：
```
props: ['items'],
render() {
    if(this.items.length) {
        return Vue.h('ul', this.items.map((items) => {
            return Vue.h('li', item.name)
        }))
    }
    else {
        return Vue.h('p', 'No items found.')
    }
}
```

### 12.3.2 v-model

在render()函数中没有与v-model指令直接对应的实现方案，不过v-model指令在模板编译期间会被扩展为modelValue和onUpdate:modelValue prop,按照v-model的内在逻辑，我们自己实现即可。代码如下：
```
props: ['modelValue'],
render() {
    return Vue.h(SomeComponent, {
        modelValue: this.modelValue,
        'onUpdate:modelValue': value => this.$emit('update:modelValue', value)
    })
}
```

### 12.3.3 v-onUpdate

我们必须为事件处理程序提供一个正确的prop名称。例如，要处理click事件，prop名称应该是onClick。代码如下：
```
render() {
    return Vue.h('div', {
        onClick: $event => console.log('children', $event.target)
    })
}
```

### 12.3.4 事件和按键修饰符

对于.passive、.capture和.once这些事件修饰符，可以使用驼峰命名法将他们连接到事件名之后。代码如下所示：
```
render() {
    return Vue.h('input', {
        onClickCapture: this.doThisInCapturingMode,
        onKeyupOnce: this.doThisOnce,
        onMouseoverOnceCapture: this.doThisOnceInCapturingMode,
    })
}
```
对于其他的事件和按键修饰符，则不需要特殊的API，因为在处理程序中可以使用事件方法实现相同的功能，如下表。

与修饰符等价的事件方法

修饰符  |    处理函数中的等价操作
------------------|-----------------------------------|
.stop   |   event.stopPropagation() |
.prevent|   event.preventDefault()  |
.self   |   if(event.target!==event.currentTarget)return
按键：.enter、.13|    if(event.keyCode!==13)return(对于其他的按键修饰符，可将13改成其对应的按键码)|
修饰键：.ctrl、.alt、.shift、.meta |    if(!event.ctrlKey)return(可将ctrlKey分别修改为altKey、shiftKey或metaKey)

下面是一个使用所有修饰符的例子。
```
render() {
    return Vue.h('input', {
        onKeyUp: event => {
            //如果触发事件的元素不是事件绑定的元素，则返回
            if (event.target !== event.currentTarget) return
            //如果按下的不是Enter键（13）或没有同时按下Shift键，则返回
            if(!event.shiftKey || event.keyCode !== 13) return
            //阻止事件传播
            event.stopPropagation()
            //阻止该元素默认的keyup事件处理
            event.preventDefault()
            //...
        }
    })
}
```

### 12.3.5 插槽

通过this.$slots可以访问插槽的内容，插槽的内容是VNode数组。代码如下：
```
render() {
    //`<div><slot></slot></div>`
    return Vue.h('div', {}, this.$slots.default())
}

//访问作用域插槽
props: ['message'],
render() {
    //`<div><slot :text="message"></slot></div>`
    return Vue.h('div', {}, this.$slots.default({
        text: this.message
    }))
}
```
如果要使用render()函数将插槽传递给子组件，可以编写下面的代码：
```
render() {
    //`<div><child v-slot="props"><span>{{ props.text }}</span></child></div>`
    return Vue.h('div', {
        Vue.h(
            Vue.resolveComponent('child'),
            {},
            //将slots作为对象传递
            //格式为：{ name: props => VNode | Array<VNode> }
            {
                default: (props) => Vue.h('span', props.text)
            }
        )
    })
}
```

## 12.4 JSX

相信读者发现，即使是简单的模板，在render()函数中编写也很复杂，而且模板中的DOM解构面目全非，可读性很差。当模板比较复杂，元素之间嵌套的层级较多时，在render()函数中一层层嵌套的h()函数也令人迷惑。

熟悉React框架的读者应该知道，React的render()函数使用JSX语法来简化模板的编写，使模板的编写变得和普通DOM模板一样。在Vue.js中，可以通过一个Babel插件（https://github.com/vuejs/jsx-next)让Vue支持JSX语法，从而简化render()函数中的模板创建。

>提示：<br>
>JSX的全称是JavaScript XML，是一种JavaScript的语法扩展，用于描述用户界面。其格式比较像是模板语言，但事实上完全是在JavaScript内部实现的。

例如，对于下面DOM结构：
```
<anchored-heading :level="1">
    <span>Hello</span> World!
</anchored-heading>
```
不使用JSX语法的render()函数实现如下：
```
import AnchoredHeading from './AnchoredHeading.vue'

const app = createApp({
    render() {
        return (
            <AnchoredHeading level={1}>
                <span>Hello</span> Wrold!
            </AnchoredHeading>
        )
    }
})

app.mount('#demo')
```
JSX的语法自行查阅。

## 12.5 实例：使用render()函数实现帖子列表

10.3小节给出了一个BBS项目的帖子列表组件的实例，本节使用render()函数改写该实例。

首先是单个帖子的组件PostListItem。代码如下:

PostListItem
```
app.component('PostListItem', {
    props: {
        post: {
            type: Objecj,
            required: true
        }
    },
    render() {
        return Vue.h('li', {
            Vue.h('p', [
                Vue.h('span',
                    //这是<span>元素的内容
                    '标题：' + this.post.title + ' | 发帖人：' + this.post.author
                    + ' | 发帖时间：' + this.post.date + ' | 点赞数：' + this.post.vote
                ),
                Vue.h('button', {
                    //单击按钮，向父组件提交自定义事件vote
                    onClick: () => this.$emit('vote')
                }, '赞')
            ])
        });
    }
})
```
这部分代码最好结合10.3小节的例一起来看。一定要清楚h()函数的3个参数的作用，因为后两个参数是可选的，所以要注意区分代码中哪部分是第二个参数传参，哪部分是第三个参数传参。简单的区分方式就是看是对象传参还是数组传参，如果是对象传参，就是第二个参数（设置元素的属性信息）；如果是数组传参，就是第三个参数（设置子节点信息）。

帖子列表组件PostList的代码如下：

PostList
```
//父组件
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
    methods: {
        //自定义事件vote的事件处理器方法
        handleVote(id) {
            this.posts.map(item => {
                item.id === id ? { ...item, vote: ++item.vote } : item;
            })
        }
    },
    render() {
        let postNodes = [];
        //this.posts.map取代v-for指令，循环遍历posts
        //构造子组件的虚拟节点
        this.posts.map(post => {
            let node = Vue.h(Vue.resolveComponent('PostListItem'), {            //这是针对子组件的处理方式
                post: post,                                                   //这是针对子组件的处理方式
                onVote: () => this.handleVote(post.id)                       //这是针对子组件的处理方式
            });
            postNodes.push(node);
        })
        return Vue.h('div', [
            Vue.h('ul', [postNodes])
        ]);
    },
})
```

## 12.6 小结

本章介绍了虚拟节点和虚拟DOM，并详细介绍了render()函数，实际上，Vue的模板也是被编译成了render()函数。

render()函数中最重要的就是h()函数，重点是要理解h()函数的3个参数的作用，这样才能正确使用它。

从本章给出的例子可以看出，即使是简单的模板，在render()函数中编写也很复杂，而且模板中的DOM解构面目全非，可读性很差。当模板比较复杂，元素之间嵌套的层级较多时，在render()函数中一层层嵌套的h()函数会使开发效率变得很低，还容易出错。所以在基于Vue.js的前端开发项目中，最好还是始终采用template方式，如果特殊情况下需要使用render()，也建议使用JSX语法简化模板的编写。