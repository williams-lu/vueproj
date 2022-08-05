# 第7章 监听器

Vue提供了一种更通用的方式来观察和响应Vue实例上的数据变动：监听器。当有一些数据需要随着其他数据变化而变动时，就可以使用监听器。听起来这好像和计算属性的作用差不多，从功能的描述来看，确实是，不过在实际应用中两者是有很大差别的。

## 7.1 使用监听器

案例1:7.1watch        //实现千米和米的换算

>注意：
>
>不要使用箭头函数定义监听器函数，如下面代码：
>```
>kilometers: (val) => {
>   this.kilometers = val;
>   this.meters = this.kilometers * 1000;
>}
>```
>箭头函数绑定的是父级作用域的上下文，这里的this指向的是windows对象而不是组件事例，this.kilometers和this.meters都是undifined。

当需要在数据变化时执行异步或开销较大的操作时，使用监听器时最合适的。例如：在一个在线问答系统中，用户输入的问题需要到服务器端获取答案，就可以考虑对问题属性进行监听，在异步请求答案的过程中，可以设置中间状态，想用户提示“请稍后...”，而这样的功能使用计算属性就无法做到了！

案例2：7.1watch-fibonacci.html

案例2说明：

(1)斐波那契数列的计算比较耗时，所以在函数第一个地方给result数据属性设置了一个中间状态，给用户一个提示"（请稍后...)"。

(2)worker实例时异步执行的，当后台线程执行完任务后通过postMessage()调用7.1fibonacci.js，通知创建者线程的onmessage回调函数，在该函数中可以通过event对象的data属性得到数据。在这种异步回调的过程中，this的指向会发生变化，如果onmessage()回调函数写成如下形式：
```
worker.onmessage = function(event) { this.result = event.data };
```
那么在执行onmessage()函数时，this实际上指向的worker对象，自然this.result就是undefined。因此在worker.onmessage处使用了箭头函数，因为箭头函数绑定的是父级作用域的上下文，在这里绑定的就是vm对象。在使用Vue的开发过程中，经常会遇到this指向的问题，合理地使用箭头函数可以避免很多问题。

> **提示:**
>
> Chrome浏览器的安全限制比较严格，本例使用了WebWorker,如果直接在文件系统中打开页面，会提示如下错误信息：
>```
>Uncaught( in promise) DOMException: Failed to construct 'Worker': Script at 'file:///F:/xxx/fibonacci.js' cannot be accessed from origin 'null'.
>```
>解决办法就是将本例部署到本地的一个Web服务器中访问，如Tomcat或nginx等


