# 第9章 表单输入绑定

5.1.5小节已经简单介绍了v-model指令，表单控件的数据绑定就是用v-model指令实现的，它会根据控件类型自动选取正确的方法更新元素。由于表单控件有不同的类型，如文本输入框、复选框、单选按钮、选择框等，v-model指令在不同的表单控件上应用时也会有所差异。

## 9.1 单行文本输入框

实例：
```
<div id="app">
    <input type="text" v-model="message" value="Hello Vue">
    <p>message: {{ message }}</p>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                message: 'Vue不难的'
            }
        }
    }).mount('#app');
</script>
```
在\<input\>元素中，使用value属性设置了一个初始值，用v-model指令绑定一个表达式message，对应的数据属性时message。

示例文本框中显示的是数据属性message的值，而并没有看到\<input\>元素的value属性的值。这是因为v-model指令会忽略所有表单元素的value、checked、selected属性的初始值，而总是将当前活动实例的数据属性作为数据来源。我们应该总是在JavaScript脚本中声明初始值，或者在组件的data选项中声明初始值。

在文本输入框中随意输入一些数据，可以看到输入框下方的内容也会同时发生改变。

用户在输入数据的时候，往往会不经意地在实际数据前后输入了空格符号，或者在粘贴数据是不小心带上了制表符，表单的数据通常是要提高到服务器端的，因此在提交之前需要编写JavaScript代码对数据做一些验证，包括去掉数据前后的空白字符。v-model指令提供了一个trim修饰符，可以帮我们自动过滤输入数据首尾的空白字符。
```
<input type="text" v-model.trim="message" value="Hello Vue.js">
```
除了trim修饰符外，v-model指令还可以使用下面两个修饰符。

+ .lazy

默认情况下v-model在每次input时间触发后将输入框的值与数据进行同步，如果使用了该修饰符，则会转变为使用change时间进行同步。以斐波那契数列为例：
```
<input type="text" v-model="num">

watch: {
    num(val) {
        ...
    }
}
```
假如想计算斐波那契数列的第40个数，在输入4的时候，监听器函数就开始执行了，很显然，我们并不想这样，所以在这里加上lazy修饰符会更好一些。示例：
```
<input type="text" v-model.lazy="num">
```
+ .number

如果想自动将用户的输入数据转为数值类型，可以给v-model添加number修饰符。这通常很有用，因为即使在type="number"时，HTML输入元素的值也总是返回字符串。如果这个值无法被parseFloat()解析，则会返回原始值。

## 9.2 多行文本输入框

多行文本输入框\<textarea\>的默认值是放在元素的开始标签和结束标签之间的，所以要按以下方式绑定数据。
```
<textarea>{{ message }}</textarea>
```
但是，这并不能实现双向数据绑定，在文本框中输入的数据并不会影响message属性，解决这个问题，自然还是要用v-model。
```
<textarea v-model="message"></textarea>
```

## 9.3 复选框

复选框在单独使用和多个复选框一起使用时，v-model绑定的值会有所不同，对于前者，绑定的是布尔值，选中则值为true，未选中则值为false；后者绑定的是同一个数组，选中的复选框的值将被保存到数组中。

```
<div id="app">
    <h3>单个复选框：</h3>
    <input id="agreement" type="checkbox" v-mode="isAgree">
    <label for="agreement">{{ isAgree }}</label>

    <h3>多个复选框：</h3>
        <input id="basketball" type="checkbox" value="篮球" v-model="interests">
        <label for="basketball">篮球</label>
        <input id="football" type="checkbox" value="足球" v-model="interests">
        <label for="football">足球</label>
        <input id="volleyball" type="checkbox" value="排球" v-model="interests">
        <label for="volleyball">排球</label>
        <input id="swim" type="checkbox" value="游泳" v-model="interests">
        <label for="swim">游泳</label>

        <p>你的兴趣爱好是：{{ interests }}</p>
</div>

<script src="https://unpkg.com/vue@next"></script>
<script>
    const vm = Vue.createApp({
        data() {
            return {
                isAgree: false,
                interests: []
            }
        }
    }).mount('#app');
</script>
```
对于这种一组复选框一起使用的场景，可以考虑将变化的部分抽取出来放到组件实例的data选项中，定义一个JavaScript对象或数组，然后通过v-for执行循环渲染输出。

对于复选框，v-model指令监听的是change事件。

## 9.4 单选按钮

当单选按钮被选中时，v-model指令绑定的数据属性的值会被设置为该单选按钮的value值。示例radio.html：
```
<div id="app">
    <input id="male" type="radio" value="1" v-model="gender">
    <lavel for="male">男</label>
    <br>
    <input id="female" type="radio" value="0" v-model="gender">
    <lavel for="female">女</label>
    <br>
    <span>性别：{{ gender }}</span>
</div>

<script src="https://unpkg.com/vue@next"></script>
<script>
    const vm = Vue.createApp({
        data() {
            return {
                gender: ''
            }
        }
    }).mount('#app');
</script>
```
选中男时，gender的值为1；选中女时，gender的值为0。对于单选按钮，v-model指令监听的是change事件。

