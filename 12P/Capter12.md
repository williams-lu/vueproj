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
代码是不是精简了很多，熟悉Reac开发的读者是不是感到似曾相识。

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
//递归
```