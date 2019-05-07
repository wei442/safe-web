<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="userAdminForm" size="small" style="float: left;">
				<el-form-item label="更换主管理账号，需要验证当前主管理账号的身份">
				</el-form-item>
			</el-form>
		</el-col>
		
		<el-col style="padding-bottom: 0px;">
			<el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="120px">
				<el-form-item label="当前主管理员" prop="userName">{{ addForm.userName }}</el-form-item> 
				<el-form-item label="手机号" prop="userAccount">{{ addForm.userAccount }}</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="nextStep">下一步</el-button>
				</el-form-item>
			</el-form>
		</el-col>

	</section>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				userAdminForm: {},
				labelPosition: 'right',
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
				}, 
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    	this.search();
	    },
		methods: {
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/user/admin/getMaster', params).then(function(response) {
						_this.listLoading = false;
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.addForm = response.data.result;
						} else {
							_this.$message.error(retMsg);
						}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//下一步
			nextStep: function () {
				this.$router.push('/masterAdminSecond');
			},
			
		},
	}
</script>
