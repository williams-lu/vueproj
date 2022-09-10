// 17.8.1 store/index.js

import { createStore } from 'vuex'
import cart from './modules/cart'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        cart
    },
    plugins: [ createPersistedState() ]
})