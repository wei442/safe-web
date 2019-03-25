<template>
	<el-form ref="loginForm" :model="loginForm" :rules="loginFormRule" label-position="left" label-width="0px" class="demo-ruleForm login-container">
	    <h3 class="title">系统登录</h3>
	    <el-form-item prop="userAccount">
	  		<el-input type="text" v-model="loginForm.userAccount" auto-complete="off" placeholder="账号"></el-input>
	    </el-form-item>
	    <el-form-item prop="userPassword">
	   		<el-input type="text" v-model="loginForm.userPassword" auto-complete="off" placeholder="密码" show-password></el-input>
	    </el-form-item>
	    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
	    <el-form-item style="width:100%;">
	   		<el-button type="primary" style="width:100%;" @click="handleLogin" :loading="loginLoading">登录</el-button>
	    </el-form-item>
	    
	    <!--新增界面-->
		<el-dialog title="设置登录密码" :visible.sync="passwordVisible">
			<h3 class="title">您好，这是你第一次登录该企业的管理后台，请先设置管理密码。</h3>
			<el-form ref="passwordForm" :model="passwordForm" label-width="80px" :rules="passwordFormRules">
				<el-form-item label="登录密码" prop="password">
					<el-input type="password" v-model.trim="passwordForm.password" placeholder="请输入登录密码" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword">
					<el-input type="password" v-model.trim="passwordForm.confirmPassword" placeholder="请重复输入登录密码" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="handlePassword" :loading="passwordLoading">提交</el-button>
			</div>
		</el-dialog>
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
		        loginFormRule: {
		        	userAccount: [
		        		{ required: true, message: '请输入账号', trigger: 'blur' },
	        		],
	        		userPassword: [
	        			{ required: true, message: '请输入密码', trigger: 'blur' },
        			]
		        },
		        checked: true,
		        
		        passwordVisible: false,//新增界面是否显示
				//新增界面数据
		        passwordForm: {
		        	password: '',
		        	confirmPassword: ''
				}, 
				passwordLoading: false,
				passwordFormRules: {
					password: [
						{ required: true, message: '请输入登录密码', trigger: 'blur' }
					],
					confirmPassword: [
						{ required: true, message: '请重复输入登录密码', trigger: 'blur' }
					],
				}, 
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
	    			if (valid) {
    					let params = {
							userAccount: this.loginForm.userAccount,
							userPassword: this.loginForm.userPassword
    					};
    					let _this = this;
    					axios.post('/user/login', params).then(function(response) {
    						_this.loginLoading = false;
    						var retCode = response.data.retCode;
    						var retMsg = response.data.retMsg;
    						if(retCode == '0000000') {
    							var result = response.data.result;
    							//清除所有的key/value
    							sessionStorage.clear();
    							sessionStorage.setItem('token', response.data.result.token);
    						} else if(retCode == '1010006') {
    							_this.passwordVisible = true;
    						} else {
    							_this.$message.error(retMsg);
    						}
    					}).catch(function (error) {
    						console.log(error);
    					});
					}
				});
	      	},
	      	//修改密码
			handlePassword: function () {
				this.$refs.passwordForm.validate((valid) => {
					if (valid) {
	    				if(this.passwordForm.password != this.passwordForm.confirmPassword) {
	    					this.$message.error('登录密码和确认密码不一致');
	    				} else {
							this.passwordLoading = true;
							let params = {
								userAccount: this.loginForm.userAccount,
								userPassword: this.passwordForm.password
	    					};
							let _this = this;
							axios.post('/user/firstlogin/updatePassword', params).then(function(response) {
								_this.passwordLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '修改成功，请重新登录！',
										type: 'success'
									});
									_this.passwordVisible = false;
								} else {
									if(retCode == '00000002') {
										_this.$message.error('保存失败');
									} else {
										_this.$message.error(retMsg);
									}
								}
				              }).catch(function (error) {
				                	console.log(error);
				              });
	    				}
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