<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="dangerForm" size="small" style="float: left;">
				<el-form-item label="隐患地点">
					<el-input v-model.trim="dangerForm.dangerSite" placeholder="请输入隐患地点" clearable></el-input>
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
			<el-table-column prop="dangerSite" label="隐患地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dangerLevel" label="隐患级别" :formatter="formatDangerLevel" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dangerCategory" label="隐患大类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dangerSubCategory" label="隐患小类" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dangerTime" label="隐患时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="dangerDesc" label="隐患描述" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="隐患地点" prop="dangerSite">
					<el-input v-model.trim="addForm.dangerSite" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患级别" prop="dangerLevel">
					<el-input v-model.trim="addForm.dangerLevel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患大类" prop="dangerMainCategory">
					<el-input v-model.trim="addForm.dangerMainCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患小类" prop="dangerSubCategory">
					<el-input v-model.trim="addForm.dangerSubCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患时间" prop="dangerTime">
					<el-date-picker type="datetime" v-model.trim="addForm.dangerTime" auto-complete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="隐患描述" prop="dangerDesc">
					<el-input v-model.trim="addForm.dangerDesc" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadAddfile" :before-upload="beforeUpload" :before-remove="beforeRemove" :on-remove="handleAddRemove" :on-success="handleAddSuccess" :file-list="fileAddList">
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
				<el-form-item label="隐患地点" prop="dangerSite">
					<el-input v-model.trim="editForm.dangerSite" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患级别" prop="dangerLevel">
					<el-input v-model.trim="editForm.dangerLevel" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患大类" prop="dangerMainCategory">
					<el-input v-model.trim="editForm.dangerMainCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患小类" prop="dangerSubCategory">
					<el-input v-model.trim="editForm.dangerSubCategory" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="隐患时间" prop="dangerTime">
					<el-date-picker type="editForm" v-model.trim="addForm.dangerTime" auto-complete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="隐患描述" prop="dangerDesc">
					<el-input v-model.trim="editForm.dangerDesc" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadEditfile" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleEditRemove" :on-success="handleEditSuccess" :file-list="fileEditList">
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
				<el-form-item label="资质名称">{{ showForm.dangerName }}</el-form-item>
				<el-form-item label="所属机构">{{ showForm.orgName }}</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadShowfile" :on-preview="handlePreview" :file-list="fileShowList"></el-upload>
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
				dangerForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					dangerSite: [
						{ required: true, message: '请输入隐患地点', trigger: 'blur' }
					],
					dangerLevel: [
						{ required: true, message: '请选择隐患级别', trigger: 'blur' }
					],
					dangerMainCategory: [
						{ required: true, message: '请选择隐患大类', trigger: 'blur' }
					],
					dangerSubCategory: [
						{ required: true, message: '请选择隐患小类', trigger: 'blur' }
					],
					dangerTime: [
						{ required: true, message: '请选择所隐患时间', trigger: 'blur' }
					],
					dangerDesc: [
						{ required: true, message: '请输入隐患描述', trigger: 'blur' }
					],
				}, 
				fileAddList: [],
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					dangerSite: [
						{ required: true, message: '请输入隐患地点', trigger: 'blur' }
					],
					dangerLevel: [
						{ required: true, message: '请选择隐患级别', trigger: 'blur' }
					],
					dangerMainCategory: [
						{ required: true, message: '请选择隐患大类', trigger: 'blur' }
					],
					dangerSubCategory: [
						{ required: true, message: '请选择隐患小类', trigger: 'blur' }
					],
					dangerTime: [
						{ required: true, message: '请选择所隐患时间', trigger: 'blur' }
					],
					dangerDesc: [
						{ required: true, message: '请输入隐患描述', trigger: 'blur' }
					],
				}, 
				fileEditList: [],
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				fileShowList: [],
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
	      	//新增-文件列表移除
	      	handleAddRemove(file, fileList) {
	      		this.fileAddList = fileList;
	      	},
	      	//新增-文件上传成功
	      	handleAddSuccess(res, file, fileList) {
	      		this.fileAddList = fileList;
	      	},
	      	//编辑-文件列表移除
	      	handleEditRemove(file, fileList) {
	      		this.fileEditList = fileList;
	      	},
	      	//编辑-文件上传成功
	      	handleEditSuccess(res, file, fileList) {
	      		this.fileEditList = fileList;
	      	},
	      	//点击已上传的文件
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
	      	//删除文件之前
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
	      	    	this.$message.error('上传图片大小不能超过 10MB!');
	      	    };
	      	},
	      	//隐患级别显示转换
	      	formatDangerLevel: function (row, column) {
				return row.dangerLevel == 1 ? '一般隐患' : row.enterpriseStatus == 2 ? '重大隐患': '';
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					dangerSite: this.dangerForm.dangerSite,
					dangerType: 1
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/danger/getListByPage', params).then(function(response) {
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
			//获取隐患附件列表
			loadDangerAttachmentList: function (dangerId) {
				let params = {
					dangerId : dangerId
				};
        		let _this = this;
				axios.post('/danger/attachment/getList', params, params).then(function (response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						if(type == 'edit') {
							_this.fileEditList = response.data.result.dataList;
			            } else if(type == 'show') {
			            	_this.fileShowList = response.data.result.dataList;
			            }
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
				this.$refs.addForm.resetFields();
				this.$refs.uploadAddfile.clearFiles();
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editDialogVisible = true;
				this.editForm = Object.assign({}, row);
				this.loadDangerAttachmentList(this.editForm.dangerId, 'edit');
				this.$refs.uploadEditfile.clearFiles();
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
        		this.loadDangerAttachmentList(this.showForm.dangerId, 'show');
        		this.$refs.uploadShowfile.clearFiles();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('dangerType', 1);
							formData.set('dangerSite', this.addForm.dangerSite);
							formData.set('dangerLevel', this.addForm.dangerLevel);
							formData.set('dangerCategory', this.addForm.dangerCategory);
							formData.set('dangerSubCategory', this.addForm.dangerSubCategory);
							formData.set('dangerTime', this.addForm.dangerTime);
							formData.set('dangerDesc', this.addForm.dangerDesc);
							this.fileAddList.forEach(function(item, index){
								formData.append('fileList', item.raw);
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/danger/add', formData, headers).then(function(response) {
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
							formData.set('dangerId', this.editForm.dangerId);
							formData.set('dangerType', 1);
							formData.set('dangerSite', this.editForm.dangerSite);
							formData.set('dangerLevel', this.editForm.dangerLevel);
							formData.set('dangerCategory', this.editForm.dangerCategory);
							formData.set('dangerSubCategory', this.editForm.dangerSubCategory);
							formData.set('dangerTime', this.editForm.dangerTime);
							formData.set('dangerDesc', this.editForm.dangerDesc);
							this.fileEditList.forEach(function(item, index){
								if(item.raw != null) {
									formData.append('fileList', item.raw);
								} else if(item.ruleAttachmentId != null) {
									formData.append('ruleAttachmentIds', item.ruleAttachmentId);
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/danger/update', formData, headers).then(function(response) {
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
						dangerId: row.dangerId
					};
					let _this = this;
					axios.post('/danger/delete', params).then(function(response) {
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

<style lang="less">
.tree-transfer {
  h3, ul, li {
    margin: 0;
    padding: 0;
  }

  .tree-transfer__content {
    position: relative;
    overflow: hidden;
    height: 400px;

    .tree-transfer__title {
      border-bottom: 1px solid #ebeef5;
      padding: 0 15px;
      height: 40px;
      line-height: 40px;
      color: #333;
      font-size: 16px;
      background-color: #f5f7fa;
    }

    .tree-transfer__list {
      padding: 10px;
      height: calc(100% - 41px);
      box-sizing: border-box;
      overflow: auto;
    }

    .tree-transfer__left {
      position: absolute;
      top: 0;
      left: 0;
    }

    .tree-transfer__middle {
      position: absolute;
      top: 50%;
      left: 40%;
      width: 20%;
      transform: translateY(-50%);
      text-align: center;
    }

    .tree-transfer__right {
      position: absolute;
      top: 0;
      right: 0;

      .tree-transfer__right-close {
        float: right;
        color: #67c23a;
        font-size: 14px;
        cursor: pointer;
      }

      .tree-transfer__list-ul {
        padding-bottom: 20px;
      }

      .tree-transfer__list-li {
        position: relative;
        padding: 4px 24px 4px 10px;
        border-radius: 3px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .tree-transfer__list-li:hover {
        background-color: #f5f7fa;
      }

      .tree-transfer__list-li:hover .tree-transfer__list-delete {
        display: block;
      }

      .tree-transfer__list-delete {
        display: none;
        position: absolute;
        top: 50%;
        right: 10px;
        margin-top: -10px;
        color: #f56c6c;
        cursor: pointer;
        text-align: center;
      }
    }

    .tree-transfer__left,
    .tree-transfer__right {
      border: 1px solid #ebeef5;
      width: 40%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 5px;
      vertical-align: middle;
    }
  }
  .el-dialog__footer {
    text-align: center;
  }

}
</style>