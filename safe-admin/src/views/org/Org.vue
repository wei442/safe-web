<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<h3 class="title">下级部门</h3>
			<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
				<el-form-item>
					<el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加子部门</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" border fit highlight-current-row v-loading="listLoading" stripe style="width:100%;" size="medium">
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
			<el-table-column prop="orgName" label="组织机构名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgType" label="组织机构类型" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" width="240" header-align="center" align="center">
				<template slot-scope="scope">
			        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			        <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
		  		</template>
			</el-table-column>
		</el-table>
		
		<br>
		<!--分页开始-->
		<div class="block">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
			<br>
		</div>
	    <!--分页结束-->
	    
		<br>
		<!--列表-->
		<el-table :data="tableData" border fit highlight-current-row v-loading="listLoading" stripe style="width:100%;" size="medium">
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
			<el-table-column prop="titleName" label="职务名称" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" width="240" header-align="center" align="center">
				<template slot-scope="scope">
			        <el-button type="primary" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
			        <el-button size="small" @click="handleShow(scope.$index, scope.row)">查看</el-button>
		  		</template>
			</el-table-column>
		</el-table>
		
		<br>
		<!--分页开始-->
		<div class="block">
			<el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="currentPage"
				:page-sizes="[10, 20, 30, 40]"
				:page-size="pageSize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total">
			</el-pagination>
			<br>
		</div>
	    <!--分页结束-->
	    
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addDialogVisible">
			<el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="80px">
				<el-form-item label="组织机构名称" prop="orgName">
					<el-input v-model.trim="addForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构类型" prop="orgType">
					<el-select v-model.trim="addForm.orgType" placeholder="请选择">
		    			<el-option v-for="item in orgTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="组织机构性质" prop="orgNature">
					<el-select v-model.trim="addForm.orgNature" placeholder="请选择">
						<el-option v-for="item in orgNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组织机构电话" prop="orgTelphone">
					<el-input v-model.trim="addForm.orgTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构传真" prop="orgFax">
					<el-input v-model.trim="addForm.orgFax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="orgTelphone">
					<el-input v-model.trim="addForm.orgTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构地址" prop="orgAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.orgAddr" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit" :loading="addLoading">保 存</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editDialogVisible">
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
				<el-form-item label="组织机构名称" prop="orgName">
					<el-input v-model.trim="editForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构类型" prop="orgType">
					<el-select v-model.trim="editForm.orgType" placeholder="请选择">
		    			<el-option v-for="item in orgTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="组织机构性质" prop="orgNature">
					<el-select v-model.trim="editForm.orgNature" placeholder="请选择">
						<el-option v-for="item in orgNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="组织机构电话" prop="orgTelphone">
					<el-input v-model.trim="editForm.orgTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构传真" prop="orgFax">
					<el-input v-model.trim="editForm.orgFax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="orgTelphone">
					<el-input v-model.trim="editForm.orgTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="组织机构地址" prop="orgAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.orgAddr" auto-complete="off"></el-input>
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
				orgForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					orgName: [
						{ required: true, message: '请输入组织机构名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择组织机构类型', trigger: 'blur' }
					],
				}, 
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					orgName: [
						{ required: true, message: '请输入组织机构名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择组织机构类型', trigger: 'blur' }
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
	      	//组织机构内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.orgStatus == 1 ? '正常' : row.orgStatus == 2 ? '冻结' : row.orgStatus == 3 ? '注销': '';
			},
			loadData: function() {
				let params = {
					orgName: this.orgForm.orgName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
						_this.listLoading = false;
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.tableData = response.data.result.dataList;
							_this.total = response.data.result.page.total;
						} else {
							_this.$message.error(retMsg);
						}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//显示新增界面
			handleAdd: function () {
				this.addDialogVisible = true;
				this.$refs.addForm.resetFields();
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = this.addForm;
							let _this = this;
							axios.post('/org/add', params).then(function(response) {
								_this.addLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
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
						orgId: row.orgId
					};
					let _this = this;
					axios.post('/org/delete', params).then(function(response) {
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
		},
	}
</script>