<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="ruleForm" size="small" style="float: left;">
				<el-form-item label="制度名称">
					<el-input v-model.trim="ruleForm.ruleName" placeholder="请输入制度名称" clearable></el-input>
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
			<el-table-column prop="ruleName" label="制度名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ruleNo" label="制度标号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgName" label="适用范围" header-align="center" align="center"></el-table-column>
			<el-table-column prop="keyWord" label="关键字" header-align="center" align="center"></el-table-column>
			<el-table-column prop="created" label="添加人" header-align="center" align="center"></el-table-column>
			<el-table-column prop="createTime" label="添加时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="publishOrgName" label="发布部门" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="制度名称" prop="ruleName">
					<el-input v-model.trim="addForm.ruleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="制度标号" prop="ruleNo">
					<el-input v-model.trim="addForm.ruleNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="适用范围" prop="orgName">
					<el-input v-model.trim="addForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字" prop="keyWord">
					<el-input v-model.trim="addForm.keyWord" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadfile" :before-upload="beforeUpload" :before-remove="beforeRemove" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
						<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
						<div slot="tip" class="el-upload__tip">上传文件不能超过50M</div>
					</el-upload>
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
				<el-form-item label="制度名称" prop="ruleName">
					<el-input v-model.trim="editForm.ruleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="制度标号" prop="ruleNo">
					<el-input v-model.trim="editForm.ruleNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="适用范围" prop="orgName">
					<el-input v-model.trim="editForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字" prop="keyWord">
					<el-input v-model.trim="editForm.keyWord" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadfile" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
						<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
						<div slot="tip" class="el-upload__tip">上传文件不能超过50M</div>
					</el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editSubmit" :loading="editLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--查看界面-->
		<el-dialog title="查看" :visible.sync="showDialogVisible">
			<el-form :model="showForm" label-width="120px">
				<el-form-item label="制度名称">{{ showForm.ruleName }}</el-form-item>
				<el-form-item label="制度标号">{{ showForm.ruleNo }}</el-form-item>
				<el-form-item label="适用范围">{{ showForm.orgName }}</el-form-item>
				<el-form-item label="关键字">{{ showForm.keyWord }}</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadfile" :on-preview="handlePreview" :file-list="fileList"></el-upload>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="showDialogVisible = false">取 消</el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import axios from 'axios'
	import FileSaver from 'file-saver'

	export default {
		data() {
			return {
				ruleForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					ruleName: [
						{ required: true, message: '请输入制度名称', trigger: 'blur' }
					],
					ruleNo: [
						{ required: true, message: '请输入制度标号', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择适用范围', trigger: 'blur' }
					],
					keyWord: [
						{ required: true, message: '请输入关键字', trigger: 'blur' }
					],
				}, 
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					ruleName: [
						{ required: true, message: '请输入制度名称', trigger: 'blur' }
					],
					ruleNo: [
						{ required: true, message: '请输入制度标号', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择适用范围', trigger: 'blur' }
					],
					keyWord: [
						{ required: true, message: '请输入关键字', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				fileList: [],
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
	      	handleRemove(file, fileList) {
	            this.fileList = fileList;
	      	},
	      	handlePreview(file) {
	      		let params = {
      				fileName: file.name,
	      			fileUrl: file.url
      			};
	      		axios.post('/fastdfs/downloadFile', params).then(function(response) {
	      			let blob = new Blob([response.data], {type: "application/octet-stream"});
	      			FileSaver.saveAs(blob, file.name);
        		}).catch(function (error) {
        		});
	      	},
	      	handleSuccess(res, file, fileList) {
	            this.fileList = fileList;
	      	},
	      	beforeRemove(file, fileList) {
	        	return this.$confirm(`确定移除 ${ file.name }？`);
	      	},
	      	beforeUpload(file) {
	      		var isLt50M = file.size > 50*1024*1024 ? true:false;
	      	    if (isLt50M) {
	      	    	this.$message.error('上传文件大小不能超过 50MB!');
	      	    };
	      	},
			//搜索
	        search: function(){
	            this.loadData();
	        },
	        loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					ruleName: this.ruleForm.ruleName,
					ruleType: 2
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/rule/getListByPage', params).then(function(response) {
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
			//获取规范附件列表
			loadRuleAttachmentList: function (ruleId) {
				let params = {
					ruleId : ruleId
				};
        		let _this = this;
        		//获取规范附件列表
				axios.post('/rule/attachment/getList', params, params).then(function (response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.fileList = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
                }).catch(function (error) {
                    console.log(error);
                });
			},
			//显示新增界面
			handleAdd: function () {
				this.addDialogVisible = true;
				this.$refs.uploadfile.clearFiles();
				this.$refs.addForm.resetFields();
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editDialogVisible = true;
				this.$refs.uploadfile.clearFiles();
				this.editForm = Object.assign({}, row);
				this.loadRuleAttachmentList(this.editForm.ruleId);
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
				this.$refs.uploadfile.clearFiles();
        		this.showForm = Object.assign({}, row);
        		this.loadRuleAttachmentList(this.showForm.ruleId);
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('ruleType', 2);
							formData.set('ruleName', this.addForm.ruleName);
							formData.set('ruleNo', this.addForm.ruleNo);
							formData.set('orgName', this.addForm.orgName);
							formData.set('keyWord', this.addForm.keyWord);
							this.fileList.forEach(function(item, index){
								if(item != null && item.raw != null) {
									formData.append('fileList', item.raw);
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/rule/add', formData, headers).then(function(response) {
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
							let formData = new FormData();
							formData.set('ruleType', 2);
							formData.set('ruleId', this.editForm.ruleId);
							formData.set('ruleName', this.editForm.ruleName);
							formData.set('ruleNo', this.editForm.ruleNo);
							formData.set('orgName', this.editForm.orgName);
							formData.set('keyWord', this.editForm.keyWord);
							this.fileList.forEach(function(item, index){
								if(item != null) {
									if(item.raw != null && item.ruleAttachmentId == null) {
										formData.append('fileList', item.raw);
									} else {
										formData.append('ruleAttachmentIds', item.ruleAttachmentId);
									}
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/rule/update', formData, headers).then(function(response) {
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
							this.$refs.uploadfile.clearFiles();
						});
					}
				});
			},
			//删除
			handleDelete: function (index, row) {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listLoading = true;
					let params = {
						ruleId: row.ruleId
					};
					let _this = this;
					axios.post('/rule/delete', params).then(function(response) {
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