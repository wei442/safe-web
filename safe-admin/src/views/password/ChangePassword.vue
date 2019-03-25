<template>
	<el-form ref="passwordForm" :model="passwordForm" :rules="passwordFormRules" label-position="left" label-width="100px" class="demo-ruleForm login-container">
		<h3 class="title">您好，这是你第一次登录该企业的管理后台，请先设置管理密码。</h3>
		<el-form-item label="登录密码:" prop="password">
			<el-input v-model.trim="passwordForm.password" placeholder="请输入登录密码" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="确认密码:" prop="confirmPassword">
			<el-input v-model.trim="passwordForm.confirmPassword" placeholder="请重复输入登录密码" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item style="width:100%;" class="dialog-footer">
			<el-button type="primary" @click="handlePassword" :loading="passwordLoading">提 交</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
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
	    	//新增
			handlePassword: function () {
				this.$refs.passwordForm.validate((valid) => {
					if (valid) {
						if(this.passwordForm.password != this.passwordForm.confirmPassword) {
	    					this.$message.error('登录密码和确认密码不一致');
	    				} else {
							this.passwordLoading = true;
							let params = this.passwordForm;
							let _this = this;
							axios.post('/user/adminPassword/add', params).then(function(response) {
								_this.passwordLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addDialogVisible = false;
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
      color: red;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>