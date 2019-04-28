<template>
	<el-form :model="registerForm" :rules="registerFormRule" ref="registerForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
	    <h3 class="title">系统注册</h3>
	    <el-form-item prop="userAccount">
	  		<el-input type="text" v-model="registerForm.userAccount" auto-complete="off" placeholder="手机号码"></el-input>
	    </el-form-item>
	    <el-form-item prop="userName">
  			<el-input type="text" v-model="registerForm.userName" auto-complete="off" placeholder="用户名字"></el-input>
		</el-form-item>
	    <el-form-item prop="enterpriseName">
	   		<el-input type="text" v-model="registerForm.enterpriseName" auto-complete="off" placeholder="企业名称"></el-input>
	    </el-form-item>
	    <el-form-item style="width:100%;">
	   		<el-button type="primary" style="width:100%;" @click="handRegister" :loading="registerLoading">立即注册</el-button>
	    </el-form-item>
	</el-form>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
		        registerForm: {
		        	userAccount: '',
		        	enterpriseName: ''
		        },
		        registerFormRule: {
		        	userAccount: [
		        		{ required: true, message: '请输入手机号码', trigger: 'blur' },
	        		],
	        		userName: [
	        			{ required: true, message: '请输入用户名称', trigger: 'blur' },
        			],
	        		enterpriseName: [
	        			{ required: true, message: '请输入企业名称', trigger: 'blur' },
        			]
		        },
		        checked: true
	      };
	      //手机号
		    var validatePhone = (rule, value, callback) => {
		      if (/^1[34578]{1}\d{9}$/.test(value) == false) {
		        callback(new Error("请输入正确的手机号"));
		      } else {
		        callback();
		      }
		    };
	    },
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    },
	    methods: {
	    	handleReset2() {
	    		this.$refs.registerForm.resetFields();
	    	},
	    	//注册
	    	handRegister: function () {
	    		this.$refs.registerForm.validate((valid) => {
	    			if (valid) {
    					let params = {
							userAccount: this.registerForm.userAccount, 
							userName: this.registerForm.userName, 
							enterpriseName: this.registerForm.enterpriseName
    					};
    					let _this = this;
    					axios.post('/user/register', params).then(function(response) {
    						_this.registerLoading = false;
    						var retCode = response.data.retCode;
    						var retMsg = response.data.retMsg;
    						if(retCode == '0000000') {
    							_this.$message({
    								message: '您好，注册成功，请重新登录管理后台！',
    								type: 'success'
    							});
    							_this.$router.push('/login');
    						} else {
    							_this.$message.error(retMsg);
    						}
    					}).catch(function (error) {
    						console.log(error);
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