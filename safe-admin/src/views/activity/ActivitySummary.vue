<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="activityForm" size="small" style="float: left;">
				<el-form-item label="活动名称">
					<el-input v-model.trim="activityForm.activityName" placeholder="请输入活动名称" clearable></el-input>
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
			<el-table-column prop="activityName" label="活动主题" header-align="center" align="center"></el-table-column>
			<el-table-column prop="activityStartTime" label="活动开始时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="activityEndTime" label="活动结束时间" header-align="center" align="center"></el-table-column>
			<el-table-column prop="activitySite" label="开展地点" header-align="center" align="center"></el-table-column>
			<el-table-column prop="content" label="开展流程" header-align="center" align="center"></el-table-column>
			<el-table-column prop="experience" label="经验" header-align="center" align="center"></el-table-column>
			<el-table-column prop="lesson" label="教训" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="活动主题" prop="activityName">
					<el-input v-model.trim="addForm.activityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动开始时间" prop="activityStartTime">
					<el-date-picker type="datetime" v-model.trim="addForm.activityStartTime" auto-complete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="活动结束时间" prop="activityEndTime">
					<el-date-picker type="datetime" v-model.trim="addForm.activityEndTime" auto-complete="off"></el-date-picker>
					
				</el-form-item>
				<el-form-item label="开展地点" prop="activitySite">
					<el-input v-model.trim="addForm.activitySite" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开展流程" prop="content">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="经验" prop="experience">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.experience" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="教训" prop="lesson">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="addForm.lesson" auto-complete="off"></el-input>
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
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px">
				<el-form-item label="活动主题" prop="activityName">
					<el-input v-model.trim="editForm.activityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="活动开始时间" prop="activityStartTime">
					<el-date-picker type="datetime" v-model.trim="addForm.activityStartTime" auto-complete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="活动结束时间" prop="activityEndTime">
					<el-date-picker type="datetime" v-model.trim="addForm.activityEndTime" auto-complete="off"></el-date-picker>
				</el-form-item>
				<el-form-item label="开展地点" prop="activitySite">
					<el-input v-model.trim="editForm.activitySite" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="开展流程" prop="content">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.content" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="经验" prop="experience">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.experience" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="教训" prop="lesson">
					<el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" v-model.trim="editForm.lesson" auto-complete="off"></el-input>
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
				<el-form-item label="活动编码">{{ showForm.activityCode }}</el-form-item>
				<el-form-item label="活动名称">{{ showForm.activityName }}</el-form-item>
				<el-form-item label="活动内容">{{ showForm.content }}</el-form-item>
				<el-form-item label="版本号">{{ showForm.version }}</el-form-item>
				<el-form-item label="活动类型">{{ showForm.type == 1 ? '单条' : showForm.type == 2 ? '多条' : '' }}</el-form-item>
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
				activityForm: {},
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addForm: {
				}, 
				addLoading: false,
				addFormRules: {
					activityName: [
						{ required: true, message: '请输入活动主题', trigger: 'blur' }
					],
					activityStartTime: [
						{ required: true, message: '请选择活动开始时间', trigger: 'blur' }
					],
					activityEndTime: [
						{ required: true, message: '请选择活动结束时间', trigger: 'blur' }
					],
					activitySite: [
						{ required: true, message: '请输入开展地点', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入开展流程', trigger: 'blur' }
					],
					experience: [
						{ required: true, message: '请输入经验', trigger: 'blur' }
					],
					lesson: [
						{ required: true, message: '请输入教训', trigger: 'blur' }
					],
				}, 
				fileAddList: [],
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					activityName: [
						{ required: true, message: '请输入活动主题', trigger: 'blur' }
					],
					activityStartTime: [
						{ required: true, message: '请选择活动开始时间', trigger: 'blur' }
					],
					activityEndTime: [
						{ required: true, message: '请选择活动结束时间', trigger: 'blur' }
					],
					activitySite: [
						{ required: true, message: '请输入开展地点', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入开展流程', trigger: 'blur' }
					],
					experience: [
						{ required: true, message: '请输入经验', trigger: 'blur' }
					],
					lesson: [
						{ required: true, message: '请输入教训', trigger: 'blur' }
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
	      	//活动内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.activityStatus == 1 ? '正常' : row.activityStatus == 2 ? '冻结' : row.activityStatus == 3 ? '注销': '';
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					activityName: this.activityForm.activityName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/activity/getListByPage', params).then(function(response) {
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
			//获取活动附件列表
			loadActivityAttachmentList: function (activityId) {
				let params = {
					activityId : activityId
				};
        		let _this = this;
				axios.post('/activity/attachment/getList', params, params).then(function (response) {
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
				this.loadActivityAttachmentList(this.editForm.activityId, 'edit');
				this.$refs.uploadEditfile.clearFiles();
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
        		this.loadActivityAttachmentList(this.showForm.activityId, 'show');
        		this.$refs.uploadShowfile.clearFiles();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('activityName', this.addForm.activityName);
							formData.set('activityStartTime', this.addForm.activityStartTime);
							formData.set('activityEndTime', this.addForm.activityEndTime);
							formData.set('activitySite', this.addForm.activitySite);
							formData.set('content', this.addForm.content);
							formData.set('experience', this.addForm.experience);
							formData.set('lesson', this.addForm.lesson);
							this.fileAddList.forEach(function(item, index){
								formData.append('fileList', item.raw);
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/activity/add', formData, headers).then(function(response) {
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
							formData.set('activityId', this.editForm.activityId);
							formData.set('activityName', this.addForm.activityName);
							formData.set('activityStartTime', this.addForm.activityStartTime);
							formData.set('activityEndTime', this.addForm.activityEndTime);
							formData.set('activitySite', this.addForm.activitySite);
							formData.set('content', this.addForm.content);
							formData.set('experience', this.addForm.experience);
							formData.set('lesson', this.addForm.lesson);
							this.fileEditList.forEach(function(item, index){
								if(item.raw != null) {
									formData.append('fileList', item.raw);
								} else if(item.activityAttachmentId != null) {
									formData.append('activityAttachmentIds', item.activityAttachmentId);
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/activity/update', formData, headers).then(function(response) {
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
						activityId: row.activityId
					};
					let _this = this;
					axios.post('/activity/delete', params).then(function(response) {
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