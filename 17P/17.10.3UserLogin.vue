<!-- 17.10.3用户登录组件UserLogin.vue -->

<template>
    <div class="login">
        <div class="error">{{ message }}</div>
        <from>
            <div class="lable">
                <input
                    name="username"
                    type="text"
                    v-model.trim="username"
                    placeholder="请输入用户名"
                />
                <input
                    type="password"
                    v-model.trim="password"
                    placeholder="请输入密码"
                />
            </div>
            <div class="submit">
                <input type="submit" @click.prevent="login" value="登录" />
            </div>
        </from>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "UserLogin",
    data() {
        return {
            username: '',
            password: '',
            message: '',
        };
    },
    methods: {
        login() {
            this.message = '';
            if(!this.checkForm())
                return;
            this.axios.post("/user/login",
                {username: this.username, password: this.password})
                .then(response => {
                    if(response.data.code === 200) {
                        this.saveUser(response.data.data);
                        this.username = '';
                        this.password = '';
                        //如果存在查询参数
                        if(this.$route.query.redirect) {
                            const redirect = this.$route.query.redirect;
                            //跳转至进入登录页面的路由
                            this.$router.replace(redirect);
                        }else{
                            //否则跳转至首页
                            this.$router.replace('/');
                        }
                    }else if(response.data.code === 500) {
                        this.message = "用户登录失败";
                    }else if(response.data.code === 400) {
                        this.message = "用户名或密码错误";
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
        },
        ...mapMutations('user', [
            'saveUser'
        ]),
        checkForm() {
            if(!this.username || !this.password) {
                this.$msgBox.show({ title: "用户名和密码不能空"});
                return false;
            }
            return true;
        }
    }
};
</script>