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