<!-- 14.10 导航守卫 例14-23 -->
<template>
    <div>
        <h3>{{ info }}</h3>
        <table>
            <caption>用户登录</caption>
            <tbody>
                <tr>
                    <td><label>用户名：</label></td>
                    <td><input type="text" v-model.trim="username"/></td>
                </tr>
                <tr>
                    <td><label>密码：</label></td>
                    <td><input type="password" v-model.trim="password"/></td>
                </tr>
                <tr>
                    <td cols="2">
                        <input type="submit" value="登录" @click.prevent="login"/>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            password: "",
            info: "",  //用于保存登录失败后的提示信息
        }
    },
    methods: {
        login() {
            //在实际场景中，这里应该通过Ajax向服务器端发起请求来验证
            if("lisi" == this.username && "1234" == this.password) {
                //sessionStorage中存储的都是字符串值，因此这里实际存储的都是字符串“true”
                sessionStorage.setItem("isAuth", ture);
                this.info = "";
                //如果存在查询参数
                if(this.$route.query.redirect) {
                    let redirect = this.$route.query.redirect;
                    //则跳转至进入登录页前的路由
                    this.$router.replace(redirect);
                }
                else {
                    //否则跳转至首页
                    this.$router.replace('/');
                }
            }
            else {
                sessionStorage.setItem("isAuth", false);
                this.username = "";
                this.password = "";
                this.info = "用户名或密码错误";
            }
        }
    }
}
</script>