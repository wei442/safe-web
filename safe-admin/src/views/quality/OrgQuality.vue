<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="orgQualityForm" size="small" style="float: left;">
				<el-form-item label="资质名称">
					<el-input v-model.trim="orgQualityForm.qualityName" placeholder="请输入资质名称" clearable></el-input>
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
			<el-table-column prop="qualityName" label="资质名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgName" label="所属机构" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="资质名称" prop="qualityName">
					<el-input v-model.trim="addForm.qualityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属机构" prop="orgName">
					<el-input v-model.trim="addForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadfile" :before-upload="beforeUpload" :before-remove="beforeRemove" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
						<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
						<div slot="tip" class="el-upload__tip">只能上传图片，且不超过10M</div>
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
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
				<el-form-item label="资质名称" prop="qualityName">
					<el-input v-model.trim="editForm.qualityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属机构" prop="orgName">
					<el-input v-model.trim="editForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadfile" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleRemove" :on-success="handleSuccess" :file-list="fileList">
						<el-button slot="trigger" size="small" type="primary">上传文件</el-button>
						<div slot="tip" class="el-upload__tip">只能上传图片，且不超过10M</div>
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
			<el-form :model="showForm" label-width="80px">
				<el-form-item label="资质名称">{{ showForm.qualityName }}</el-form-item>
				<el-form-item label="所属机构">{{ showForm.orgName }}</el-form-item>
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
				orgQualityForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					qualityName: [
						{ required: true, message: '请输入资质名称', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择所属机构', trigger: 'blur' }
					],
				}, 
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					qualityName: [
						{ required: true, message: '请输入资质名称', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择所属机构', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				fileList: []
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
	      		if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
	      	        this.$message({
	      	        	message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片',
	      	        	type: 'warning'
			        });
	      		}
	      		var isLt10M = file.size > 10*1024*1024 ? true:false;
	      	    if (isLt10M) {
	      	    	this.$message.error('上传文件大小不能超过 10MB!');
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
					qualityName: this.orgQualityForm.qualityName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/org/quality/getListByPage', params).then(function(response) {
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
			//获取机构资质附件列表
			loadOrgQualityAttachmentList: function (orgQualityId) {
				let params = {
					orgQualityId : orgQualityId
				};
        		let _this = this;
				axios.post('/org/quality/attachment/getList', params, params).then(function (response) {
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
				this.loadOrgQualityAttachmentList(this.editForm.orgQualityId);
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
				this.$refs.uploadfile.clearFiles();
        		this.showForm = Object.assign({}, row);
        		this.loadOrgQualityAttachmentList(this.showForm.orgQualityId);
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('qualityName', this.addForm.qualityName);
							formData.set('orgName', this.addForm.orgName);
							this.fileList.forEach(function(item, index){
								if(item != null && item.raw != null) {
									formData.append('fileList', item.raw);
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/org/quality/add', formData, headers).then(function(response) {
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
							formData.set('orgQualityId', this.editForm.orgQualityId);
							formData.set('qualityName', this.editForm.qualityName);
							formData.set('orgName', this.editForm.orgName);
							this.fileList.forEach(function(item, index){
								if(item != null) {
									if(item.raw != null && item.orgQualityIdId == null) {
										formData.append('fileList', item.raw);
									} else {
										formData.append('orgQualityIdIds', item.orgQualityIdId);
									}
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/org/quality/update', formData, headers).then(function(response) {
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
						orgQualityId: row.orgQualityId
					};
					let _this = this;
					axios.post('/org/quality/delete', params).then(function(response) {
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