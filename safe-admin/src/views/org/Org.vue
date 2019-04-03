<template>
	<section>
	
		<el-container style="height: 560px; border: 1px solid #eee">
			<el-aside width="220px" style="background-color: rgb(238, 241, 246)">
				<h3>组织机构</h3>
				<el-tree :data="treeData" default-expand-all node-key="orgId" ref="tree" highlight-current @node-click="handleNodeClick" :props="defaultProps"></el-tree>
			</el-aside>
			<br>
			
			<el-container>
				<el-main>
					<!--工具条-->
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
							<h3 class="title">{{orgForm.orgName}}</h3>
							<el-form-item>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handleOrgAdd">新增子部门</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<!--列表-->
					<el-table :data="tableOrgData" border fit highlight-current-row v-loading="listOrgLoading" stripe style="width:100%;" size="small" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
						<el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
					</el-table>
					
					<br>
					<!--工具条-->
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
							<h3 class="title">部门人员</h3>
							<el-form-item>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonAdd">新增人员</el-button>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonBatchDelete(tableChecked)">批量删除</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<!--列表-->
					<el-table :data="tablePersonData" border fit highlight-current-row v-loading="listPersonLoading" stripe style="width:100%;" size="small" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
						<el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
						<el-table-column prop="userName" label="用户名称" header-align="center" align="center"></el-table-column>
						<el-table-column prop="userAccount" label="手机" header-align="center" align="center"></el-table-column>
						<el-table-column label="操作" width="240" header-align="center" align="center">
							<template slot-scope="scope">
						        <el-button type="primary" size="small" @click="handlePersonEdit(scope.$index, scope.row)">编辑</el-button>
						        <el-button type="danger" size="small" @click="handlePersonDelete(scope.$index, scope.row)">删除</el-button>
					  		</template>
						</el-table-column>
					</el-table>
				</el-main>
			</el-container>
	    </el-container>
		<br>
	    
		<!--新增部门界面-->
		<el-dialog title="新增部门" :visible.sync="addOrgDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">部门信息</h3>
			</el-col>
		
			<el-form ref="addOrgForm" :model="addOrgForm" :rules="addOrgFormRules" label-width="120px">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model.trim="addOrgForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="parentOrgName">
					<el-input v-model.trim="addOrgForm.parentOrgName" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addOrgDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrgSubmit" :loading="addOrgLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--新增部门人员界面-->
		<el-dialog title="新增部门人员" :visible.sync="addPersonDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">人员信息</h3>
			</el-col>
			<el-form ref="addPersonForm" :model="addPersonForm" :rules="addPersonFormRules" label-width="120px">
				<el-form-item label="部门" prop="orgName">
					<el-input v-model.trim="addPersonForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="userName">
					<el-input v-model.trim="addPersonForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="userAccount">
					<el-input v-model.trim="addPersonForm.userAccount" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addPersonDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPersonSubmit" :loading="addPersonLoading">保 存</el-button>
			</div>
		</el-dialog>

		<!--编辑部门人员界面-->
		<el-dialog title="编辑部门人员" :visible.sync="editPersonDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">人员信息</h3>
			</el-col>
			<el-form ref="editPersonForm" :model="editPersonForm" :rules="editPersonFormRules" label-width="80px">
				<el-form-item label="部门" prop="orgName">
					<el-input v-model.trim="editPersonForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="userName">
					<el-input v-model.trim="editPersonForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="userAccount">
					<el-input v-model.trim="editPersonForm.userAccount" auto-complete="off" disabled></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editPersonDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editPersonSubmit" :loading="editPersonLoading">保 存</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				treeData: [],
				defaultProps: {
					children: 'orgList',
					label: 'orgName'
		        },
		        
		        tableOrgData: [],
				listOrgLoading: false,
				orgForm: {},
				labelPosition: 'right',
				addOrgDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addOrgForm: {
					orgName: '',
					parentOrgId: '',
					parentOrgName: '',
				}, 
				addOrgLoading: false,
				addOrgFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					parentOrgName: [
						{ required: true, message: '请输入上级部门名称', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				
				tablePersonData: [],
				listPersonLoading: false,
				tableChecked:[],
				addPersonDialogVisible: false,//新增界面是否显示
				//新增人员界面数据
				addPersonForm: {
				}, 
				addPersonLoading: false,
				addPersonFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					userAccount: [
						{ required: true, message: '请输入手机', trigger: 'blur' }
					],
				}, 
				editPersonDialogVisible: false,//编辑界面是否显示
				//编辑人员界面数据
				editPersonForm: {
				},
				editPersonLoading: false,
				editPersonFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请选择部门类型', trigger: 'blur' }
					],
					userAccount: [
						{ required: true, message: '请输入手机', trigger: 'blur' }
					],
				}, 
				
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    	this.search();
	    	this.handleNodeClick();
	    },
		methods: {
	    	//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
						_this.tableOrgData = response.data.result.dataList;
						var orgId = response.data.result.dataList[0].orgId;
						_this.$refs.tree.setCurrentKey(orgId);
						this.loadUserOrgData(orgId);
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//加载机构数据
			loadOrgData: function(orgId) {
				let params = {
					orgId:orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tableOrgData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//加载用机构数据
			loadUserOrgData: function(orgId) {
				let params = {
					orgId:orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/user/org/getList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tablePersonData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
			}, 
			
			//显示新增部门界面
			handleOrgAdd: function () {
				if(this.$refs.tree.getCurrentKey() == null) {
					this.$message.error('请选择一个部门，继续新增子部门');
				} else {
					this.addOrgDialogVisible = true;
					this.addOrgForm.orgName = '';
					this.addOrgForm.parentOrgId = this.$refs.tree.getCurrentNode().orgId;
					this.addOrgForm.parentOrgName = this.$refs.tree.getCurrentNode().orgName;
				}
			},
			//显示新增部门人员界面
			handlePersonAdd: function () {
				if(this.$refs.tree.getCurrentKey() == null) {
					this.$message.error('请选择一个部门，继续新增人员');
				} else {
					this.addPersonDialogVisible = true;
					this.addPersonForm.orgName = this.$refs.tree.getCurrentNode().orgName;
				}
			},
			//显示编辑界面
			handlePersonEdit: function (index, row) {
				this.editPersonDialogVisible = true;
				this.editPersonForm = Object.assign({}, row);
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
			},
			//新增部门
			addOrgSubmit: function () {
				this.$refs.addOrgForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addOrgLoading = true;
							let params = this.addOrgForm;
							let _this = this;
							axios.post('/org/add', params).then(function(response) {
								_this.addOrgLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addOrgDialogVisible = false;
								} else if(retCode == '00000002') {
									_this.$message.error('保存失败');
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
			handleNodeClick(data) {
				alert("data.parentOrgId==="+data.parentOrgId);
				alert("data.orgId==="+data.orgId);
				this.$refs.tree.setCurrentKey(-1);
				this.loadOrgData(data.orgId);
				this.loadUserOrgData(data.orgId);
				this.addPersonForm.orgId = data.orgId;
				this.orgForm.orgName=data.orgName;
	        },
			
			//新增部门人员
			addPersonSubmit: function () {
				this.$refs.addPersonForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addPersonLoading = true;
							let params = this.addPersonForm;
							let _this = this;
							axios.post('/user/org/add', params).then(function(response) {
								_this.addPersonLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addPersonDialogVisible = false;
									_this.$refs.addPersonForm.resetFields();
								} else if(retCode == '00000002') {
									_this.$message.error('保存失败');
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
			//编辑
			editPersonSubmit: function () {
				this.$refs.editPersonForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.editPersonLoading = true;
							let params = this.editPersonForm;
							let _this = this;
							axios.post('/user/org/update', params).then(function(response) {
								_this.editPersonLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									_this.loadData();
						         	_this.editPersonDialogVisible = false;
								} else if(retCode == '00000002') {
									_this.$message.error('保存失败');
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
			//删除
			handlePersonDelete: function () {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listPersonLoading = true;
					let params = {
						userOrgId: row.userOrgId
					};
					let _this = this;
					axios.post('/user/org/delete', params).then(function(response) {
						_this.listPersonLoading = false;
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData();
						} else if(retCode == '00000002') {
							_this.$message.error('保存失败');
						} else {
							_this.$message.error(retMsg);
						}
		              }).catch(function (error) {
		                	console.log(error);
		              });
		        }).catch(() => {
		        });
			},
			//批量删除人员
			handlePersonBatchDelete: function (rows) {
				rows.forEach(function(item){
					alert('userOrgId==='+item.userOrgId);
				})
				
				this.$confirm('确认批量删除记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listPersonLoading = true;
					let params = {
						orgId: row.orgId
					};
					let _this = this;
					axios.post('/user/org/delete1', params).then(function(response) {
						_this.listPersonLoading = false;
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData();
						} else if(retCode == '00000002') {
							_this.$message.error('保存失败');
						} else {
							_this.$message.error(retMsg);
						}
		              }).catch(function (error) {
		                	console.log(error);
		              });
		        }).catch(() => {
		        });
			},
			handleSelectionChange(val) {
				this.tableChecked = val;
			}
		},
		
		mounted() {
			this.$refs.tree.setCurrentKey(-1);
		}
	}
</script>