# 第18章 部署Vue.js项目到生产环境

项目开发完毕并测试无问题后,就要准备构建发布版本,部署到生产环境。

## 18.1 构建发布版本

在构建发布版本前,注意将项目代码中用于调试的alert语句和console.log语句删除或注释,在生产环境下,这对用户体验不好.在项目开发过程中,最好统一使用console.log,调试信息忘了删除也不会出现页面上.

如果项目中很多地方使用了console.log语句或者alert语句,一一删除比较麻烦,那么可以在构建发布版本时统一删除.Vue CLI在构建发布版本打包时,使用了terser-webpack-plugin插件进行你个优化,该插件只有在构建发布版本打包的时候才会调用.该插件有一个配置文件terserOptions.js,我们只需要在该配置文件中配置一下删除console.log语句和alert语句即可.

terserOptions.js文件在项目的node_modules\\@vue\\cli-service\\lib\\config目录下.编辑该文件,添加下面的代码:
```
module.exports = options => ({
    terserOptions: {
        compress: {
            ...
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funce: ['console.log', 'alert']
        },
        ...
    },
    ...
})
```
接下来在项目目录下执行下面的命令构建发布版本.
```
npm run build
```
构建完成后,会在项目目录下生成一个disk文件夹,其下就是项目的发布版本.bookstore项目打包后的目录结构.

在js文件夹下,除了一些JS文件(由于项目采用了异步加载路由组件,所以会产生多个JS文件),还有一些map文件.项目打包后,代码都是经过压缩的,如果运行时出现错误,则输出的错误信息无法准确定位是哪里的代码出现了问题,有了map文件就可以像未压缩的代码一样,准确地输出是哪一行哪一列出现错误.在17.13.1小节也提到过map文件的作用.

在生产环境下,这些map文件并没有什么作用,因为不能指望终端用户调试代码,查找Bug.如果想在打包时去掉这些map文件,则可以编辑vue.config.js文件,添加以下代码:
```
module.exports = {
    ...,
    productionSourceMap: process.env.NODE_ENV === 'production' ? false : true
}
```
再次构建发布版本,js目录下的map文件没有了.

## 18.2 部署

构建好发布版本后,下一步要做的事情就是将项目部署到一个Web服务器上,根据项目应用的场景会选择不同的服务器.这里以nginx为例,介绍如何部署及部署时的注意事项.

nginx是一个高性能的Http和反向Web服务器,同时提供了IMAP/POP3/SMTP服务.

在nginx目录下,找到conf目录下的nginx.conf文件,该文件是nginx的默认配置文件.编辑该文件,输入下面内容:
```
location /api/ {
    # 设置被代理服务器的地址,这里配置的是后端数据接口的URL
    proxy_pass http://111.229.37.167/api/;

    # 以下配置关闭重定向,让服务器看到用户的IP
    # proxy_set_header指令更改nginx服务器接收到的客户端请求头信息
    # 然后将新的请求头信息发送给被代理的服务器
    proxy_redirect off;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Nginx-Proxy true;
}
```
打开命令提示符窗口,在nginx目录下执行nginx -s reload重启服务器,再次访问http://localhost/,会发现可以正常接收到数据了.但是刷新页面时,就会出现404错误,需要在服务器上做一些配置,让URL匹配不到任何资源时,返回index.html.不同的Web服务器配置方式不一样,Vue Router官网给出了一些常用的服务器配置,其中包括nginx.

再次编辑conf/nginx.conf文件,添加以下内容:
```
location / {
    root html;
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}
```
再次执行nginx -s reload重启服务器

## 18.3 小结