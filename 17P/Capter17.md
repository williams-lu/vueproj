# 第17章 网上商城项目



## 17.1 脚手架项目搭建




## 17.2 安装和配置axios




## 17.3 首页




### 17.3.1 页面头部组件

**1. 头部搜索框组件**


**2. 头部购物车组件**

**3. 头部组件**



### 17.3.2 菜单组件


### 17.3.3 图书分类组件


### 17.3.4 广告图片轮播组件


### 17.3.5 热门推荐组件


### 17.3.6 新书上市组件


### 17.3.7 首页组件


## 17.4 商品列表

### 17.4.1 商品列表项组件

### 17.4.2 商品列表组件

## 17.5 分类商品和搜索结果页面

### 17.5.1 Loading组件

### 17.5.2 Books组件

## 17.6 新书页面

## 17.7 图书详情页面

### 17.7.1 加减按钮组件

### 17.7.2 标签页组件


**1. 标签页组件**

**2. 图书介绍组件**

**3. 图书评价组件**

**4. 图书问答组件**

### 17.7.3 Book组件

## 17.8 购物车

### 17.8.1 购物车状态管理配置

### 17.8.2 购物车组件

## 17.9 结算页面

## 17.10 用户管理

### 17.10.1 用户状态管理配置

### 17.10.2 用户注册组件

### 17.10.3 用户登陆组件

## 17.11 路由配置

## 17.12 分页组件

完善一下商品列表的显示,如果商品数量较多,就需要分页显示.分页功能可以使用element-plus组件库中的分页组件来实现.element-plus是一套支持Vue3.0的组件库,提供的组件涵盖了绝大部分页面UI的需求.关于该组件库的详细介绍可以参考下面的网址:

https://element-plus.gitee.io/#/zh-CN/component/installation

在本项目中只是使用了它的分页组件Pagination.

首先是安装element-plus的npm包.在vscode终端执行以下命令:
```
npm install element-plus -S
```
编辑main.js,引入整个element-plus组件和所需的样式,由于element-plus组件内部默认使用英语,而本项目需要使用中文,因此还需要引入中文的语言包.代码如下:
```
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import locale from 'element-plus/lib/locale/lang/zh-cn'

createApp(App).use(store).use(router).use(VueAxios, axios).use(ElementPlus, { locale }).mount('#app')
```
如果想按需引入,本项目中只用到了分页组件,不想引入整个element-plus组件库,则需要借助babel-plugin-component插件.首先,在终端窗口中执行下面的命令安装babel-plugin-component.
```
npm install babel-plugin-component -D
```
然后编辑项目目录下的babel.config.js文件,添加以下内容:
```
module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-plus",
                "styleLibraryName": "theme-chalk",
            }
        ]
    ]
}
```
接下来,在main.js文件中就可以按需引入分页组件ElPagination.代码如下:
```
import { ElPagination } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import lang from 'element-plus/'lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'

// 使用中文语言
locale.use(lang)

createApp(App).use(store).use(router).use(VueAxios, axios).use(ElPagination, { locale }).mount('#app')
```
作为分页实现,至少需要3个属性控制分页的显示和跳转,即每页显示的条数\\总条数和当前页数.有了当前页数就可以记录用户要跳转的分页.

编辑views目录下的Books.vue,添加3个数据属性.代码如下:
```
data() {
    return {
        ...
        total: 5,
        pageNum: 1,
        pageSize: 2,
    }
}
```
这3个数据属性分别代表总条数\\当前页数\\每页显示的条数.由于服务端数据较少,为了能够看到分页组件的效果,这里将每页显示的条数初始值为2.

接下来在Books组件中使用ElPagination组件实现分页功能,代码如下:
```
<template>
    <div>
        <Loading v-if="loading" />
        <h3 v-else>{{ title }}</h3>
        <BookList :list="book" />
        <h1>{{ message }}</h1>
        <el-pagination
            :hide-on-single-page="true"       //当只有一页时隐藏分页
            @size-change="handleSizeChange"   //当pageSize改变时触发
            :page-sizes="[2, 10, 20, 40]"     //设置每页显示条数的选项
            @current-change="handleCurrentChange"  //当前页发生改变触发
            :current-page="pageNum"           //当前页数
            :page-size="pagSize"              //每页显示条数
            layout="total, sizes, prev, pager, next, jumper" //设置组件布局
            :total="total">
        </el-pagination>
    </div>
</template>
```
接下来就是编写当前页数改变和每页显示条数改变的事件响应函数代码,以及修正服务器端发起请求获取数据的接口,因为服务器端对于分页数据的返回提供了不同的接口.代码如下:
```
<script>
    ...
    export default {
        data() {
            ...
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.title = to.meta.title;
                let url = vm.setRequestUrl(to.fullPath);
                vm.getBooks(url, vm.pageNum, vm.pageSize);
            });
        },
        
        beforeRouteUpdate(to) {
            let url = this.setRequestUrl(to.fullPath);
            this.getBooks(url, this.pageNum, this.pageSize);
            return true;
        },

        components: {
            ...
        },

        methods: {
            getBooks(url, pageNum, pageSize) {
                this.message = '';
                //get 请求增加两个参数pageNum和pageSize
                this.axios.get(url, {params: { pageNum, pageSize }})
                    .then(response => {
                        if(response.data.code == 200) {
                            this.loading = false;
                            this.books = response.data.data;
                            this.total = response.data.total;
                            if(this.books.length === 0) {
                                if(this.$route.name === "category)
                                    this.message = "当前分类下没有图书!"
                                else
                                    this.message = "没有搜索到匹配的图书!"
                            }
                        }
                    })
                    .catch(error => alert(error));
            },
            //动态设置服务端数据接口的请求URL
            setRequestUrl(path) {
                let url = path;
                if(path.indexOf("/category") != -1) {
                    url = "/book" + url + "/page";
                }
                return url;
            },
            //当修改了每页显示的条数时,重新请求数据
            handleSizeChange(selectedSize) {
                this.pageSize = selectedSize;
                let url = this.setRequestUrl(this.$route.fullPath);
                this.getBooks(url, this.pageNum, this.pageSize);
            },
            //当用户切换而选择了某一页时,重新请求数据
            handleCurrentChange(currentPage) {
                this.pageNum = currentPage
                let url = this.setRequestUrl(this.$route.fullPath);
                this.getBooks(url, this.pageNum, this.pageSize);
            },
        }
    }
</script>
```

