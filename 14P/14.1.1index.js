// 14.1.1 在src目录下县级一个router目录，并新建一个index.js文件

//导入createRouter和createWebHashHistory
import { createRouter, createWebHashHistory } from 'vue-router'
import Home form '@/components/Home'
import News form '@/components/News'
import Books form '@/components/Books'
import Videos form '@/components/Videos'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Home,
        },
        {
            path: '/news',
            component: News,
        },
        {
            path: '/books',
            component: Books,
        },
        {
            path: '/videos',
            component: Videos,
        },
    ]
})
