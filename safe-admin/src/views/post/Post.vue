<template>
	<section>
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
					<el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="tableData" border fit highlight-current-row v-loading="listLoading" stripe style="width:100%;" size="medium">
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
			<el-table-column prop="postName" label="岗位名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postType" label="岗位类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postNature" label="岗位性质" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postStatus" label="岗位状态" :formatter="formatEnterpriseStatus" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postTelphone" label="岗位电话" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postFax" label="岗位传真" header-align="center" align="center"></el-table-column>
			<el-table-column prop="postAddr" label="岗位地址" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model.trim="addForm.postName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位类型" prop="postType">
					<el-select v-model.trim="addForm.postType" placeholder="请选择">
		    			<el-option v-for="item in postTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="岗位性质" prop="postNature">
					<el-select v-model.trim="addForm.postNature" placeholder="请选择">
						<el-option v-for="item in postNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位电话" prop="postTelphone">
					<el-input v-model.trim="addForm.postTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位传真" prop="postFax">
					<el-input v-model.trim="addForm.postFax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="postTelphone">
					<el-input v-model.trim="addForm.postTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位地址" prop="postAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.postAddr" auto-complete="off"></el-input>
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
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model.trim="editForm.postName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位类型" prop="postType">
					<el-select v-model.trim="editForm.postType" placeholder="请选择">
		    			<el-option v-for="item in postTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="岗位性质" prop="postNature">
					<el-select v-model.trim="editForm.postNature" placeholder="请选择">
						<el-option v-for="item in postNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位电话" prop="postTelphone">
					<el-input v-model.trim="editForm.postTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位传真" prop="postFax">
					<el-input v-model.trim="editForm.postFax" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="postTelphone">
					<el-input v-model.trim="editForm.postTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="岗位地址" prop="postAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.postAddr" auto-complete="off"></el-input>
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
			return {
				postForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择岗位类型', trigger: 'blur' }
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
					type: [
						{ required: true, message: '请选择岗位类型', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				postTypeOptions: [
					{
						value: 1,
						label: '政府部门'
					},
					{
						value: '2',
						label: '院校'
					},
					{
						value: '3',
						label: '科研所'
					},
					{
						value: '4',
						label: '国有岗位'
					},
					{
						value: '5',
						label: '集体岗位'
					},
					{
						value: '6',
						label: '股份合作岗位'
					},
					{
						value: '7',
						label: '联营岗位'
					},
					{
						value: '8',
						label: '有限责任公司'
					},
					{
						value: '9',
						label: '股份有限公司'
					},
					{
						value: '10',
						label: '私营岗位'
					},
					{
						value: '11',
						label: '港、澳、台商投资岗位'
					},
					{
						value: '12',
						label: '外商投资岗位'
					},
					{
						value: '13',
						label: '其他'
					}
				],
				postNatureOptions: [
					{
						value: '1',
						label: '国有'
					},
					{
						value: '2',
						label: '合作'
					},
					{
						value: '3',
						label: '合资'
					},
					{
						value: '4',
						label: '独资'
					},
					{
						value: '5',
						label: '集体'
					},
					{
						value: '6',
						label: '私营'
					},
					{
						value: '7',
						label: '个体工商户'
					},
					{
						value: '8',
						label: '报关'
					},
					{
						value: '9',
						label: '其他'
					}
				],
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
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					postName: this.postForm.postName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/post/getListByPage', params).then(function(response) {
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
							axios.post('/post/add', params).then(function(response) {
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
		},
	}
</script>