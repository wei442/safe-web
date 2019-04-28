<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="riskForm" size="small" style="float: left;">
				<el-form-item label="风险名称">
					<el-input v-model.trim="riskForm.riskName" placeholder="请输入企业名称" clearable></el-input>
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
			<el-table-column prop="riskWorkPlace" label="作业场所" header-align="center" align="center"></el-table-column>
			<el-table-column prop="riskCategory" label="风险类别" header-align="center" align="center"></el-table-column>
			<el-table-column prop="riskReason" label="风险因素" header-align="center" align="center"></el-table-column>
			<el-table-column prop="riskLevel" label="风险级别" header-align="center" align="center"></el-table-column>
			<el-table-column prop="controlReason" label="管控因素" header-align="center" align="center"></el-table-column>
			<el-table-column prop="controlMethod" label="管控措施" header-align="center" align="center"></el-table-column>
			<el-table-column prop="isDanger" label="是否隐患排查" :formatter="formatIsDanger" header-align="center" align="center"></el-table-column>
			<el-table-column prop="frequency" label="检查频次" header-align="center" align="center"></el-table-column>
			<el-table-column prop="riskStatus" label="状态" :formatter="formatRiskStatus" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="作业场所" prop="riskWorkPlace">
					<el-input v-model.trim="addForm.riskWorkPlace" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="风险类别" prop="riskCategory">
					<el-input v-model.trim="addForm.riskCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="风险因素" prop="riskReason">
					<el-input v-model.trim="addForm.riskReason" auto-complete="off"></el-input>
				</el-form-item>
					<el-form-item label="风险级别" prop="riskLevel">
				<el-input v-model.trim="addForm.riskLevel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管控因素" prop="controlReason">
					<el-input v-model.trim="addForm.controlReason" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管控措施" prop="controlMethod">
					<el-input v-model.trim="addForm.controlMethod" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否隐患排查" prop="isDanger">
					<el-select v-model.trim="addForm.isDanger" placeholder="请选择">
						<el-option v-for="item in isDangerOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检查频次" prop="frequency">
					<el-input v-model.trim="addForm.frequency" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="riskStatus">
					<el-select v-model.trim="addForm.riskStatus" placeholder="请选择">
		    			<el-option v-for="item in riskStatusOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
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
				<<el-form-item label="作业场所" prop="riskWorkPlace">
					<el-input v-model.trim="editForm.riskWorkPlace" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="风险类别" prop="riskCategory">
					<el-input v-model.trim="editForm.riskCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="风险因素" prop="riskReason">
					<el-input v-model.trim="editForm.riskReason" auto-complete="off"></el-input>
				</el-form-item>
					<el-form-item label="风险级别" prop="riskLevel">
				<el-input v-model.trim="editForm.riskLevel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管控因素" prop="controlReason">
					<el-input v-model.trim="editForm.controlReason" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管控措施" prop="controlMethod">
					<el-input v-model.trim="editForm.controlMethod" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否隐患排查" prop="isDanger">
					<el-select v-model.trim="editForm.isDanger" placeholder="请选择">
						<el-option v-for="item in isDangerOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="检查频次" prop="frequency">
					<el-input v-model.trim="editForm.frequency" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="riskStatus">
					<el-select v-model.trim="editForm.riskStatus" placeholder="请选择">
		    			<el-option v-for="item in riskStatusOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
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
				<el-form-item label="企业编码">{{ showForm.riskCode }}</el-form-item>
				<el-form-item label="企业名称">{{ showForm.riskName }}</el-form-item>
				<el-form-item label="企业内容">{{ showForm.content }}</el-form-item>
				<el-form-item label="版本号">{{ showForm.version }}</el-form-item>
				<el-form-item label="企业类型">{{ showForm.type == 1 ? '单条' : showForm.type == 2 ? '多条' : '' }}</el-form-item>
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
				riskForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					riskName: [
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
					riskName: [
						{ required: true, message: '请输入企业名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择企业类型', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				isDangerOptions: [
					{
						value: 1,
						label: '否'
					},
					{
						value: 2,
						label: '是'
					},
				],
				riskStatusOptions: [
					{
						value: 1,
						label: '正常'
					},
					{
						value: 2,
						label: '报废'
					},
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
	      	//是否隐患排查显示转换
	      	formatIsDanger: function (row, column) {
				return row.riskStatus == 0 ? '是否隐患排查' : row.riskStatus == 1 ? '是': '';
			},
			//风险状态显示转换
			formatRiskStatus: function (row, column) {
				return row.riskStatus == 1 ? '正常' : row.riskStatus == 2 ? '报废': '';
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					riskName: this.riskForm.riskName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/risk/getListByPage', params).then(function(response) {
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
							axios.post('/risk/add', params).then(function(response) {
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
							axios.post('/risk/update', params).then(function(response) {
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
						riskId: row.riskId
					};
					let _this = this;
					axios.post('/risk/delete', params).then(function(response) {
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