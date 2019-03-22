<enterprise>
	<div>
		<el-form :inline="true" :model="enterpriseForm" size="mini" style="float: left;">
			<el-form-item label="模板编码">
    				<el-input v-model.trim="enterpriseForm.enterpriseCode" placeholder="请输入模板编码" clearable></el-input>
			</el-form-item>
			<el-form-item label="模板名称">
				<el-input v-model.trim="enterpriseForm.enterpriseName" placeholder="请输入模板名称" clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="search">查询</el-button>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
			</el-form-item>
		</el-form>

		<!--列表-->
		<el-table :data="tableData" border highlight-current-row stripe style="width:100%;" size="medium">
			<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
			<el-table-column prop="enterpriseCode" label="模板编码" header-align="center" align="center"></el-table-column>
			<el-table-column prop="enterpriseName" label="模板名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="模板内容" :formatter="formatContent" header-align="center" align="center"></el-table-column>
			<el-table-column prop="version" label="版本号" header-align="center" align="center"></el-table-column>
			<el-table-column label="操作" width="240" header-align="center" align="center">
				<enterprise slot-scope="scope">
		      		<el-button size="mini" @click="handleShow(scope.$index, scope.row)">查看</el-button>
			        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
			        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
		  		</enterprise>
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
				:total="totalCount">
			</el-pagination>
			<br>
		</div>
	    <!--分页结束-->
	    
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addDialogVisible">
			<el-form ref="addForm" :model="addForm" label-width="80px" :rules="addFormRules">
				<el-form-item label="模板编码">
					<el-input auto-complete="off" :disabled="true" placeholder="无需输入，自动生成"></el-input>
				</el-form-item>
				<el-form-item label="模板名称" prop="enterpriseName">
					<el-input v-model.trim="addForm.enterpriseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板内容" prop="content">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.content"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="version">
					<el-input v-model.trim="addForm.version" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板类型" prop="type">
					<el-select v-model.trim="addForm.type" placeholder="请选择">
				    		<el-option v-for="item in typeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
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
			<el-form ref="editForm" :model="editForm" label-width="80px" :rules="editFormRules">
				<el-form-item label="模板编码" prop="enterpriseCode">
					<el-input v-model.trim="editForm.enterpriseCode" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="模板名称" prop="enterpriseName">
					<el-input v-model.trim="editForm.enterpriseName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板内容" prop="content">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.content"></el-input>
				</el-form-item>
				<el-form-item label="版本号" prop="version">
					<el-input v-model.trim="editForm.version" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="模板类型" prop="type">
					<el-select v-model.trim="editForm.type == 1 ? '单条' : editForm.type == 2 ? '多条' : ''" disabled placeholder="请选择">
				    		<el-option v-for="item in typeOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
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
				<el-form-item label="模板编码">{{ showForm.enterpriseCode }}</el-form-item>
				<el-form-item label="模板名称">{{ showForm.enterpriseName }}</el-form-item>
				<el-form-item label="模板内容">{{ showForm.content }}</el-form-item>
				<el-form-item label="版本号">{{ showForm.version }}</el-form-item>
				<el-form-item label="模板类型">{{ showForm.type == 1 ? '单条' : showForm.type == 2 ? '多条' : '' }}</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showDialogVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		
	</div>
</enterprise>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				enterpriseForm: {},
				tableData: [],
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					enterpriseCode: [
						{ required: true, message: '请输入模板编码', trigger: 'blur' }
					],
					enterpriseName: [
						{ required: true, message: '请输入模板名称', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入模板内容', trigger: 'blur' }
					],
					version: [
						{ required: true, message: '请输入版本号', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择模板类型', trigger: 'blur' }
					],
				}, 
				//新增界面数据
				addForm: {
				}, 
				editDialogVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					enterpriseCode: [
						{ required: true, message: '请输入模板编码', trigger: 'blur' }
					],
					enterpriseName: [
						{ required: true, message: '请输入模板名称', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入模板内容', trigger: 'blur' }
					],
					version: [
						{ required: true, message: '请输入版本号', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '请选择模板类型', trigger: 'blur' }
					],
				}, 
				//新增界面数据
				editForm: {
				},
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				typeOptions: [{
		          value: '1',
		          label: '单条'
		        }, {
		          value: '2',
		          label: '多条'
		        }],
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
	      	//模板内容显示转换
			formatContent: function (row, column) {
				if(row.content.length > 60) {
					return row.content.substring(0, 60)+" ...";
				} else {
					return row.content;
				}
			},
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					enterpriseCode: this.enterpriseForm.enterpriseCode,
					enterpriseName: this.enterpriseForm.enterpriseName
				};
				let _this = this;
				axios.post('/enterprise/getTemplateListByPage', params).then(function(response) {
		    			_this.tableData = response.data.result.enterpriseList;
		            _this.totalCount = response.data.result.totalCount;
	        		}).catch(function (error) {
	          		console.log(error);
	        		});
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
							let params = this.addForm;
							let _this = this;
							axios.post('/enterprise/addTemplate', params).then(function(response) {
								var retCode = response.data.retCode;
								var retInfo = response.data.retInfo;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addDialogVisible = false;
								} else {
									_this.$message.error(retInfo);
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
							let params = this.editForm;
							let _this = this;
							axios.post('/enterprise/updateTemplate', params).then(function(response) {
								var retCode = response.data.retCode;
								var retInfo = response.data.retInfo;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									_this.loadData();
						         	_this.editDialogVisible = false;
								} else {
									_this.$message.error(retInfo);
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
					let params = {
						enterpriseId: row.enterpriseId
					};
					let _this = this;
					axios.post('/enterprise/deleteTemplateById', params).then(function(response) {
						var retCode = response.data.retCode;
						var retInfo = response.data.retInfo;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData();
						} else {
							_this.$message.error(retInfo);
						}
		              }).catch(function (error) {
		                	console.log(error);
		              });
		        }).catch(() => {
		        });
			},
		},
		mounted() {
			this.search();
		}
	}
</script>