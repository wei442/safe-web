<template>
	<el-form :model="loginForm" :rules="rules2" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
	    <h3 class="title">系统登录</h3>
	    <el-form-item prop="userAccount">
	  		<el-input type="text" v-model="loginForm.userAccount" auto-complete="off" placeholder="账号"></el-input>
	    </el-form-item>
	    <el-form-item prop="userPassword">
	   		<el-input type="userPassword" v-model="loginForm.userPassword" auto-complete="off" placeholder="密码"></el-input>
	    </el-form-item>
	    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
	    <el-form-item style="width:100%;">
	   		<el-button type="primary" style="width:100%;" @click="handleLogin" :loading="logining">登录</el-button>
	    </el-form-item>
	</el-form>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
		        loginForm: {
		          userAccount: '',
		          userPassword: ''
		        },
		        rules2: {
		          userAccount: [
		        	  { required: true, message: '请输入账号', trigger: 'blur' },
		          ],
		          userPassword: [
		        	  { required: true, message: '请输入密码', trigger: 'blur' },
		          ]
		        },
		        checked: true
	      };
	    },
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    },
	    methods: {
	      handleReset2() {
	        this.$refs.loginForm.resetFields();
	      },
	      //登录
	      handleLogin: function () {
				this.$refs.loginForm.validate((valid) => {
					this.logining = true;
					if (valid) {
						this.$confirm('确认登录吗？', '提示', {}).then(() => {
							let params = {
								userAccount: this.loginForm.userAccount, 
								userPassword: this.loginForm.userPassword
							};
							let _this = this;
							axios.post('/user/login', params).then(function(response) {
								_this.logining = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									var result = response.data.result;
									//清除所有的key/value
		                            sessionStorage.clear();
		                            sessionStorage.setItem('token', response.data.result.token);
								} else {
									_this.$message.error(retMsg);
								}
				              }).catch(function (error) {
				        			console.log(error);
				              });
						});
					}
				});
			},
		}
	}

</script>


<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>