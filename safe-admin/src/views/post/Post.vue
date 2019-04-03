<template>
	<section>
		<el-container style="height: 560px; border: 1px solid #eee">
			<el-aside width="220px" style="background-color: rgb(238, 241, 246)">
				<!--列表-->
				<h5>岗位</h5>
				&#12288;<el-button type="primary" icon="el-icon-plus" size="mini" @click="handlePostAdd">新增岗位</el-button>
				<br>
				<br>
				<el-menu :data="treeData" :default-active="onRoutes" default-active="2" class="el-menu-vertical-demo" unique-opened router default-openeds="[1]">
					<el-submenu index="1">
					 	<template slot="title">
						      <span slot="title">岗位</span>
					     </template>
					 	<template v-for="(item,i) in treeData">
							<el-menu-item @click="handlePostPerson(item.postId)">{{ item.postName }}</el-menu-item>
						</template>
					</el-submenu>
				</el-menu>
			</el-aside>

		<el-container>
			<el-main>
			<!--工具条-->
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<el-form :inline="true" :model="postForm" size="small" style="float: left;">
					<el-form-item label="岗位名称">
						<el-input v-model.trim="postForm.postName" placeholder="请输入岗位名称" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonAdd">新增人员</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonBatchDelete">批量删除</el-button>
					</el-form-item>
				</el-form>
			</el-col>
			
			<!--列表-->
			<el-table :data="tableData" border fit highlight-current-row v-loading="listLoading" stripe style="width:100%;" size="medium">
				<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
				<el-table-column prop="userName" label="姓名" header-align="center" align="center"></el-table-column>
				<el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
				<el-table-column label="操作" width="240" header-align="center" align="center">
					<template slot-scope="scope">
				        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
				        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
				        <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
			  		</template>
				</el-table-column>
			</el-table>
		    </el-main>
	    </el-container>
    </el-container>
    
    <!--新增岗位界面-->
	<el-dialog title="新增岗位" :visible.sync="addPostDialogVisible">
		<el-form ref="addPostForm" :model="addPostForm" :rules="addPostFormRules" label-width="80px">
			<el-form-item label="岗位名称" prop="postName">
				<el-input v-model.trim="addPostForm.postName" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="addPostDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addPostSubmit" :loading="addPostLoading">保 存</el-button>
		</div>
	</el-dialog>
	
	<!--新增人员界面-->
	<el-dialog title="新增人员" :visible.sync="addPersonDialogVisible">
		<el-form ref="addPersonForm" :model="addPersonForm" :rules="addPersonFormRules" label-width="80px">
			<el-transfer v-model="value1" :data="data" :titles="['选择', '已选']"></el-transfer>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="addPersonDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="addersonSubmit" :loading="addPersonLoading">保 存</el-button>
		</div>
	</el-dialog>
	

	<!--编辑界面-->
	<el-dialog title="编辑" :visible.sync="editDialogVisible">
		<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
			<el-form-item label="岗位名称" prop="postName">
				<el-input v-model.trim="editForm.postName" auto-complete="off"></el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="editDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="editSubmit" :loading="editLoading">保 存</el-button>
		</div>
	</el-dialog>
	
	<!--查看界面-->
	<el-dialog title="查看" :visible.sync="showDialogVisible">
		<el-form :model="showForm" label-width="80px">
			<el-form-item label="岗位名称">{{ showForm.postName }}</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="showDialogVisible = false">取 消</el-button>
		</div>
	</el-dialog>
    </section>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			const generateData = _ => {
		        const data = [];
		        for (let i = 1; i <= 15; i++) {
		          data.push({
		            key: i,
		            label: `备选项 ${ i }`,
		            disabled: i % 4 === 0
		          });
		        }
		        return data;
		      };
			return {
				treeData: [],
				data: generateData(),
		        value1: [1, 4],
				
				postForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addPostDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addPostForm: {
				}, 
				addPostLoading: false,
				addPostFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				
				addPersonDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addPersonForm: {
				}, 
				addPersonLoading: false,
				addPersonFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				
				
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
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
	      	//岗位内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.postStatus == 1 ? '正常' : row.postStatus == 2 ? '冻结' : row.postStatus == 3 ? '注销': '';
			},
			loadData: function() {
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/post/getList', params).then(function(response) {
					_this.listLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//显示新增岗位界面
			handlePostAdd: function () {
				this.addPostDialogVisible = true;
				this.$refs.addPostForm.resetFields();
			},
			//显示新增人员界面
			handlePersonAdd: function () {
				this.addPersonDialogVisible = true;
				this.$refs.addPostForm.resetFields();
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
			//新增岗位
			addPostSubmit: function () {
				this.$refs.addPostForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addPostLoading = true;
							let params = this.addPostForm;
							let _this = this;
							axios.post('/post/add', params).then(function(response) {
								_this.addPostLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addPostDialogVisible = false;
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
							axios.post('/post/update', params).then(function(response) {
								_this.editLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
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
						postId: row.postId
					};
					let _this = this;
					axios.post('/post/delete', params).then(function(response) {
						_this.listLoading = false;
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
			
			//
			handlePostPerson: function (postId) {
				alert('1111');
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/user/post/getList', params).then(function(response) {
					alert('2222');
					_this.listLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
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
			
		},
	}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>