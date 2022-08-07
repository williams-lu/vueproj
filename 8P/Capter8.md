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