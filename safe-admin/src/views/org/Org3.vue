<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<h3 class="title">下级部门</h3>
			<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增子部门</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		
		<el-col style="padding-bottom: 0px;">
			<el-tree
				:data="treeData"
				default-expand-all
				node-key="orgId"
				ref="tree"
				highlight-current
				@node-click="handleNodeClick"
				:props="defaultProps">
			</el-tree>
		</el-col>
	
		<br>
		
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<h3 class="title">部门人员</h3>
			<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonAdd">新增人员</el-button>
					<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonBatchDelete(tableChecked)">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--列表-->
		<el-table :data="tableData" border fit highlight-current-row v-loading="listLoading" stripe style="width:100%;" size="small" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
			<el-table-column prop="userName" label="用户名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="userAccount" label="手机" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" width="240" header-align="center" align="center">
				<template slot-scope="scope">
			        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			        <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
		  		</template>
			</el-table-column>
		</el-table>
		
		<br>
	    
		<!--新增部门界面-->
		<el-dialog title="新增部门" :visible.sync="addDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">部门信息</h3>
			</el-col>
		
			<el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="120px">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model.trim="addForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="parentOrgName">
					<el-input v-model.trim="addForm.parentOrgName" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit" :loading="addLoading">保 存</el-button>
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

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editDialogVisible">
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model.trim="editForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmit" :loading="editLoading">保 存</el-button>
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
		        
				orgForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
					orgName: '',
					parentOrgId: '',
					parentOrgName: '',
				}, 
				addLoading: false,
				addFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					parentOrgName: [
						{ required: true, message: '请输入上级部门名称', trigger: 'blur' }
					],
				}, 
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请选择部门类型', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				
				addPersonDialogVisible: false,//新增界面是否显示
				//新增界面数据
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
				
				tableChecked:[],
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    	this.search();
	    },
		methods: {
	      	//当前页
	      	handleCurrentChange(val) {
        		this.pageNum = val;
        		this.search();
	      	},
			//每页条数
			handleSizeChange(val) {
        		this.pageSize = val;
        		this.search();
	      	},
	      	//部门内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.orgStatus == 1 ? '正常' : row.orgStatus == 2 ? '冻结' : row.orgStatus == 3 ? '注销': '';
			},
			loadData: function() {
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
				this.loadTreeUserData();
			}, 
			
			loadTreeData: function() {
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
				axios.post('/org/getTreeUserList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tableData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
			},
			
			loadTreeUserData: function(orgId) {
				let params = {
					orgId:orgId
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/org/getTreeUserList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tableData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
			}, 
			
			//显示新增部门界面
			handleAdd: function () {
				if(this.$refs.tree.getCurrentKey() == null) {
					this.$message.error('请选择一个部门，继续新增子部门');
				} else {
					this.addDialogVisible = true;
					this.addForm.orgName = '';
					this.addForm.parentOrgId = this.$refs.tree.getCurrentNode().orgId;
					this.addForm.parentOrgName = this.$refs.tree.getCurrentNode().orgName;
				}
			},
			//显示新增部门人员界面
			handlePersonAdd: function () {
				this.addPersonDialogVisible = true;
				this.addPersonForm.orgName = this.$refs.tree.getCurrentNode().orgName;
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editDialogVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			//新增部门
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = this.addForm;
							let _this = this;
							axios.post('/org/add', params).then(function(response) {
								_this.addLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addDialogVisible = false;
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
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let params = this.editForm;
							let _this = this;
							axios.post('/org/update', params).then(function(response) {
								_this.editLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									_this.loadData();
						         	_this.editDialogVisible = false;
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
			handleDelete: function (index, row) {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listLoading = true;
					let params = {
						orgId: row.orgId
					};
					let _this = this;
					axios.post('/org/delete', params).then(function(response) {
						_this.listLoading = false;
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
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
			handleNodeClick(data) {
				alert("data.parentOrgId==="+data.parentOrgId);
				alert("data.orgId==="+data.orgId);
				this.$refs.tree.setCurrentKey(-1);
				this.loadTreeUserData(data.orgId);
				this.addPersonForm.orgId=data.orgId;
//				this.$router.push({name: 'org', params: {orgId: data.orgId}});
	        },
			
			//新增部门人员
			addPersonSubmit: function () {
				this.$refs.addPersonForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addPersonLoading = true;
							let params = this.addPersonForm;
							let _this = this;
							alert('this.addPersonForm.userName==='+this.addPersonForm.userName);
							alert('this.addPersonForm.orgId==='+this.addPersonForm.orgId);
							axios.post('/user/org/add', params).then(function(response) {
								_this.addPersonLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
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
			
			//删除
			handlePersonBatchDelete: function (rows) {
				rows.forEach(function(item){
					alert('userOrgId==='+item.userOrgId);
				})
				
				this.$confirm('确认批量删除记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listLoading = true;
					let params = {
						orgId: row.orgId
					};
					let _this = this;
					axios.post('/user/org/delete1', params).then(function(response) {
						_this.listLoading = false;
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
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
	}
</script>