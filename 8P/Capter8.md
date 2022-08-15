# 第8章 class与style绑定

HTML元素有两个设置样式的属性: class和style,前者用于指定样式表中的class，后者用于设置内联样式。在Vue.js中可以用v-bind指令来处理它们，只需要通过表达式计算出字符串结果即可。不过，字符串拼接比较麻烦，而且容易出错，因此，将v-bind指令用于class和style时，Vue
.js专门做了增强。表达式结果的类型除了字符串之外，还可以是对象或数组。

## 8.1 绑定HTML class

### 8.1.1 对象语法

可以给v-bind:class传递一个对象，以动态地切换class

案例1：8.1.1v-bind_class案例1.html

也可以向对象传入更多属性来动态切换多个class。

案例2：8.1.1v-bind_class案例2.html

渲染结果是\<div class="static active"\>\<div\>

当绑定的数据对象如果较为复杂,可以在数据属性中单独定义一个对象,然后绑定它,例如:
```
<div id="app">
    <div v-bind:class="classObject"><div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                classObject: {
                    active: true,
                    'text-danger': false,
                }
            }
        }
    }).mount('#app');
</script>
```

也可以考虑绑定一个返回对象的计算属性,这是一个常用强大的模式.

```
<div id="app">
    <div v-bind:class="classObject"><div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                classObject: {
                    isactive: true,
                    error: null,
                }
            }
        },

        computed: {
            classObject() {
                return {
                    active: this.isActive && !this.error,
                    'text-danger': this.error && this.error.type === 'fatal',
                }
            }
        }
    }).mount('#app');
</script>
```

### 8.1.2 数组语法

除了给v-bind:class传递对象外，也可以传递一个数组，应用一个class列表。例如
```
<style>
    .active {
        width: 100px;
        height: 100px;
        background: green;
    }
    .text-danger {
        background: red;
    }
</style>

<div id="app">
    <div v-bind:class="[activeClass, errorClass]"></div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                activeClass: 'active',
                errorClass: 'text-danger'
            }
        }
    }).mount('#app');
</script>
```
渲染结果：
```
<div class="active text-danger"></div>
```
也可以使用三元表达式根据条件切换class。示例代码
```
<dvi v-bind:class="[isActive ? activeClass : '', errorClass]"></div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                activeClass: 'active',
                errorClass: 'text-danger',
                isActive: true,
            }
        }
    }).mount('#app');
</script>
```
样式类errorClass将始终添加，而activeClass只有在isActive计算为true时才会添加。

当class属性的表达式中有多个条件时，这样写比较繁琐，因而可以在数组语法中使用对象语法来简化表达式。代码如下：
```
<div v-bind:class="[{ active: isActive }, errorClass ]"></div>
```

### 8.1.3 在组件上使用class属性

当在一个具有单个根元素的自定义组件上使用class属性时，这些class将被添加到该组件的根元素上。这个元素上已经存在的class不会被覆盖。
例如：
```
const app = Vue.createApp({})

app.component('my-componnent', {
    template: `<p class="foo bar">Hi!</p>`
})
```
然后再使用该组件时添加一些class：
```
<my-componnet class="baz boo"></my-component>
```
HTML将被渲染为：
```
<p class="foo bar baz boo">Hi</p>
```
对于带数据绑定class也同样适用：
```
<my-componnet v-bind:class="{ active: isActive }"></my-component>
```
当isActive计算为true时，HTML将被渲染为：
```
<p class="foo bar active">Hi</p>
```
如果组件有多个根元素，则需要定义哪一个根元素来接收这个class，这个通过使用$attrs组件属性来指定的。如下代码所示：
```
<div id="app">
    <my-component class="baz"></my-component>
</div>

const app = Vue.createApp({})
app.component('my-component', {
    template: `
        <p :class="$attrs.class">Hi!</p>
        <span>This is a child component</span>
})
```

## 8.2 绑定内联样式

使用v-bind:style可以给元素绑定内联样式

### 8.2.1 对象语法

v-bind:style的对象语法非常像HTML的内联CSS样式语法，但其实是一个JavaScript对象。CSS属性名可以用驼峰式(camelCase)或短横线分隔（kebab-case, 记得用引号括起来）命名。示例代码：
```
<div id="app">
    <div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }">
        《Vue.js教程》
    </div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                activeColor: 'red',
                fontSize: 30,
            }
        }
    }).mount('#app');
</script>
```
显然，直接以对象字面量的方式设置CSS样式属性代码冗余，且可读性差。因此，可以在数据属性中定义一个样式对象，然后直接绑定对象，这样模板也会清晰。示例代码：
```
<div id="app">
    <div v-bind:style="styleObject">《Java教程》</div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                styleObject: {
                    activeColor: 'red',
                    fontSize: '30px',
                }
            }
        }
    }).mount('#app');
</script>
```
同样，对象语法也常结合返回对象的计算属性使用。

### 8.2.2 数组语法

v-bind:style的数组语法可以将多个样式对象应用到同一个元素上。例如：
```
<div id="app">
    <div v-bind:style="[baseStyles, moreStyles]"></div>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                baseStyles: {
                    border: 'solid 2px black',
                },
                moreStyles: {
                    width: '100px',
                    height: '100px',
                    backgroud: 'orange',
                }
            }
        }
    }).mount('#app');
</script>
```

### 8.2.3 多重值

可以为绑定的style属性提供一个包含多个值的数组，这常用于提供多个带前缀的值。例如：
```
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```
这样写只会渲染数组最后一个被浏览器支持的值。在本例中，如果浏览器支持不带浏览器前缀的flexbox，那么就只会渲染display:flex。

## 8.3 实例： 表格奇偶行应用不同的样式

我们经常会用表格显示多行数据，当数据的行数较多时，为了让用户能够区分不同的行，通常会针对奇偶行应用不同的样式，这样用户看起来会更清晰。

在本例中，先定义一个针对奇偶行的样式规则。如下：
```
.even {
    background-color: #cdcdcd;
}
```
表格数据采用v-for指令循环输出，我们知道，v-for指令可以带一个索引参数，因此可以根据这个索引参数判断奇偶行，循环索引是从0开始的，对应的是第1行，为了判断简便，将其加1后再进行判断。判断规则为（index + 1）% 2 ===0， 采用v-bind:class的对象语法，当该表达式计算为true时应用样式类even。代码如下：
```
<tr v-for="(book, index) in books"
    :key="book.id" :class="{even: (index + 1) % 2 === 0 }>
    ...
</tr>
```
完整代码：请查看table.html
