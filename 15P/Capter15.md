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
    data: {
        username: 'lisi',
        password: '1234',
    }
});
```
为了方便使用,axios库为所有支持的请求方法提供了别名
+ axios.request(config)
+ axios.get(url[,config])
+ axios.delete(url[,config])
+ axios.head(url[,config])
+ axios.options(url[,config])
+ axios.post(url[,[data][,config]])
+ axios.patch(url[,[data][,config]])

使用别名方法时,url,method和data这些属性都不必在配置对象中指定。

## 15.4 请求配置

axios库为请求提供了配置对象,在该对象中可以设置很多选项,常用的是url、method、headers和params。

完成的选项如下:
```
{
    //url是用于请求的服务器url
    url: '/book',

    //method是发起请求时使用的请求方法
    method: 'get', //默认的

    //baseURL将自动加在url前面,除非url是一个绝对URL
    //为axios实例设置一个baseURL,就可以将相对URL传递给该实例的方法
    baseURL: 'https://some-domain.com/api/',

    //transformRequest允许在将请求数据发送到服务器前对其进行修改
    //只能用于put,post,patch和delete这几个请求方法
    //数组中的最后一个函数必须返回一个字符串、Buffer的实例、ArrayBuffer、FormData或Stream
    //也可以修改headers对象
    transformRequest: [ function (data, headers) {
        //对data进行任意转换处理
        return data;
    }],

    //transformResponse允许在将响应数据传递给then/catch之前对其进行更改
    transformResponse: [function (data) {
        //对data进行任意转换处理
        return data;
    }],

    //headers是要发送的自定义请求头
    headers: ( 'X-Requested-With': 'XMLHttpRequest'),

    //params是与请求一起发送的URL参数
    //必须是一个普通对象(plain object)或URLSearchParams对象
    params: {
        ID: 1
    },

    //paramsSerializer是一个负责params序列化的可选参数
    //(e.g. https://npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
    },

    //data是作为请求体被发送的数据
    //只适用于请求方法put,post,delete和patch
    //在没有设置 transformRequest时,必须是以下类型之一
    //- string, plain obuject,ArrayBuffer,ArrayBufferView,URLSearchParams
    //- 浏览器专属: FormData,File,Blob
    //- Node专属: Stream,Buffer
    data: {
        firstName: 'Fred',
    },

    //将数据发送到请求体的替代语法
    //适用于Post方法
    //只发送值,而不发送键
    data: 'Country=Brasil&City=Belo Horizonte',

    //timeout指定请求超时的毫秒数,默认是0,表示无超时时间
    //如果请求耗费的时间超过timeout,则请求被终止
    timeout:1000,

    //withCredentials表示跨域请求时是否需要使用凭证
    withCredentials: false, //默认的

    //adapter允许自定义处理请求,以使测试更加容易
    //返回一个 promise 并提供一个有效的响应
    adapter: function (config) {
        /* ... */
    },

    //auth表示应该适用HTTP基础验证,并提供凭证
    //这将设置一个Authorization抱头,覆盖使用headers设置的现有的Authorization自定义报头
    auth: {
        username: 'janedoe',
        password: 's00pers3cret',
    },
    //responseType表示服务器响应的数据类型
    //可以是'arraybuffer','document','json','text'和'stream'
    //浏览器专属: blob
    responseType: 'json', //默认的

    //responseEncoding表示用于解码响应数据的编码
    //注意: 对于stream响应类型,将忽略
    responseEncoding: 'utf8', //默认的

    //xsrfCookieName是用作xsrf token值的cookie的名称
    xsrfCookieName: 'XSRF-TOKEN',   //默认的

    //xsrfHeaderName是携带xsrf token值的HTTP报头的名字
    xsrfHeaderName: 'X-XSRF-TOKEN',   //默认的

    //onUploadProgress允许为上传处理进度事件
    //浏览器专属
    onUploadProgress: function (progressEvent) {
        //对原声进度事件的处理
    },

    //maxContentLength定义Node.js中允许的响应内容的最大大小(以字节为单位)
    maxContentLength: 2000,

    //maxBodyLength(只适用于Node的选项)定义允许的HTTP请求内容的最大大小(以字节为单位)
    maxBodyLength: 2000,

    //validateStatus定义对于给定的HTTP响应状态是解析(resolve)还是拒绝(reject)这个
    //promise
    //如果validateStatus返回true(或者设置为null或undefined)
    //promise将被解析(resolve),否则,promise将被拒绝(reject)
    validateStatus: function (status) {
        return status >= 200 && status < 300;  //默认的
    },

    //maxRedirects定义在Node.js中follow的最大重定向数目
    //如果设置为0,那么将不会follow任何重定向
    maxRedirects: 5, //默认的

    //socketPath定义要在Node.js中使用的Unix套接字
    //例如, '/var/run/docker.sock'向docker守护进程发送请求
    //只能指定socketPath或proxy,如果两者都指定,则使用socketPath
    socketPath: null, //默认的
    //httpAgent和httpsAgent用于定义在Node.js中执行HTTP和HTTPS时要使用的自定义代理
    //允许配置类似keepAlive的选项,keepAlive默认没有启用
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),

    //proxy定义代理服务器的主机名和端口
    //auth表示HTTP基础验证应当用于连接代理,并提供凭据
    //这将会设置一个Proxy-Authorization报头
    //覆盖使用headers设置的任何现有的自定义Proxy-Authorization报头
    proxy: {
        host: '127.0.0.1',
        port: 9000,
        auth: {
            username: 'mikeymike',
            password: 'repunz31',
        }
    }, 
    
    // cancelToken指定用于取消请求的cancel token
    cancelToken: new CancelToken(function (cancel) {
    })

    //decompress表示是否应该自动解压缩响应正文
    //如果设置为true,则还将所有解压缩响应的responses对象中删除content-encoding报头
    //- Node专属(浏览器的XMLHttpResquest无法关闭解压缩)
    decompress: true   //默认的
}
```

## 15.5 并发请求

有时候需要向服务器发起多个请求,这可以用Promise.all实现.
```
function getUserAccount() {
    return axios.get('/user/12345');
}

