<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="enterpriseForm" size="small" style="float: left;">
				<el-form-item label="企业名称">
					<el-input v-model.trim="enterpriseForm.enterpriseName" placeholder="请输入企业名称" clearable></el-input>
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
			<el-table-column prop="enterpriseName" label="企业名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseType" label="企业类型" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseNature" label="企业性质" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseStatus" label="企业状态" :formatter="formatEnterpriseStatus" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseTelphone" label="企业电话" header-align="center" align="center"></el-table-column>
			<el-table-column prop="province" label="省份" header-align="center" align="center"></el-table-column>
			<el-table-column prop="city" label="城市" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseMainCategory" label="行业大类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseSubCategory" label="行业小类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseScale" label="行业规模" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseAddr" label="企业地址" header-align="center" align="center"></el-table-column>
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
			<el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="120px">
				<el-form-item label="企业名称" prop="enterpriseName">
					<el-input v-model.trim="addForm.enterpriseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="企业类型" prop="enterpriseType">
					<el-select v-model.trim="addForm.enterpriseType" placeholder="请选择">
		    			<el-option v-for="item in enterpriseTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="企业性质" prop="enterpriseNature">
					<el-select v-model.trim="addForm.enterpriseNature" placeholder="请选择">
						<el-option v-for="item in enterpriseNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业电话" prop="enterpriseTelphone">
					<el-input v-model.trim="addForm.enterpriseTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所在省份" prop="province">
					<el-input v-model.trim="addForm.province" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所在城市" prop="city">
					<el-input v-model.trim="addForm.city" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业大类" prop="enterpriseMainCategory">
					<el-input v-model.trim="addForm.enterpriseMainCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业小类" prop="enterpriseSubCategory">
					<el-input v-model.trim="addForm.enterpriseSubCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业规模" prop="enterpriseScale">
					<el-input v-model.trim="addForm.enterpriseScale" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="企业地址" prop="enterpriseAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.enterpriseAddr" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addSubmit" :loading="addLoading">保 存</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editDialogVisible">
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px">
				<el-form-item label="企业名称" prop="enterpriseName">
					<el-input v-model.trim="editForm.enterpriseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="企业类型" prop="enterpriseType">
					<el-select v-model.trim="editForm.enterpriseType" placeholder="请选择">
		    			<el-option v-for="item in enterpriseTypeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="企业性质" prop="enterpriseNature">
					<el-select v-model.trim="editForm.enterpriseNature" placeholder="请选择">
						<el-option v-for="item in enterpriseNatureOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业电话" prop="enterpriseTelphone">
					<el-input v-model.trim="editForm.enterpriseTelphone" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所在省份" prop="province">
					<el-input v-model.trim="editForm.province" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所在城市" prop="city">
					<el-input v-model.trim="editForm.city" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业大类" prop="enterpriseMainCategory">
					<el-input v-model.trim="editForm.enterpriseMainCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业小类" prop="enterpriseSubCategory">
					<el-input v-model.trim="editForm.enterpriseSubCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="行业规模" prop="enterpriseScale">
					<el-input v-model.trim="editForm.enterpriseScale" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="企业地址" prop="enterpriseAddr">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.enterpriseAddr" auto-complete="off"></el-input>
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
				<el-form-item label="企业名称">{{ showForm.enterpriseName }}</el-form-item>
				<el-form-item label="企业类型">
					{{ showForm.enterpriseType == 1 ? '政府部门' : showForm.enterpriseType == 2 ? '院校' : showForm.enterpriseType == 3 ? '科研所' : showForm.enterpriseType == 4 ? '国有企业' : showForm.enterpriseType == 5 ? '集体企业'  
					: showForm.enterpriseType == 6 ? '股份合作企业' : showForm.enterpriseType == 7 ? '联营企业'  : showForm.enterpriseType == 8 ? '有限责任公司' : showForm.enterpriseType == 9 ? '股份有限公司'  
					 : showForm.enterpriseType == 10 ? '私营企业' : showForm.enterpriseType == 11 ? '港、澳、台商投资企业' : showForm.enterpriseType == 12 ? '外商投资企业' : showForm.enterpriseType == 13 ? '其他' : '' }}
				</el-form-item>
				<el-form-item label="企业性质">
					{{ showForm.enterpriseNature == 1 ? '国有' : showForm.enterpriseNature == 2 ? '合作' : showForm.enterpriseNature == 3 ? '合资' : showForm.enterpriseNature == 4 ? '独资' : showForm.enterpriseNature == 5 ? '集体'  
					: showForm.enterpriseNature == 6 ? '私营' : showForm.enterpriseNature == 7 ? '个体工商户' : showForm.enterpriseNature == 8 ? '报关' : showForm.enterpriseNature == 9 ? '其他' : '' }}
				</el-form-item>
				<el-form-item label="企业电话">{{ showForm.enterpriseTelphone }}</el-form-item>
				<el-form-item label="省份">{{ showForm.province }}</el-form-item>
				<el-form-item label="城市">{{ showForm.city }}</el-form-item>
				<el-form-item label="行业小类">{{ showForm.enterpriseMainCategory }}</el-form-item>
				<el-form-item label="行业大类">{{ showForm.enterpriseSubCategory }}</el-form-item>
				<el-form-item label="行业规模">{{ showForm.enterpriseScale }}</el-form-item>
				<el-form-item label="企业地址">{{ showForm.enterpriseAddr }}</el-form-item>
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
				enterpriseForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					enterpriseName: [
						{ required: true, message: '请输入企业名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择企业类型', trigger: 'blur' }
					],
				}, 
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					enterpriseName: [
						{ required: true, message: '请输入企业名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择企业类型', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				enterpriseTypeOptions: [
					{
						value: 1,
						label: '政府部门'
					},
					{
						value: 2,
						label: '院校'
					},
					{
						value: 3,
						label: '科研所'
					},
					{
						value: 4,
						label: '国有企业'
					},
					{
						value: 5,
						label: '集体企业'
					},
					{
						value: 6,
						label: '股份合作企业'
					},
					{
						value: 7,
						label: '联营企业'
					},
					{
						value: 8,
						label: '有限责任公司'
					},
					{
						value: 9,
						label: '股份有限公司'
					},
					{
						value: 10,
						label: '私营企业'
					},
					{
						value: 11,
						label: '港、澳、台商投资企业'
					},
					{
						value: 12,
						label: '外商投资企业'
					},
					{
						value: 13,
						label: '其他'
					}
				],
				enterpriseNatureOptions: [
					{
						value: 1,
						label: '国有'
					},
					{
						value: 2,
						label: '合作'
					},
					{
						value: 3,
						label: '合资'
					},
					{
						value: 4,
						label: '独资'
					},
					{
						value: 5,
						label: '集体'
					},
					{
						value: 6,
						label: '私营'
					},
					{
						value: 7,
						label: '个体工商户'
					},
					{
						value: 8,
						label: '报关'
					},
					{
						value: 9,
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
	      	//企业内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.enterpriseStatus == 1 ? '正常' : row.enterpriseStatus == 2 ? '冻结' : row.enterpriseStatus == 3 ? '注销': '';
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					enterpriseName: this.enterpriseForm.enterpriseName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/enterprise/getListByPage', params).then(function(response) {
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
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = this.addForm;
							let _this = this;
							axios.post('/enterprise/add', params).then(function(response) {
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
							axios.post('/enterprise/update', params).then(function(response) {
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
						enterpriseId: row.enterpriseId
					};
					let _this = this;
					axios.post('/enterprise/delete', params).then(function(response) {
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