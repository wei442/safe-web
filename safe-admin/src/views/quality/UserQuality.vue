<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="userQualityForm" size="small" style="float: left;">
				<el-form-item label="资质名称">
					<el-input v-model.trim="userQualityForm.qualityName" placeholder="请输入资质名称" clearable></el-input>
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
			<el-table-column prop="userName" label="所属人" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="所属人" prop="userName">
					<el-input v-model.trim="addForm.userName" @focus="handleUserAddUserName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadAddfile" :before-upload="beforeUpload" :before-remove="beforeRemove" :on-remove="handleAddRemove" :on-success="handleAddSuccess" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :file-list="fileAddList">
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
		
		<!--新增界面-选择所属人-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="addUserDialogVisible" class="tree-transfer__dialog">
				<section class="tree-transfer__content">
		 			<div class="tree-transfer__left">
		 				<h3 class="tree-transfer__title">选择</h3>
		 				<div class="tree-transfer__list">
		 					<el-tree
			                    :data="treeTransferData"
			                    :node-key="orgId"
			                    :props="defaultProps"
			                    :highlight-current="true"
			                    :expand-on-click-node="false"
		 						@node-click="handleAddOrgNodeClick">
			 				</el-tree>
			 				
			 				<br>
			 				&nbsp
			 				<el-tree v-if="userData.length>0"
			                    :data="userData"
			                    :node-key="userId"
			                    :props="defaultUserProps"
		 						@node-click="handleAddUserNodeClick">
			 				</el-tree>
		 				</div>
	 				</div>
	 				<div class="tree-transfer__middle">
	                </div>
	                <div class="tree-transfer__right">
	                	<h3 class="tree-transfer__title">
	                  		<span>已选</span>
	                  		<span class="tree-transfer__right-close" @click="clearTargetNodes" v-if="isTargetNodesEmpty">清空</span>
		              	</h3>
		              	<div class="tree-transfer__list" v-if="targetNodes.userName">
			          		<ul class="tree-transfer__list-ul">
			           			<li class="tree-transfer__list-li">
				           			<label>{{targetNodes[defaultUserProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" @click="handleAddUserDeleteItem(targetNodes.userId)">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="addUserSubmit">确定</el-button>
		    		<el-button size="medium" @click="addUserDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editDialogVisible">
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="80px">
				<el-form-item label="资质名称" prop="qualityName">
					<el-input v-model.trim="editForm.qualityName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属人" prop="userName">
					<el-input v-model.trim="editForm.userName" @focus="handleUserEditUserName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadEditfile" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleEditRemove" accept=".png,.jpg,.jpeg,.gif,.PNG,.JPG,.JPEG,.GIF" :on-success="handleEditSuccess" :file-list="fileEditList">
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
		
		<!--编辑部门-选择所属人-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="editUserDialogVisible" class="tree-transfer__dialog">
				<section class="tree-transfer__content">
		 			<div class="tree-transfer__left">
		 				<h3 class="tree-transfer__title">选择</h3>
		 				<div class="tree-transfer__list">
		 					<el-tree
			                    :data="treeTransferData"
			                    :node-key="orgId"
			                    :props="defaultProps"
			                    :highlight-current="true"
			                    :expand-on-click-node="false"
		 						@node-click="handleEditOrgNodeClick">
			 				</el-tree>
			 				
			 				<br>
			 				&nbsp
			 				<el-tree v-if="userData.length>0"
			                    :data="userData"
			                    :node-key="userId"
			                    :props="defaultUserProps"
		                    	:highlight-current="true"
		 						@node-click="handleEditUserNodeClick">
			 				</el-tree>
		 				</div>
	 				</div>
	 				<div class="tree-transfer__middle">
	                </div>
	                <div class="tree-transfer__right">
	                	<h3 class="tree-transfer__title">
	                  		<span>已选</span>
	                  		<span class="tree-transfer__right-close" @click="clearTargetNodes" v-if="isTargetNodesEmpty">清空</span>
		              	</h3>
		              	<div class="tree-transfer__list">
			          		<ul class="tree-transfer__list-ul">
			           			<li class="tree-transfer__list-li" v-if="targetNodes.userName">
				           			<label>{{targetNodes[defaultUserProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" @click="handleEditUserDeleteItem(targetNodes.userId)">删除</span>
			           			</li>
		           			</ul>
	           			</div>
	       			</div>
	   			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="editUserSubmit">确定</el-button>
		    		<el-button size="medium" @click="editUserDialogVisible = false">取消</el-button>
	    		</span>
			</el-dialog>
		</div>
		
		<!--查看界面-->
		<el-dialog title="查看" :visible.sync="showDialogVisible">
			<el-form :model="showForm" label-width="80px">
				<el-form-item label="资质名称">{{ showForm.qualityName }}</el-form-item>
				<el-form-item label="所属人">{{ showForm.userName }}</el-form-item>
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
		props: {
		    // 宽度
		    width: {
		      type: String,
		      default: '500px',
		    },
		    // 高度
		    height: {
		      type: String,
		      default: '1000px',
		    },
		},
		data() {
			return {
				userQualityForm: {},
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
					userName: [
						{ required: true, message: '请选择所属人', trigger: 'change' }
					],
				}, 
				fileAddList: [],
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					qualityName: [
						{ required: true, message: '请输入资质名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请选择所属人', trigger: 'change' }
					],
				}, 
				fileEditList: [],
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				fileShowList: [],
				//新增界面-选择部门
				treeTransferData: [],
				defaultProps: {
					label: 'orgName',
					children: 'orgList'
				},
		        addUserDialogVisible: false,
		        targetNodes: {},
		        editUserDialogVisible: false,
				userData: [],
				defaultUserProps: {
					label: 'userName',
				},
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    	this.search();
	    },
		methods: {
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				let count = row.count;
				//选择合并哪一列
				if (columnIndex === 0 || columnIndex === 1 || columnIndex === 3) {
					if (rowIndex % row.count === 0) {//合并多少行
						return {
							rowspan: row.count,  //要合并的行数
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}
			},
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
	      		const isPic = file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg';
	      		if (!isPic) {
	      			this.$message.error('上传图片只能是 PNG,JPG,JPEG,GIF 格式!');
	      		}
	      		const isLt10M = file.size < 10*1024*1024;
	      		if (!isLt10M) {
	      			this.$message.error('上传图片大小不能超过 10MB!');
	      		};
	      		return isPic && isLt10M;
	      	},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					qualityName: this.userQualityForm.qualityName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/user/quality/getListByPage', params).then(function(response) {
						_this.listLoading = false;
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
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
			//获取用户资质附件列表
			loadUserQualityAttachmentList: function (userQualityId, type) {
				let params = {
					userQualityId : userQualityId
				};
        		let _this = this;
				axios.post('/user/quality/attachment/getList', params, params).then(function (response) {
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
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
				this.loadUserQualityAttachmentList(this.editForm.userQualityId, 'edit');
				this.$refs.uploadEditfile.clearFiles();
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
        		this.loadUserQualityAttachmentList(this.showForm.userQualityId, 'show');
        		this.$refs.uploadShowfile.clearFiles();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('qualityName', this.addForm.qualityName);
							formData.set('userId', this.addForm.userId);
							formData.set('userName', this.addForm.userName);
							this.fileAddList.forEach(function(item, index){
								formData.append('fileList', item.raw);
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/user/quality/add', formData, headers).then(function(response) {
								_this.addLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
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
							formData.set('userQualityId', this.editForm.userQualityId);
							formData.set('qualityName', this.editForm.qualityName);
							formData.set('userId', this.editForm.userId);
							formData.set('userName', this.editForm.userName);
							this.fileEditList.forEach(function(item, index){
								if(item.raw != null) {
									formData.append('fileList', item.raw);
								} else if(item.userQualityAttachmentId != null) {
									formData.append('userQualityAttachmentIds', item.userQualityAttachmentId);
								}
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/user/quality/update', formData, headers).then(function(response) {
								_this.editLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
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
						userQualityId: row.userQualityId
					};
					let _this = this;
					axios.post('/user/quality/delete', params).then(function(response) {
						_this.listLoading = false;
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
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
			
			//新增界面-选择所属人
			handleUserAddUserName() {
				this.addUserDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeTransferData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
				this.targetNodes = {};
		   	},
		   	handleAddOrgNodeClick(node) {
		   		let params = {
					orgId:node.orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/user/org/getList', params).then(function(response) {
					_this.listPersonLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.userData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
		   	},
		   	handleAddUserDeleteItem(id) {
				this.targetNodes = {};
			},
			addUserSubmit() {
				this.$emit('close');
				this.addUserDialogVisible = false;
				this.addForm.userId = this.targetNodes.userId;
				this.addForm.userName = this.targetNodes.userName;
			},
			
			//编辑界面-选择所属人
			handleUserEditUserName() {
				this.editUserDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeTransferData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
				this.targetNodes = {};
		   	},
		   	handleEditOrgNodeClick(node) {
		   		let params = {
					orgId:node.orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/user/org/getList', params).then(function(response) {
					_this.listPersonLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.userOrgData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
		   	},
		   	handleEditUserDeleteItem(id) {
				this.targetNodes = {};
			},
			editUserSubmit() {
				this.$emit('close');
				this.editUserDialogVisible = false;
				this.editForm.userId = this.targetNodes.userId;
				this.editForm.userName = this.targetNodes.userName;
			},
			
			handleAddUserNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleEditUserNodeClick(node) {
		   		this.targetNodes = node;
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
	        display: block;
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