## 9.5 选择框

与复选框类似，因为选择框可以是单选，也可以是多选（指定\<select\>元素的multiple属性），因此，v-model在这两种情况下的绑定值会有所不同。单选时，绑定的是选项的值（\<option\>元素value属性的值）；多选时，绑定到一个数组，所有选中的选项的值被保存到数组中。

select.html
```
<div id="app">
    <h3>单选选择框</h3>
    <select v-model="education">
        <option disabled value="">请选择你的学历</option>
        <option>高中</option>
        <option>本科</option>
        <option>硕士</option>
        <option>博士</option>
    </select>
    <p>您的学历是：{{ education }}</p>

    <h3>多选选择框</h3>
    <select v-model="searches" multiple>
        <option v-for="option in options" :value="option.value">
            {{ option.text }}
        </option>
    </select>
    <p>您选择的搜索引擎是：{{ searches }}</p>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                education: '',
                searches: [],
                options: [
                    { text: '百度', value: 'baidu.com' },
                    { text: '谷歌', value: 'google.com' },
                    { text: '必应', value: 'bing.com' },
                ]
            }
        }
    }).mount('#app');
</script>
```
单选选择框的v-model绑定的是数据属性education，选中“本科”时，education的值是字符串“本科”。多选选择框绑定的是数据属性searches（数组类型），如果同时选中“百度”和“谷歌”，其值为["baidu.com","google.com"]。

同样，可以把数据部分抽取出来，组成一个对象或数组，在组件实例的data选项中定义好。对于选择框，v-model指令监听的是change事件。

## 9.6 值绑定

v-model针对不同的表单控件，绑定的值都有默认的约定。例如，单个复选框绑定的是布尔值，多个复选框绑定的是一个数组，选中的复选框value属性的值被保存到数组中。有时候可能想要改变默认的绑定规则，那么可以使用v-bind把值绑定到当前活动实例的一个动态属性上，并且这个属性的值可以不是字符串。

### 9.6.1 复选框

在使用单选框时，在\<input\>元素上可以使用两个特殊的属性true-value和false-value来指定选中状态下和未选中状态下v-model绑定的值是什么。
```
<div id="app">
    <input id="agreement" type="checkbox" v-mode="isAgree" true-value="yes" false-value="no">
    <label for="agreement">{{ isAgree }}</label>
</div>

<script>
    const vm = Vue.createApp({
        data() {
            return {
                isAgree: false
            }
        }
    }).mount('#app');
</script>
```

true-value属性和false-value属性也可以使用v-bind，将它绑定到data选项中的某个数据属性上。
```
    <div id="app">
        <input id="agreement" type="checkbox" v-mode="isAgree" :true-value="trueVal" :false-value="falseVal">
        <label for="agreement">{{ isAgree }}</label>
    </div>
    
    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const vm = Vue.createApp({
            data() {
                return {
                    isAgree: false,
                    trueVal: '真',
                    falseVal: '假',
                }
            }
        }).mount('#app');
    </script>
```

### 9.6.2 单选按钮

单选按钮被选中时，v-model绑定的数据属性的值默认被设置为该单选按钮的value值，可以使用v-bind将\<input\>元素的value属性再绑定到另一个数据属性上，这样选中后的值就是这个value属性绑定的数据属性的值。
```
    <div id="app">
        <input id="male" type="radio" v-model="gender" :value="genderVal[0]">
        <label for="male">男</label>
        <br>
        <input id="female" type="radio" v-model="gender" :value="genderVal[1]">
        <label for="female">女</label>
        <br>
        <span>性别：{{ gender }}</span>
    </div>

    <script src="https://unpkg.com/vue@next"></script>
    <script>
        const vm = Vue.createApp({
            data() {
                return {
                    gender: '',
                    genderVal: ['帅哥', '美女'],
                }
            }
        }).mount('#app');
    </script>
```

### 9.6.3 选择框的选项

通过选择框选择内容后，其值是选项的值（\<option\>元素的value属性的值），选项的value属性也可以使用v-bind指令绑定到一个数据属性上。代码如下所示：
```
<option v-for="option in options" v-bind:value="option.value">
```
也可以将value绑定到一个对象字面量上。
```
<select v-model="selected">
    <!-- 对象字面量 -->
    <option v-bind:value="{ number: 123 }">123</option>
</select>
```
结果：
```
typeof vm.selected // 'object'
vm.selected.number //123
```
