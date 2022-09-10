// 17.10.1 用户状态管理配置user.js

const state = {
    user: null
}
//mutations
const mutations = {
    saveUser(state, {username, id}) {
        state.user = { username, id}
    },
    deleteUser(state) {
        state.user = null;
    }
}

export default {
    namespaced: true,
    state,
    mutations,
}