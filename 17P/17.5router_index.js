// 17.5 分类商品和搜索结果页面
// 给出两个页面的路由配置，编辑route
//...
const routes = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/home',
        name: 'home',
        meta: {
            title: '首页'
        },
        component: Home
    },
    {
        path: '/category/:id',
        name: 'category',
        meta: {
            title: '分类图书'
        },
        component: () => import('../views/Books.vue')
    },
    {
        path: '/search',
        name: 'search',
        meta: {
            title: '搜索结果'
        },
        component: () => import('../views/Books.vue')
    },
]

//设置页面的标题
router.afterEach((to) => {
    document.title = to.meta.title;
})

//...