## 17.13 会话跟踪

传统Web项目的会话跟踪是采用服务器端的Session实现的.当客户初次访问资源时,Web服务器为该客户创建一个Session对象,并分配一个唯一个的Session ID,将其作为Cookie(或者作为URL的一部分,利用URL重写机制)发送给浏览器,浏览器在内存中保存这个会话Cookie.当客户再次发送HTTP请求时,浏览器将Cookie随请求一起发送,服务器程序从请求对象中读取Session ID,然后根据Session ID找到对应的Session对象,从而得到客户的状态信息.

传统Web项目的前端和后端是在一起的,所以会话跟踪实现起来很简单.当采用前后端分离的开发方式时,前后端分别部署在不同的服务器上.由于是跨域访问,前端向后端发起的每次请求都是一个新的请求,在这种情况下,如果还想采用Session跟踪会话,就需要前后端都做一些配置.

对于前端而言,配置很简单,只需要在main.js文件中添加下面这句代码即可.
```
axios.defaults.withCredentials = true
```
这会让前端的每次请求带上用于跟踪用户会话的Cookie报头.

服务器端也比较简单,只需要在响应报头中带上Access-Control-Allow-Origin和Access-Control-Allow-Credentials这两个报头.前者必须指定明确的访问源(即前端项目部署的服务器端域名或IP),不能使用星号(*);后者设置为true即可.代码如下:
```
response.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
response.setHeader("Access-Control-Allow-Credentials", "true");
```
服务器端可以通过拦截器的方式来统一设置这两个响应报头.

目前还有一种流行的跟踪用户会话的方式就是使用一个自定义的token,服务器端根据某种算法生成唯一的token,必要时可以采用公私钥的方式来加密token,然后将这个token放到响应报头中发送到前端,前端在每次请求时在请求报头中带上这个token,以便服务器端可以获取该token进行权限验证以及管理用户的状态.在前端可以利用axios的拦截器(参见15.8节)进行token的统一处理,包括结合Vuex进行token的状态管理.

## 17.14 项目调试

在项目开发过程中,不可避免会遇到一些Bug,即使再有经验的开发人员也无法完全通过代码走读的方式来解决全部Bug,这就需要对程序进行调试,设置断点跟踪代码的执行,最终找到问题所在并解决它.

前端程序的调试不如某些高级语言的集成开发环境提供的调试那么容易,但利用一些扩展插件也能实现在编辑器环境和浏览器环境中进行调试.

### 17.14.1 在Visual Studio Code中调试

在vscode左侧的活动栏单击"扩展"图标按钮.在搜索框中输入debugger,在出现的插件中选中Debugger for chrome或Debugger for Firefox.按需安装.

修改Webpack的配置以构建source map,这是为了让调试器能够将压缩文件中的代码映射回原始文件中的位置,这可以确保即使在Webpack优化了应用中的资源后也可以调试应用程序.

编辑项目根目录下的vue.config.js文件,添加如下代码:
```
module.exports = {
    configureWebpack: {
        devtool: 'source-map'
    },
    ...
}
```
单击左侧活动栏中的"运行"图标按钮,然后单击上方的齿轮图标,选择chrome环境.选中chrome后,会生成一个launch.json文件,代码如下:
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "vue.js: chrome",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "breakOnLoad": true,
            "sourceMapPathOverrides": {
                "webpack:///./src/*": "${webRoot}/*"
            }
        }
    ]
}
```
Firefox环境的配置如下:
```
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "firefox",
            "request": "launch",
            "name": "vue.js: firefox",
            "url": "http://localhost:8080",
            "webRoot": "${workspaceFolder}/src",
            "pathMappings": [{ "url": "webpack:///src/", "path": "${webRoot}/ }]
        }
    ]
}
```
配置好后,开始调试程序.打开一个组件,如BookCommentList组件,在data上设置一个断点,在终端窗口运行项目,然后单击左侧活动栏上的"运行"图标按钮,切换到调试视图,选择vuejs:chrome或vuejs:firefox,按F5键运行或者左侧绿色的运行按钮.

打开浏览器窗口访问本项目,在图书详情页查看图书评论,跳转到设置的断点处.可以使用上方的调试工具栏单步执行,跟踪代码的执行情况.

### 17.14.2 在浏览器中调试

在浏览器中调试Vue程序利用2.3节介绍的vue-devtools工具完成的.首先确保该扩展程序已经安装并启用,在浏览器窗口中按F12键调出开发者工具窗口,选择Vue选项.

## 17.15 小结











