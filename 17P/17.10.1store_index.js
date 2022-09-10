// 17.10.1用户状态store/index.js

import { createStore } from 'vuex'

import cart from './modules/cart'
import user from './modules/user'
import createPersistedState from "vues-persistedstate"

export default createStore({
    modules: {
        cart,
        user,
    },
    plugins: [createPersistedState()]
})