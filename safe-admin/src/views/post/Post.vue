<template>
	<section>
		<el-container style="height: 560px; border: 0px solid #eee">
			<el-aside width="240px">
				<h5>岗位</h5>
				&#12288;<el-button type="primary" icon="el-icon-plus" size="mini" @click="handlePostAdd">新增岗位</el-button>
				<br>
				<br>
				<el-menu :data="treeData" :default-active="onRoutes" default-active="2" class="el-menu-vertical-demo" unique-opened router default-openeds="[1]">
					<el-submenu index="1">
						<template slot="title">
							<span slot="title">岗位</span>
						</template>
					 	<template v-for="(item,i) in treeData">
					 		<el-menu-item @click="handlePostPerson(item.postId, item.postName, item.isSpecial)">{{ item.postName }}</el-menu-item>
						</template>
					</el-submenu>
				</el-menu>
			</el-aside>

			<el-container>
				<el-main>
					<!--工具条-->
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true" :model="postForm" size="small" style="float: left;">
							<h3 class="title">{{ postName }}  <el-button type="primary" size="small" @click="handlePostEdit">编辑</el-button></h3>
							<el-form-item>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonAdd">新增人员</el-button>
							</el-form-item>
							<el-form-item>
								<el-button type="danger" icon="el-icon-delete" size="small" @click="handlePersonBatchDelete(tableChecked)"">批量删除</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					
					<!--列表-->
					<el-table :data="tableData" border fit highlight-current-row v-loading="listPersonLoading" stripe style="width:100%;" size="small" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55"></el-table-column>	
						<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
						<el-table-column prop="userName" label="姓名" header-align="center" align="center"></el-table-column>
						<el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
						<!--
						<el-table-column label="操作" width="240" header-align="center" align="center">
							<template slot-scope="scope">
						        <el-button type="primary" size="small" @click="handlePersonEdit(scope.$index, scope.row)">编辑</el-button>
						        <el-button type="danger" size="small" @click="handlePersonDelete(scope.$index, scope.row)">删除</el-button>
						        <el-button size="small" @click="handlePersonShow(scope.$index, scope.row)">查看</el-button>
					  		</template>
						</el-table-column>
						-->
					</el-table>
			    </el-main>
		    </el-container>
		    </el-container>
    
	    <!--新增岗位界面-->
		<el-dialog title="新增岗位" :visible.sync="addPostDialogVisible">
			<el-form ref="addPostForm" :model="addPostForm" :rules="addPostFormRules" label-width="120px">
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model.trim="addPostForm.postName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否特殊岗位" prop="isSpecial">
					<el-select v-model.trim="addPostForm.isSpecial" placeholder="请选择">
		    			<el-option v-for="item in isSpecialOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
	    		</el-form-item>
    		</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addPostDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPostSubmit" :loading="addPostLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!-- 编辑岗位界面-->
		<el-dialog title="编辑岗位" :visible.sync="editPostDialogVisible">
			<el-form ref="editPostForm" :model="editPostForm" :rules="editPostFormRules" label-width="120px">
				<el-form-item label="岗位名称" prop="postName">
					<el-input v-model.trim="editPostForm.postName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="是否特殊岗位" prop="isSpecial">
					<el-select v-model.trim="editPostForm.isSpecial" placeholder="请选择">
		    			<el-option v-for="item in isSpecialOptions" key="item.value" :label="item.label" :value="item.value"></el-option>
		    		</el-select>
	    		</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editPostDialogVisible = false">取 消</el-button>
				<el-button type="danger" @click="deletePostSubmit" :loading="editPostLoading">删 除</el-button>
				<el-button type="primary" @click="editPostSubmit" :loading="editPostLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--新增人员-->
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
		                    	show-checkbox
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
		              	<div class="tree-transfer__list" v-if="targetNodes">
			          		<ul class="tree-transfer__list-ul">
			           			<li class="tree-transfer__list-li"  v-for="(item, index) of targetNodes" :key="item.userId">
			           				<label>{{index + 1 + '.' + item[defaultUserProps.label]}}</label>
			           				<span class="tree-transfer__list-delete" @click="handleAddUserDeleteItem(item.userId)">删除</span>
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
		
		<!--新增人员界面-->
		<el-dialog title="新增人员" :visible.sync="addPersonDialogVisible">
			<el-form ref="addPersonForm" :model="addPersonForm" :rules="addPersonFormRules" label-width="80px">
				<el-transfer v-model="value1" :data="data" :titles="['选择', '已选']"></el-transfer>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addPersonDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addersonSubmit" :loading="addPersonLoading">保 存</el-button>
			</div>
		</el-dialog>
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
				treeData: [],
				postForm: {},
				postName: '',
				tableData: [],
				listLoading: false,
				labelPosition: 'right',
				addPostDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addPostForm: {
				}, 
				addPostLoading: false,
				addPostFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				
				addPersonDialogVisible: false,//新增界面是否显示
				//新增界面数据
				addPersonForm: {
				}, 
				addPersonLoading: false,
				addPersonFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				
				editPostDialogVisible: false,//编辑界面是否显示
				//编辑界面数据
				editPostForm: {
				},
				editPostLoading: false,
				editPostFormRules: {
					postName: [
						{ required: true, message: '请输入岗位名称', trigger: 'blur' }
					],
				}, 
				isSpecialOptions: [
					{
						value: 0,
						label: '否'
					},
					{
						value: 1,
						label: '是'
					},
				],
				
				//新增界面-选择部门
				treeTransferData: [],
				defaultProps: {
					label: 'orgName',
					children: 'orgList'
				},
		        addUserDialogVisible: false,
		        targetNodes: [],
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
			loadData: function() {
				let params = {
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/post/getList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
						let postId = response.data.result.dataList[0].postId;
						let postName = response.data.result.dataList[0].postName;
						let isSpecial = response.data.result.dataList[0].isSpecial;
						_this.handlePostPerson(postId, postName, isSpecial);
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			loadUserPostData: function(postId) {
				let params = {
					postId : postId
				};
				this.listLoading = true;
				let _this = this;
				axios.post('/user/post/getList', params).then(function(response) {
					_this.listLoading = false;
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tableData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//显示新增岗位界面
			handlePostAdd: function () {
				this.addPostDialogVisible = true;
				this.$refs.addPostForm.resetFields();
			},
			//显示编辑岗位界面
			handlePostEdit: function () {
				if(this.treeData == '') {
					this.$message.error('请先新增岗位');
				} else {
					this.editPostDialogVisible = true;
					this.editPostForm = Object.assign({}, this.postForm);
				}
			},
			//搜索
	        search: function(){
	            this.loadData();
	        },
			//新增岗位
			addPostSubmit: function () {
				this.$refs.addPostForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addPostLoading = true;
							let params = this.addPostForm;
							let _this = this;
							axios.post('/post/add', params).then(function(response) {
								_this.addPostLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadData();
									_this.addPostDialogVisible = false;
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
			//编辑岗位
			editPostSubmit: function () {
				this.$refs.editPostForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.editPostLoading = true;
							let params = this.editPostForm;
							let _this = this;
							axios.post('/post/update', params).then(function(response) {
								_this.editPostLoading = false;
								let retCode = response.data.retCode;
								let retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									_this.loadData();
						         	_this.editPostDialogVisible = false;
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
			//删除岗位
			deletePostSubmit: function () {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					let params = {
						postId: this.editPostForm.postId
					};
					let _this = this;
					axios.post('/post/delete', params).then(function(response) {
						let retCode = response.data.retCode;
						let retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData();
							_this.editPostDialogVisible = false;
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
			
			//
			handlePostPerson: function (postId, postName, isSpecial) {
				this.postForm.postId = postId;
				this.postForm.postName = postName;
				this.postForm.isSpecial = isSpecial;
				this.postName = postName;
				this.loadUserPostData(postId);
			},
			
			//显示新增人员界面
			handlePersonAdd() {
				
				if(this.treeData == '') {
					this.$message.error('请先新增岗位');
				} else if(this.postForm.postId == null) {
					this.editPostDialogVisible = true;
					this.$message.error('请选择一个岗位，继续新增人员');
				} else {
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
					this.targetNodes = [];
					this.userData = [];
				}
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
				this.targetNodes = this.targetNodes.filter(item => item.userId !== id);
			},
			addUserSubmit() {
				this.$emit('close');
				this.addUserDialogVisible = false;
				let postId = this.postForm.postId;
				let postName = this.postForm.postName;
				let isSpecial = this.postForm.isSpecial;
				let params = {postId:postId, userList:this.targetNodes};
				let _this = this;
				axios.post('/user/post/addList', params).then(function(response) {
					let retCode = response.data.retCode;
					let retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.handlePostPerson(postId, postName, isSpecial);
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
			},
			//批量删除人员
			handlePersonBatchDelete: function (rows) {
				if(rows == null || rows == '') {
					this.$message.error('请选择要删除的人员');
				} else {
					this.$confirm('确认批量删除记录吗？', '提示', { type: 'warning' }).then(() => {
						this.listPersonLoading = true;
						let params = {
							userPostIds: rows
						};
						let postId = this.postForm.postId;
						let _this = this;
						axios.post('/user/post/batchDelete', params).then(function(response) {
							_this.listPersonLoading = false;
							let retCode = response.data.retCode;
							let retMsg = response.data.retMsg;
							if(retCode == '0000000') {
								_this.$message({
									message: '删除成功',
									type: 'success'
								});
								_this.loadUserPostData(postId);
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
				}
			},
			
			handleAddUserNodeClick(node) {
		   		const existed = this.isExistedTargetNode(node);
		        if (!existed) {
		        	this.targetNodes.push(node);
		        }
		   	},
		   	isExistedTargetNode(node) {
				return this.targetNodes.some(item => item.userId === node.userId);
			},
			clearTargetNodes() {
				this.targetNodes = [];
		    },
		    
		    handleSelectionChange(val) {
		    	let userPostIds = [];
		    	val.forEach(function(item){
					userPostIds.push(item.userPostId);
				});
				this.tableChecked = userPostIds;
			},
		},
		computed: {
			isTargetNodesEmpty() {
		    	return this.targetNodes.length !== 0;
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