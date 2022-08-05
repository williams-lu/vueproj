# 第6章 计算属性

在模板中使用表达式非常方便，但如果表达式的逻辑过于复杂，模板就会变得臃肿不堪且难以维护。例如：
```
<div id="app">
    <p>{{ message.split('').reverse().join('') }}</p>
</div>
```
Mustache语法中的表达式调用了3个方法来最终实现字符串的反转，逻辑过于复杂，如果模板中还要多次引用此处的翻转字符串，就更加难以处理了，这是就应该使用计算属性。

## 6.1 计算属性的定义

当message属性的值改变时，reversedMessage的值也会自动更新，并且会自动同步更新DOM的部分。在浏览器的Console窗口中修改vm.message的值，可以发现reversedMessage的值也会改变。

参考例一：6.1ComputedProperties
参考例二：6.1ComputedPropertiesSetter


## 6.2 计算属性的缓存

复杂的表达式也可以放到方法中实现，然后在绑定表达式中调用方法即可。

参考例一：6.2method

既然使用方法能实现与计算属性相同的结果，那么还有必要使用计算属性吗？答案是有必要的，这是因为计算属性是基于它的响应式依赖进行缓存的，只有在计算属性的相关响应式依赖发生变化时才会更新值。这就意味着只要message还没有发生变化，多次访问reversedMessage计算属性会立即返回之前的运算结果，而不会再次执行函数；而如果采用方法，那么不管什么时候访问reversedMessage()，该方法都会被调用。

参考例二：6.2ComputedPropertiesAndMethods

那么为什么需要缓存呢？假设有一个性能开销比较大的计算机属性A，它需要遍历一个巨大的数组并做大量的计算，然后可能还有其他的计算机属性依赖于A。如果没有缓存，将不可避免地多次执行A的getter。如果业务实现不希望有缓存，那么可以使用方法来替代。

## 6.3 v-for和v-if一起使用的替代方案

在5.1.3小节中，将v-for和v-if一起使用，在渲染列表时，根据v-if指令的条件表达式的计算结果过滤列表中不满足条件的列表项。实际上，使用计算属性完成这个功能会更好。

参考例一: 6.3v-for-ComputedPerperties

Vue.js的作者不建议将v-for和v-if一起使用，这是因为即使由于v-if指令的使用只渲染了部分元素，但在每次重新渲染的时候仍要遍历整个列表，而不论渲染的元素内容是否发生了改变。

采用计算属性过滤后再遍历，可以获得以下好处：
+ 过滤后的列表只会在plans数组发生变化时才被重新计算，过滤更高效。
+ 使用v-for="plan in complatedPlans"之后，在渲染的时候只遍历已完成的计划，渲染更高效。
+ 解耦渲染层的逻辑，可维护性（对逻辑的更改和扩展）更强。

## 6.4 实例：购物车的实现

电商网站的购物车，选购的商品会先添加到购物车中，单击“进入购物车”按钮，会跳转到购物车页面，页面中会显示所有已选购商品的信息，这些信息通产包括商品名称、商品单价、商品数量、单项商品的合计金额，以及删除该项商品的链接，最后会有一个购物车中所有商品的总价。

序号    |   商品名称    |   单价    |   数量    |   金额    |   操作    
-----|----------|-----|-----|-----|-----
1|Vue无难事|188|1|188|删除
2|VC++深入了解|168|1|168|删除
3|Vue深入了解|139|1|139|删除

组件的data选项
```
data() {
    return {
        books: [
            { 
                id:1,
                title: 'Vue深入详解',
                price: 188,
                count: 1,    
            },
            {
                id:2,
                title: 'VC++深入详解',
                price: 168,
                count: 1,
            },
            {
                id:3,
                title: 'Vue无难事',
                price: 139,
                count: 1,
            },
        ]
    }
}
```

购物车中的单项商品金额是动态的，是由商品的单价和商品的数量相乘得到的。此外商品的总价也是动态的，是所有商品价格相加得到的，所以这两种数据就不适合在book对象的属性中定义了。

采用方法来实现单项商品金额，采用计算属性实现总价，删除操作的事件处理也定义一个方法。如下所示：
```
methods: {
    itemPrice(price, count) {
        return price * count;
    },
    deleteItem(index) {
        this.books.splice(index, 1);
    },
},
computed: {
    totalPrice() {
        let total = 0;
        for (let book of this.books) {
            total += book.price * book.count;
        }
        return total;
    }
}
```
商品展示设计：
使用v-for指令输出商品信息
```
<div id="app">
    <table>
        <tr>
            <th>序号</th>
            <th>商品名称</th>
            <th>单价</th>
            <th>数量</th>
            <th>金额</th>
            <th>操作</th>
        </tr>
        <tr v-for="(book, index) in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.price }}</td>
            <td>
                <button v-bind:disabled="book.count === 0" 
                v-on:click="book.count-=1">-</button>
                {{ book.count }}
                <button v-on:click="book.count+=1">+</button>
            </td>
            <td>
                {{ itemPrice(book.price, book.count) }}
            </td>
            <td>
                <button @click="deleteItem(index)">删除</button>
            </td>
        </tr>
    </table>
    <span>总价：￥{{ totalPrice }}</span>
</div>
```
说明：
(1)在\<div\>元素中，我们使用了v-cloak指令避免页面加载时的闪烁问题，当然，这需要和CSS样式规则[v-cloak]{display:none}一起使用。
(2)使用v-for指令时，我们同时使用了key属性（采用v-bind的简写语法），回顾5.1.3。
(3)商品数量的左右两边各添加了一个减号和加号按钮，用于递减和递增商品数量，当商品数量为0时，通过v-bind:display="book.count===0"禁用按钮。此外，由于两个按钮的功能都很简单，所以在使用v-on指令时，没有绑定click事件处理方法，而是直接使用了JavaScript语句。
(4)单项商品的价格通过itemPrice()方法输出。
(5)所有商品总价通过计算属性totalPrice输出。
(6)单项商品的删除通过v-on指令（采用了简写语法）绑定deleteItem()方法实现。