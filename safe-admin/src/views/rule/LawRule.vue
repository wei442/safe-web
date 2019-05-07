<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="ruleForm" size="small" style="float: left;">
				<el-form-item label="名称">
					<el-input v-model.trim="ruleForm.ruleName" placeholder="请输入名称" clearable></el-input>
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
			<el-table-column prop="ruleName" label="名称" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ruleCategory" label="类别" :formatter="formatRuleCategory" header-align="center" align="center"></el-table-column>
			<el-table-column prop="ruleNo" label="法规标号" header-align="center" align="center"></el-table-column>
			<el-table-column prop="keyWord" label="关键字" header-align="center" align="center"></el-table-column>
			<el-table-column prop="orgName" label="所属公司或大区" header-align="center" align="center"></el-table-column>
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
				<el-form-item label="名称" prop="ruleName">
					<el-input v-model.trim="addForm.ruleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类别" prop="ruleCategory">
					<el-select v-model.trim="addForm.ruleCategory" placeholder="请选择">
		    			<el-option v-for="item in ruleCategoryOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="法规标号" prop="ruleNo">
					<el-input v-model.trim="addForm.ruleNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属公司或大区" prop="orgName">
					<el-input v-model.trim="addForm.orgName" @focus="handleOrgAddOrgName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字" prop="keyWord">
					<el-input v-model.trim="addForm.keyWord" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadAddfile" :before-upload="beforeUpload" :before-remove="beforeRemove" :on-remove="handleAddRemove" :on-success="handleAddSuccess" :file-list="fileAddList">
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
		
		<!--新增界面-选择所属公司或大区-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="addOrgDialogVisible" class="tree-transfer__dialog">
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
		 				</div>
	 				</div>
	 				<div class="tree-transfer__middle">
	                </div>
	                <div class="tree-transfer__right">
	                	<h3 class="tree-transfer__title">
	                  		<span>已选</span>
	                  		<span class="tree-transfer__right-close" @click="clearTargetNodes" v-if="isTargetNodesEmpty">清空</span>
		              	</h3>
		              	<div class="tree-transfer__list" v-if="targetNodes.orgName">
			          		<ul class="tree-transfer__list-ul">
			           			<li class="tree-transfer__list-li">
				           			<label>{{targetNodes[defaultProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" @click="handleAddOrgDeleteItem(targetNodes.orgId)">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="addOrgSubmit">确定</el-button>
		    		<el-button size="medium" @click="addOrgDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editDialogVisible">
			<el-form ref="editForm" :model="editForm" :rules="editFormRules" label-width="120px">
				<el-form-item label="名称" prop="ruleName">
					<el-input v-model.trim="editForm.ruleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="类别" prop="ruleCategory">
					<el-select v-model.trim="editForm.ruleCategory" placeholder="请选择">
		    			<el-option v-for="item in ruleCategoryOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
				</el-form-item>
				<el-form-item label="法规标号" prop="ruleNo">
					<el-input v-model.trim="editForm.ruleNo" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="所属公司或大区" prop="orgName">
					<el-input v-model.trim="editForm.orgName" @focus="handleOrgEditOrgName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="关键字" prop="keyWord">
					<el-input v-model.trim="editForm.keyWord" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="相关文件">
					<el-upload class="upload-demo" ref="uploadEditfile" :before-upload="beforeUpload" :on-preview="handlePreview" :before-remove="beforeRemove" :on-remove="handleEditRemove" :on-success="handleEditSuccess" :file-list="fileEditList">
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
		
		<!--编辑部门-选择所属公司或大区-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="editOrgDialogVisible" class="tree-transfer__dialog">
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
			           			<li class="tree-transfer__list-li" v-if="targetNodes.orgName">
				           			<label>{{targetNodes[defaultProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" @click="handleEditOrgDeleteItem(targetNodes.orgId)">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="editOrgSubmit">确定</el-button>
		    		<el-button size="medium" @click="editOrgDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>
		
		<!--查看界面-->
		<el-dialog title="查看" :visible.sync="showDialogVisible">
			<el-form :model="showForm" label-width="120px">
				<el-form-item label="名称">{{ showForm.ruleName }}</el-form-item>
				<el-form-item label="类别">{{ showForm.ruleCategory == 1 ? '法律' : showForm.ruleCategory == 2 ? '法规' : showForm.ruleCategory == 3 ? '部门规章': showForm.ruleCategory == 4 ? '地方性法规': showForm.ruleCategory == 5 ? '标准': '' }}</el-form-item>
				<el-form-item label="法规标号">{{ showForm.ruleNo }}</el-form-item>
				<el-form-item label="所属公司或大区">{{ showForm.orgName }}</el-form-item>
				<el-form-item label="关键字">{{ showForm.keyWord }}</el-form-item>
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
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					ruleCategory: [
						{ required: true, message: '请选择类别', trigger: 'change' }
					],
					ruleNo: [
						{ required: true, message: '请输入法规标号', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择所属公司或大区', trigger: 'change' }
					],
					keyWord: [
						{ required: true, message: '请输入关键字', trigger: 'blur' }
					],
				}, 
				fileAddList: [],
				editDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editForm: {
				},
				editLoading: false,
				editFormRules: {
					ruleName: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					],
					ruleCategory: [
						{ required: true, message: '请选择类别', trigger: 'change' }
					],
					ruleNo: [
						{ required: true, message: '请输入法规标号', trigger: 'blur' }
					],
					orgName: [
						{ required: true, message: '请选择所属公司或大区', trigger: 'change' }
					],
					keyWord: [
						{ required: true, message: '请输入关键字', trigger: 'blur' }
					],
				}, 
				fileEditList: [],
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				fileShowList: [],
				ruleCategoryOptions: [
					{
						value: 1,
						label: '法律'
					},
					{
						value: 2,
						label: '法规'
					},
					{
						value: 3,
						label: '部门规章'
					},
					{
						value: 4,
						label: '地方性法规'
					},
					{
						value: 5,
						label: '标准'
					},
				],
				//新增界面-选择部门
				treeTransferData: [],
				defaultProps: {
					label: 'orgName',
					children: 'orgList'
				},
		        addOrgDialogVisible: false,
		        targetNodes: {},
		        editOrgDialogVisible: false,
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
	      	//上传文件之前
	      	beforeUpload(file) {
	      		const isLt50M = file.size < 50*1024*1024;
	      	    if (!isLt50M) {
	      	    	this.$message.error('上传文件大小不能超过 50MB!');
	      	    };
	      	    return isLt50M;
	      	},
	      	//类别显示转换
	      	formatRuleCategory: function (row, column) {
				return row.ruleCategory == 1 ? '法律' : row.ruleCategory == 2 ? '法规' : row.ruleCategory == 3 ? '部门规章': row.ruleCategory == 4 ? '地方性法规': row.ruleCategory == 5 ? '标准': '';
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
					ruleType: 1
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/rule/getListByPage', params).then(function(response) {
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
			//获取规范附件列表
			loadRuleAttachmentList: function (ruleId, type) {
				let params = {
					ruleId : ruleId
				};
        		let _this = this;
				axios.post('/rule/attachment/getList', params, params).then(function (response) {
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
				this.loadRuleAttachmentList(this.editForm.ruleId, 'edit');
				this.$refs.uploadEditfile.clearFiles();
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
        		this.loadRuleAttachmentList(this.showForm.ruleId, 'show');
        		this.$refs.uploadShowfile.clearFiles();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let formData = new FormData();
							formData.set('ruleType', 1);
							formData.set('ruleName', this.addForm.ruleName);
							formData.set('ruleCategory', this.addForm.ruleCategory);
							formData.set('ruleNo', this.addForm.ruleNo);
							formData.set('orgName', this.addForm.orgName);
							formData.set('keyWord', this.addForm.keyWord);
							this.fileAddList.forEach(function(item, index){
								formData.append('fileList', item.raw);
							});
							let headers = {
                                headers: {'Content-Type': 'multipart/form-data'}
                            }
							let _this = this;
							axios.post('/rule/add', formData, headers).then(function (response) {
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
							formData.set('ruleId', this.editForm.ruleId);
							formData.set('ruleType', 1);
							formData.set('ruleName', this.editForm.ruleName);
							formData.set('ruleCategory', this.editForm.ruleCategory);
							formData.set('ruleNo', this.editForm.ruleNo);
							formData.set('orgName', this.editForm.orgName);
							formData.set('keyWord', this.editForm.keyWord);
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
							axios.post('/rule/update', formData, headers).then(function(response) {
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
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData();
						} else if(retCode == '00000002') {
							_this.$message.error('删除失败');
						} else {
							_this.$message.error(retMsg);
						}
		              }).catch(function (error) {
		                	console.log(error);
		              });
		        }).catch(() => {
		        });
			},
			
			//新增界面-选择所属公司或大区
			handleOrgAddOrgName() {
				this.addOrgDialogVisible = true;
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
				let node = {orgId : this.addForm.orgId, orgName : this.addForm.orgName};
				this.targetNodes = node;
		   	},
		   	handleAddOrgNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleAddOrgDeleteItem(id) {
				this.targetNodes = {};
			},
			addOrgSubmit() {
				this.$emit('close');
				this.addOrgDialogVisible = false;
				this.addForm.orgId = this.targetNodes.orgId;
				this.addForm.orgName = this.targetNodes.orgName;
			},
			
			//编辑界面-选择所属公司或大区
			handleOrgEditOrgName() {
				this.editOrgDialogVisible = true;
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
				let node = {orgId : this.editForm.orgId, orgName : this.editForm.orgName};
				this.targetNodes = node;
		   	},
		   	handleEditOrgNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleEditOrgDeleteItem(id) {
				this.targetNodes = {};
			},
			editOrgSubmit() {
				this.$emit('close');
				this.editOrgDialogVisible = false;
				this.editForm.orgId = this.targetNodes.orgId;
				this.editForm.orgName = this.targetNodes.orgName;
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