function getUserPermissions() {
    return axios.get('/user/12345/permissions');
}

Promise.all([getUserAccount(), getUserPermissions()])
.then(function (results) {
    //两个请求现在都执行完成
    const acct = results[0];
    const perm = results[1];
    //acct是getUserAccount()方法请求的响应结果
    //perm是getUserPermissions()方法请求的响应结果
});
```

## 15.6 创建实例

可以使用自定义配置调用axios.create([config])方法创建一个axios实例,之后使用该实例向服务器发起请求,就不用每次请求时重复设置配置选项了。

示例:
```
const instance = axios.create({
    baseURL: 'https://some-domain.com/api/',
    timeout: 1000,
    headers: { 'X-Custom-Header': 'foobar' },
});
```

## 15.7 配置默认值

对于每次请求相同的配置选项,可以通过为配置选项设置默认值来简化代码的编写。项目中使用的全局axios默认值可以在项目的入口文件main.js中按照以下形式进行配置。
```
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencode';
axios.defaults.withCredentials = true
```
也可以在自定义实例中设置配置默认值,这些配置选项只有在使用该实例发起请求时才生效。

示例代码:
```
//创建实例时设置配置默认值
const instance = axios.create({
    baseURL: 'https://api.example.com'
});
//实例创建后更改默认值
instance.defaults.headers.common['Authorization'] = AUTH_TOKEN;
```
配置将按优先顺序进行合并。顺序是先在lib/defaults.js中找到的库的默认值,然后是实例的defaults属性,最后是请求的config参数。后者将优于前者。

示例代码:
```
//使用由库提供的配置默认值来创建实例
//此时超过配置的默认值是0
var instance = axios.create();

//覆写库的超时默认值
//现在,在超时前,使用该实例发起的所有请求都会等待2.5s
instance.defaults.timeout = 2500;

//在发起请求时,覆写超时值
instance.get('/longRequest', {
    timeout: 5000
});
```

## 15.8 拦截器

有时需要统一处理HTTP的请求和响应,如登陆验证,这是就可以使用axios的拦截器,分为请求拦截器和响应拦截器,他们会在请求或响应被then()或catch()方法处理前拦截它们。

axios的拦截器的使用形式如下:
```
//添加请求拦截器
axios.interceptors.request.use(function (config) {
    //在发送请求之前做些什么
    return config;
},function (error) {
    //对请求错误做些什么
    return Promise.reject(error);
});

//添加响应拦截器
axios.interceptors.response.use(function (response) {
    //对响应数据做些什么
    return response;
},function (error) {
    //对响应错误做些什么
    return Promise.reject(error);
});
```
在14.10.1小节使用全局守卫实现了一个用户登陆验证的例子,不过这种方式只有简单的前端路由控制,用户一旦成功登陆,前端就保存了用户登陆的状态,允许用户访问受保护的资源。如果在这期间,该用户在服务器端失效了。例如,用户长时间未操作,服务器端强制下线,或者管理员将该用户拉入黑名单,那么前端就应该及时更新用户的状态,对用户的后续访问做出控制。在这种情况下,就应该使用axios的拦截器结合HTTP状态码进行用户是否已登陆的判断。

代码如下:
```
//请求拦截器
axios.interceptors.request.use(
    config => {
        if (token) {         //判断是否存在token,如果存在,则每个HTTP header都加上token
            config.headers.Authorization = `token ${ store.state.token }`;
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
);

//响应拦截器
axios.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.response) {
            swith (error.response.status) {
                case 401:
                    //如果返回401,则清楚token信息并跳转到登陆页面
                    router.replace({
                        path: 'login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    })
            }
        }
        return Promise.reject(error.response.data)
    }
);
```
如果之后想移除拦截器,则可以按以下方式调用.
```
const myInterceptor = axios.interceptors.request.use(function () { /* .... */ });
axios.interceptors.request.eject(myInterceptor);
```
也可以为自定义的axios实例添加拦截器.示例代码:
```
const instance = axios.create();
instancd.interceptors.request.use(function () { /*... */ });
```