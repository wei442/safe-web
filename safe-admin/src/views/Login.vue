<template>
	<el-form ref="loginForm" :model="loginForm" :rules="loginFormRule" label-position="left" label-width="0px" class="demo-ruleForm login-container">
	    <h3 class="title">系统登录</h3>
	    <el-form-item prop="userAccount">
	  		<el-input type="text" v-model="loginForm.userAccount" auto-complete="off" placeholder="账号"></el-input>
	    </el-form-item>
	    <el-form-item prop="userPassword">
	   		<el-input type="text" v-model="loginForm.userPassword" auto-complete="off" placeholder="密码" show-password></el-input>
	    </el-form-item>
	    <el-form-item style="width:100%;">
	   		<el-button type="primary" style="width:100%;" @click="handleLogin" :loading="loginLoading">登录</el-button>
	    </el-form-item>
	    
	    <!--新增界面-->
		<el-dialog title="设置登录密码" :visible.sync="passwordVisible">
			<el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" label-width="90px">
				<h3 class="title">您好，这是您首次登录企业的管理后台，请先设置管理密码。</h3>
				<el-form-item label="登录密码:" prop="password">
					<el-input type="password" v-model.trim="passwordForm.password" placeholder="请输入登录密码" auto-complete="off"></el-input>
					<span style="font-size:90%">密码长度为6到20位，必须包含数字、小写字母、大写字母</span>
				</el-form-item>
				<el-form-item label="确认密码:" prop="confirmPassword">
					<el-input type="password" v-model.trim="passwordForm.confirmPassword" placeholder="请重复输入登录密码" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item style="text-align:right;" class="dialog-footer">
					<el-button @click="passwordVisible = false">取 消</el-button>
					<el-button type="primary" @click="passwordSubmit" :loading="passwordLoading">提 交</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</el-form>
	
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			//密码
			let validatePass = (rule, value, callback) => {
				if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,20}$/.test(value) == false) {
					callback(new Error("请输入6-20位密码，必须包含数字、小写字母、大写字母"));
				} else {
		            callback();
		    	}
			};
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
						{ required: true, message: '请输入登录密码', trigger: 'blur' },
						{ validator: validatePass }
					],
					confirmPassword: [
						{ required: true, message: '请重新输入登录密码', trigger: 'blur' },
						{ validator: validatePass }
					],
				},
				passwordLoading: false,
	      };
	    },
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    },
	    methods: {
	    	//显示新增界面
			handleAdd: function () {
				this.addDialogVisible = true;
				this.$refs.addForm.resetFields();
			},
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
    						let retCode = response.data.retCode;
    						let retMsg = response.data.retMsg;
    						if(retCode == '0000000') {
    							let result = response.data.result;
    							//清除所有的key/value
    							sessionStorage.clear();
    							sessionStorage.setItem('token', response.data.result.token);
    							sessionStorage.setItem('userAccount', response.data.result.userAccount);
    							sessionStorage.setItem('userName', response.data.result.userName);
    							_this.$router.push('/index');
    						} else if(retCode == '0000008') {
    							let enterpriseId = response.data.result.enterpriseId;
    							let userId = response.data.result.userId;
    							_this.passwordVisible = true;
    							_this.$refs.passwordForm.resetFields();
    							_this.passwordForm.enterpriseId = enterpriseId;
    							_this.passwordForm.userId = userId;
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
	      	passwordSubmit: function () {
	      		this.$refs.passwordForm.validate((valid) => {
					if (valid) {
						if(this.passwordForm.password != this.passwordForm.confirmPassword) {
	    					this.$message.error('登录密码和确认密码不一致');
	    				} else {
							let params = {
								enterpriseId: this.passwordForm.enterpriseId, 
								userId: this.passwordForm.userId, 
								password: this.passwordForm.password, 
								confirmPassword: this.passwordForm.confirmPassword
	    					};
							let _this = this;
							axios.post('/user/firstLogin/updatePassword', params).then(function(response) {
								_this.passwordLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '密码修改成功，请重新登录！',
										type: 'success'
									});
									_this.passwordVisible = false;
									_this.$refs.loginForm.resetFields();
									_this.$router.push('/login');
								} else if(retCode == '00000002') {
									_this.$message.error('保存失败');
								} else if(retCode == '0000009' || retCode == '0000010') {
									_this.$message.error(retMsg);
									_this.$router.push('/login');
								} else {
									_this.$message.error(retMsg);
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
      margin: 0px auto 30px auto;
      text-align: center;
      color: red;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>