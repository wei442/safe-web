<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="userAdminForm" size="small" style="float: left;">
				<el-form-item>
				</el-form-item>
			</el-form>
		</el-col>

		<el-col style="padding-bottom: 0px;">
			<!--新增界面-->
			<el-form ref="addForm" :model="addForm" :rules="addFormRules" label-width="120px">
				<el-form-item label="人员" prop="userName">
					<el-input v-model.trim="addForm.userName" @focus="handleUserAddUserName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
				<br>
				<el-form-item label="分配权限">
					<el-table :data="tableData" fit highlight-current-row stripe style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column prop="name" label="基础权限" width="200"></el-table-column>
						<el-table-column type="selection" width="55"></el-table-column>
					</el-table>
				</el-form-item>
		   		<br>
				<el-form-item>
				    <el-button type="primary" @click="addSubmit">保 存</el-button>
				    <el-button type="primary" @click="handleReturn">返 回</el-button>
			  </el-form-item>
			</el-form>
		</el-col>
		
		
		<!--新增界面-选择人员-->
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

	</section>
</template>

<script>
	import axios from 'axios'

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
				tableData: [{
		            name: '企业管理',
		            address: '上海市普陀区金沙江路 1518 弄'
		          }, {
		            name: '系统管理',
		            address: '上海市普陀区金沙江路 1517 弄'
		          }, {
		            name: '资质管理',
		            address: '上海市普陀区金沙江路 1519 弄'
		          }, {
		            name: '系统性文件',
		            address: '上海市普陀区金沙江路 1516 弄'
		          }],
				userAdminForm: {},
				labelPosition: 'right',
				//新增界面数据
				addForm: {
					userIds: [],
					userName: [],
				}, 
				addLoading: false,
				addFormRules: {
					userName: [
						{ required: true, message: '请选择人员', trigger: 'blur' }
					],
				}, 
				
				//新增界面-选择部门
				treeTransferData: [],
				defaultProps: {
					label: 'orgName',
					children: 'orgList'
				},
		        addUserDialogVisible: false,
		        targetNodes: {},
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
	      	//企业内容显示转换
	      	formatEnterpriseStatus: function (row, column) {
				return row.userAdminStatus == 1 ? '正常' : row.userAdminStatus == 2 ? '冻结' : row.userAdminStatus == 3 ? '注销': '';
			},
			//搜索
	        search: function(){
	        },
			loadData: function() {
				let params = {
					pageNum: this.pageNum,
					pageSize: this.pageSize,
					userAdminName: this.userAdminForm.userAdminName
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/user/admin/getList', params).then(function(response) {
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
			//返回
			handleReturn: function () {
				this.$router.push('/slaveAdmin');
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let params = this.addForm;
							let _this = this;
							axios.post('/user/admin/add', params).then(function(response) {
								_this.addLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.$router.push('/slaveAdmin');
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
				this.userData = {};
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
			
			handleAddUserNodeClick(node) {
		        this.targetNodes = node;
		   	},
		   	isExistedTargetNode(node) {
				return this.targetNodes.some(item => item.userId === node.userId);
			},
			clearTargetNodes() {
				this.targetNodes = [];
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