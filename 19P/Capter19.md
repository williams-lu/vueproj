# 第19章 全新的WEb开发构建工具--Vite

Vite是vue的作者开发的Web开发构建工具,它是一个基于浏览器原生ES模块导入的开发服务器,在开发环境下,利用浏览器解析import, 在服务器端按需编译返回,完全跳过了打包这个概念,服务器随启随用。同时Vite不仅对Vue文件提供了支持,还支持热更新,而且热更新速度不会随着模块增多而变慢.在生产环境下使用Rollup打包。

Vite具有以下特点:
+ 快速冷启动;
+ 即时热模块更新(hot module replacement,HMR);
+ 真正按需编译

Vite是在推出Vue3.0时开发,目前仅支持Vue3.x,也就是与Vue3.0不兼容的库也不能与vite一起使用。

## 19.1 使用Vite

与Vue CLI类似,Vite也提供npm或yarn命令生成项目结构的方式。选择一个目录,打开命令提示符窗口,依次执行下面的命令构建脚手架项目,并启动项目:
```
npm init vite-app <project-name>
cd <project-name>
npm install
npm run dev
```
如果使用yarn,则依法执行下面的命令。
```
yarn create vite-app <project-name>
cd <project-name>
yarn
yarn dev
```
由于Vite使用了浏览器原生的ES模块导入功能,但IE11并不支持ES的模块导入,因此基于Vite开发项目,浏览器不能使用IE11浏览器。

可以发现,Vite生成的脚手架项目的目录结构与Vue CLI生成的项目目录结构很类似,开发方式也基本相同.不过Vite项目的默认配置文件是vite.config.js,而不是vue.config.js。

package.json文件的内容如下:
```
{
    "name": "hello",
    "version": "0.0.0",
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    },
    "dependencies": {
        "vue": "^3.0.2"
    },
    "devDependencies": {
        "vite": "^1.0.0-rc.8",
        "@vue/compiler-sfc": "^3.0.2"
    }
}
```
如果要构建生产环境下应用的发布版本,则只需要在终端窗口执行以下命令即可:
```
npm run build
```
虽然Vite的记者已经在背后做了很多工作,让我们能够沿用基于Vue CLI建立的脚手架项目的开发习惯,但仍然会有一些细微的差别,详细的介绍请参看Vite源码库的Github网址:https://github.com/vitejs/vite.

## 19.2 与Vue CLI的不同

Vite与Vue CLI的主要区别在于,对于Vite在开发过程中没有捆绑.源代码中的ES Import语法直接提供给浏览器,浏览器通过原生的\<script module\>支持解析这些语法,并每次导入发起HTTP请求.dev服务器拦截请求,并在必要时执行代码转换.例如,导入到*.vue文件的内容在发送回浏览器之前被即时编译。

这种方法有以下优点:
+ 因为没有打包工作要做,所以服务器冷启动非常快
+ 代码是按需编译的,因此只有在当前页面上实际导入的代码才会编译,不必等到整个应用程序打包后才开始开发,这对于有几十个页面的应用程序来说是一个很大的不同;
+ 热模块更新(HMR)的性能与模块总数解耦,这使得无论应用程序有多大,HMR都能保持快速。

整个页面的重新加载可能比基于绑定包的设置稍慢,因为本机ES导入会导致具有深度导入链的网络瀑布.但是,由于这是本地开发,所以与实际编译时间相比,差异是很小的.由于已编译的文件缓存在内存中,因此在页面重新加载时没有编译开销。

简单来说,使用Vite开发Vue3.0项目可以减少不必要的等待项目重启或模块更新的时间,加快开发进度.在生产环境下,我们依然是需要对项目进行打包的,以避免频繁的网络请求,Vite也提供了一个vite build命令来实现这一点,在终端窗口中执行npm run build,实际执行的是vite build命令。

## 19.3 小结