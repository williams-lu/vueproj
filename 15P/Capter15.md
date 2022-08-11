# 第十五章 与服务器端通信--axios

## 15.1 安装

在实际项目中，页面中所需要的数据通常是从服务器获取的，这必然牵涉与服务端的通信，Vue官方推荐使用axios完成Ajax请求。

axios是一个基于Promise的HTTP库，可以用在浏览器和Node.js中。

可以使用CDN方式安装axios。
```
<!-- 引用最新版 -->
<script src="https://unpkg.com/axios/dist/axios.min.js></script>
```
如果采用模块化开发，则使用npm安装
```
npm install axios --save
或
yarn add axios --save
```
在Vue的脚手架项目中使用，可以将axios结合Vue-axios插件一起使用，该插件只是将axios集成到Vue.js的轻度封装，本身不能独立使用。可以使用命令一起安装。
```
npm install axios vue-axios
```
安装vue-axios插件后，使用形式如下：
```
import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

const app = createApp(App);
app.use(VueAxios, axios)   //安装插件
app.mount('#app')
```
之后在组件内就可以通过this.axios调用axios的方法发送请求。

## 15.2 基本用法

HTTP最基本的请求就是get请求和post请求。使用axios发送get请求调用形式如下。
```
axios.get('/book?id=1')
    .then(function (response) {
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
    });
```
**get()** 方法接收一个URL作为参数，如果有要发送的数据，则以查询字符串的形式附加在URL后面。当服务端发送成功响应（状态码是2XX）时调用then()方法中的回调，可以在该回调函数中对服务端的响应进行处理；如果出现错误，则会调用catch()方法中的回调，可以在该回调函数中对错误信息进行处理，并向用户提示错误。

如果不喜欢URL后附加查询参数的写法，可以为get()方法传递一个配置对象作为参数，在配置对象中使用params字段指定要发送的数据。
```
axios.get('/book', {
    params: {
        id: 1
    }
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
});
```
可以使用ES2017的async/await执行异步请求。
```
async function getBook() {
    try {
        const response = await axios.get('/book?id=1');
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
```
post请求是在请求体中发送数据，因此，axios的post()方法比get()方法多一个参数，该参数是一个对象，对象的属性就是要发送的数据。
```
axios.post('/login', {
    username: 'lisi',
    password: '1234',
})
.then(function (response) {
    console.log(response);
})
.catch(function (error) {
    console.log(error);
});
```
get()和post()方法的原型如下：
```
get(url[, config])
post(url[, data[, config]])
```
关于config对象，请参考15.4

接收到服务端的响应消息后，需要对响应信息进行处理。例如，设置用于组件渲染或更新所需要的数据。回调函数中的response是一个对象，该对象常用的属性是data和status,前者用于获取服务端发回的响应数据，后者是服务端发送的HTTP状态代码。response对象的完整属性如下所示：
```
{
    //data是服务器发回的响应数据
    data: {},

    //status是服务器响应的HTTP状态码
    status: 200,

    //statusText是服务器响应的HTTP状态描述
    statusText: 'OK',

    //headers是服务器响应的消息报头
    //所有报头的名字都是小写的，可以使用方括号来访问
    //例如，response.headers['content-type']
    headers: {},

    //config是为请求提供的配置消息
    config: {},

    //request是生成次响应的请求
    request: {},
}
```
成功响应后，获取数据的一般处理形式入下:
```
axios.get('/book?id=1')
    .then(function (response) {
        if(response.status === 200) {
            this.book = response.data;
        }
    })
    .catch(function (error) {
        console.log(error);
    });
```
如果出现错误，则会调用catch()方法中的回调，并向该回调函数传递一个错误对象。错误处理一般形式如下：
```
axios.get('/book?id=1')
    .catch(function (error) {
        if(error.response) {
            //请求已发送并接收到服务器端的响应，但响应的状态码不是2XX
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            //请求已发送，但是未接收到响应
            console.log(error.request);
        } else {
            //在设置请求时出现问题而引发问题
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
```

## 15.3 axios API

可以通过axios传递相关配置来创建请求。axios原型：
```
axios(config)
axios(url[, config])
```
get请求和post请求的调用形式如下：
```
//发送get请求（默认的方法）
axios('/book?id=1');

//get请求，获取远端的图片
axios({
    method: 'get',
    url: '/images/logo.png',
    responseType: 'stream',
})
.then(function(response) {
    response.data.pipe(fs.createWriteStream('logo.png'))
});

//发送post请求
axios({
    method: 'post',
    url: '/login',
})


```
