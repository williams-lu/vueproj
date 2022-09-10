<!-- 17.10.2 用户注册组件UserRegister.vue -->

<template>
    <div class="register">
        <form>
            <div class="lable">
                <lable class="error">{{ message }}</lable>
                <input name="username" type="text"
                    v-model.trim="username"
                    placeholder="请输入用户名" />
                <input type="password"
                    v-model.trim="password"
                    placeholder="请输入密码" />
                <input type="password"
                    v-model.trim="password2"
                    placeholder="请输入确认密码" />
                <input type="tel"
                    v-model.trim="mobile"
                    placeholder="请输入手机号" />
            </div>
            <div class="submit">
                <input type="submit" @click.prevent="register" value="注册" />
            </div>
        </form>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    name: "UserRegister",
    data() {
        return {
            username: "",
            password: "",
            password2: "",
            mobile: "",
            message: '',
        };
    },
    watch: {
        username(newVal) {
            //取消上一次请求
            if(newVal) {
                this.cancelRequest();
                this.axios
                    .get("/user/" + newVal, {
                        cancelToken: new this.axios.CancelToken(
                            cancel => this.cancel = cancel
                        )
                    })
                    .then(response => {
                        if(response.data.code == 200) {
                            let isExist = response.data.data;
                            if(isExist) {
                                this.message = "该用户已经存在";
                            } 
                            else {
                                this.message = "";
                            }
                        }
                    })
                    .catch(error => {
                        if(this.axios.isCancel(error)) {
                            //如果是请求被取消产生的错误，则输出取消请求的原因
                            console.log("请求取消: ", error.message);
                        }
                        else {
                            //错误处理
                            console.log("请求取消")
                        }
                    });
            }
        }
    },
    methods: {
        register() {
            this.message = '';
            if(!this.checkForm())
                return;
            this.axios.pos("/user/register",
                {username:this.username, password: this.password, mobile: this.mobile})
                .then(response => {
                    if(response.data.code === 200) {
                        this.saveUser(response.data.data);
                        this.username = '';
                        this.password = '';
                        this.password2 = '';
                        this.mobile = '';
                        this.$router.push("/");
                    }else if(response.data.code === 500) {
                        this.message = "用户注册失败";
                    }
                })
                .catch(error => {
                    alert(error.message)
                })
        },
        cancelRequest() {
            if(typeof this.cancel === "function") {
                this.cancel("终止请求");
            }
        },
        checkForm() {
            if(!this.username || !this.password || !this.password2 || !this.mobile) {
                this.$msgBox.show({title:"所有字段不能为空"});
                return false;
            }
            if(this.password !== this.password2) {
                this.$msgBox.show({ title: "密码和确认密码必须相同"});
                return false;
            }
            return true;
        },
        ...mapMutations('user', [
            'saveUser'
        ])
    },
};
</script>

