<template>
	<section>
	
		<el-container style="height: 560px; border: 0px solid #eee">
			<el-aside width="240px">
				<h3>组织机构</h3>
				<el-tree
	                ref="tree"
	                :data="treeData"
	                :node-key="orgId"
	                :props="defaultProps"
					default-expand-all
	                :highlight-current="true"
                	:expand-on-click-node="false"
					@node-click="handleNodeClick">
				</el-tree>
			</el-aside>
			<br>
			
			<el-container>
				<el-main>
					<!--工具条-->
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
							<h3 class="title">{{ orgForm.orgName }}  <el-button type="primary" size="small" @click="handleOrgEdit">编辑</el-button></h3>
							<el-form-item>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handleOrgAdd">新增子部门</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<!--列表-->
					<el-table :data="tableOrgData" border fit highlight-current-row v-loading="listOrgLoading" stripe style="width:100%;" size="small">
						<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
						<el-table-column prop="orgName" label="部门" header-align="center" align="center"></el-table-column>
					</el-table>
					
					<br>
					<!--工具条-->
					<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
						<el-form :inline="true" :model="orgForm" size="small" style="float: left;">
							<h3 class="title">部门人员</h3>
							<el-form-item>
								<el-button type="primary" icon="el-icon-plus" size="small" @click="handlePersonAdd">新增人员</el-button>
								<el-button type="danger" icon="el-icon-delete" size="small" @click="handlePersonBatchDelete(tableChecked)">批量删除</el-button>
							</el-form-item>
						</el-form>
					</el-col>
					<!--列表-->
					<el-table :data="tablePersonData" border fit highlight-current-row v-loading="listPersonLoading" stripe style="width:100%;" size="small" @row-click="handlePersonClick" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55"></el-table-column>
						<el-table-column type="index" label="序号" width="50" header-align="center" align="center"></el-table-column>			
						<el-table-column prop="userName" label="用户名称" header-align="center" align="center"></el-table-column>
						<el-table-column prop="userAccount" label="手机" header-align="center" align="center"></el-table-column>
						<!-- 
						<el-table-column label="操作" width="240" header-align="center" align="center">
							<template slot-scope="scope">
						        <el-button type="primary" size="small" @click="handlePersonEdit(scope.$index, scope.row)">编辑</el-button>
						        <el-button type="danger" size="small" @click="handlePersonDelete(scope.$index, scope.row)">删除</el-button>
					  		</template>
						</el-table-column>
						-->
					</el-table>
				</el-main>
			</el-container>
	    </el-container>
		<br>
	    
		<!--新增部门界面-->
		<el-dialog title="新增部门" :visible.sync="addOrgDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">部门信息</h3>
			</el-col>
			<el-form ref="addOrgForm" :model="addOrgForm" :rules="addOrgFormRules" label-width="120px">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model.trim="addOrgForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="parentOrgName">
					<el-input v-model.trim="addOrgForm.parentOrgName" @focus="handleOrgAddParentOrgName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addOrgDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addOrgSubmit" :loading="addOrgLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--新增部门-选择上级部门-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="addOrgSelectParentOrgDialogVisible" class="tree-transfer__dialog">
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
		 						@node-click="handleAddOrgSelectParentOrgNodeClick">
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
				           			<span class="tree-transfer__list-delete" @click="handleAddOrgSelectParentOrgDeleteItem(targetNodes[nodeKey])">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="addOrgSelectParentOrgSubmit">确定</el-button>
		    		<el-button size="medium" @click="addOrgSelectParentOrgDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>
		
		<!--编辑部门界面-->
		<el-dialog title="编辑部门" :visible.sync="editOrgDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">部门信息</h3>
			</el-col>
		
			<el-form ref="editOrgForm" :model="editOrgForm" :rules="editOrgFormRules" label-width="120px">
				<el-form-item label="部门名称" prop="orgName">
					<el-input v-model.trim="editOrgForm.orgName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="上级部门" prop="parentOrgName">
					<el-input v-model.trim="editOrgForm.parentOrgName" @focus="handleOrgEditParentOrgName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editOrgDialogVisible = false">取 消</el-button>
				<el-button type="danger" @click="deleteOrgSubmit" :loading="editOrgLoading">删 除</el-button>
				<el-button type="primary" @click="editOrgSubmit" :loading="editOrgLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--编辑部门-选择上级部门-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="editOrgSelectParentOrgDialogVisible" class="tree-transfer__dialog">
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
		 						@node-click="handleEditOrgSelectParentOrgNodeClick">
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
			           			<li class="tree-transfer__list-li" v-if="targetNodes != null && targetNodes != ''">
				           			<label>{{targetNodes[defaultProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" v-if="targetNodes != null && targetNodes != ''" @click="handleEditOrgSelectParentOrgDeleteItem(targetNodes[nodeKey])">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="editOrgSelectParentOrgSubmit">确定</el-button>
		    		<el-button size="medium" @click="editOrgSelectParentOrgDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>
		
		<!--新增部门人员界面-->
		<el-dialog title="新增部门人员" :visible.sync="addPersonDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">人员信息</h3>
			</el-col>
			<el-form ref="addPersonForm" :model="addPersonForm" :rules="addPersonFormRules" label-width="120px">
				<el-form-item label="姓名" prop="userName">
					<el-input v-model.trim="addPersonForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="userAccount">
					<el-input v-model.trim="addPersonForm.userAccount" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="orgName">
					<el-input v-model.trim="addPersonForm.orgName" @focus="handlePersonAddParentPersonName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="addPersonDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addPersonSubmit" :loading="addPersonLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--新增部门人员-选择上级部门-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="addPersonSelectParentPersonDialogVisible" class="tree-transfer__dialog">
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
		 						@node-click="handleAddPersonSelectParentPersonNodeClick">
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
				           			<span class="tree-transfer__list-delete" @click="handleAddPersonSelectParentPersonDeleteItem(targetNodes[nodeKey])">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="addPersonSelectParentPersonSubmit">确定</el-button>
		    		<el-button size="medium" @click="addPersonSelectParentPersonDialogVisible = false">取消</el-button>
	    		</span>
    		</el-dialog>
		</div>

		<!--编辑部门人员界面-->
		<el-dialog title="编辑部门人员" :visible.sync="editPersonDialogVisible">
			<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
				<h3 class="title">人员信息</h3>
			</el-col>
			<el-form ref="editPersonForm" :model="editPersonForm" :rules="editPersonFormRules" label-width="80px">
				<el-form-item label="姓名" prop="userName">
					<el-input v-model.trim="editPersonForm.userName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="userAccount">
					<el-input v-model.trim="editPersonForm.userAccount" auto-complete="off" disabled></el-input>
				</el-form-item>
				<el-form-item label="部门" prop="orgName">
					<el-input v-model.trim="editPersonForm.orgName" @focus="handlePersonEditParentPersonName" readonly="true" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editPersonDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editPersonSubmit" :loading="editPersonLoading">保 存</el-button>
			</div>
		</el-dialog>
		
		<!--编辑部门-选择上级部门-->
		<div class="tree-transfer" :style="{width,height}">
			<el-dialog title="选择部门" :visible.sync="editPersonSelectParentPersonDialogVisible" class="tree-transfer__dialog">
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
		 						@node-click="handleEditPersonSelectParentPersonNodeClick">
			 				</el-tree>
		 				</div>
	 				</div>
	 				<div class="tree-transfer__middle">
	 					<el-button type="primary" icon="el-icon-arrow-right" circle :disabled="canEditNode" @click="handleEdit"></el-button>
	                </div>
	                <div class="tree-transfer__right">
	                	<h3 class="tree-transfer__title">
	                  		<span>已选</span>
	                  		<span class="tree-transfer__right-close" @click="clearTargetNodes" v-if="isTargetNodesEmpty">清空</span>
		              	</h3>
		              	<div class="tree-transfer__list">
			          		<ul class="tree-transfer__list-ul">
			           			<li class="tree-transfer__list-li" v-if="targetNodes != null && targetNodes != ''">
				           			<label>{{targetNodes[defaultProps.label]}}</label>
				           			<span class="tree-transfer__list-delete" v-if="targetNodes != null && targetNodes != ''" @click="handleEditPersonSelectParentPersonDeleteItem(targetNodes[nodeKey])">删除</span>
			           			</li>
		           			</ul>
	           			</div>
           			</div>
       			</section>
				<span slot="footer" class="dialog-footer">
		    		<el-button size="medium" type="primary" @click="editPersonSelectParentPersonSubmit">确定</el-button>
		    		<el-button size="medium" @click="editPersonSelectParentPersonDialogVisible = false">取消</el-button>
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
				treeData: [],
				defaultProps: {
					label: 'orgName',
					children: 'orgList'
		        },
		        
		        tableOrgData: [],
				listOrgLoading: false,
				orgForm: {},
				labelPosition: 'right',
				addOrgDialogVisible: false,//新增界面是否显示
				//新增部门数据
				addOrgForm: {
					orgName: '',
					parentOrgId: '',
					parentOrgName: '',
				}, 
				addOrgLoading: false,
				addOrgFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					parentOrgName: [
						{ required: true, message: '请输入上级部门名称', trigger: 'blur' }
					],
				}, 
				editOrgDialogVisible: false,//编辑界面是否显示
				//编辑部门数据
				editOrgForm: {
					orgName: '',
					parentOrgId: '',
					parentOrgName: '',
				}, 
				editOrgLoading: false,
				editOrgFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					parentOrgName: [
						{ required: true, message: '请输入上级部门名称', trigger: 'blur' }
					],
				}, 
				showDialogVisible: false,//查看界面是否显示
				showForm: {
				},
				
				tablePersonData: [],
				listPersonLoading: false,
				tableChecked:[],
				addPersonDialogVisible: false,//新增界面是否显示
				//新增人员界面数据
				addPersonForm: {
				}, 
				addPersonLoading: false,
				addPersonFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					userAccount: [
						{ required: true, message: '请输入手机', trigger: 'blur' }
					],
				}, 
				editPersonDialogVisible: false,//编辑界面是否显示
				//编辑人员界面数据
				editPersonForm: {
				},
				editPersonLoading: false,
				editPersonFormRules: {
					orgName: [
						{ required: true, message: '请输入部门名称', trigger: 'blur' }
					],
					userName: [
						{ required: true, message: '请选择部门类型', trigger: 'blur' }
					],
					userAccount: [
						{ required: true, message: '请输入手机', trigger: 'blur' }
					],
				}, 
				
				//新增子部门-选择部门
				treeTransferData: [],
		        addOrgSelectParentOrgDialogVisible: false,
		        targetNodes: {},
		        editOrgSelectParentOrgDialogVisible: false,
		        //新增部门人员-选择部门
		        addPersonSelectParentPersonDialogVisible: false,
		        editPersonSelectParentPersonDialogVisible: false,
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    	this.search();
	    },
		methods: {
	    	//搜索
	        search: function(){
	            this.loadData(null);
	        },
			loadData: function(node) {
				let params = {
				};
				this.listPersonLoading = true;
				let _this = this;
				let _node = node;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.treeData = response.data.result.dataList;
						_this.tableOrgData = response.data.result.dataList;
						if(_node == null) {
							let orgId = response.data.result.dataList[0].orgId;
							let orgName = response.data.result.dataList[0].orgName;
							_node = {orgId : orgId, orgName : orgName};
						}
						_this.handleNodeClick(_node);
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        		
	        		
	        	);
			}, 
			//加载机构数据
			loadOrgData: function(orgId) {
				let params = {
					orgId:orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tableOrgData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
	        		}).catch(function (error) {
	        			console.log(error);
	        		}
	        	);
			}, 
			//加载用机构数据
			loadUserOrgData: function(orgId) {
				let params = {
					orgId:orgId
				};
				this.listPersonLoading = true;
				let _this = this;
				axios.post('/user/org/getList', params).then(function(response) {
					_this.listPersonLoading = false;
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
					if(retCode == '0000000') {
						_this.tablePersonData = response.data.result.dataList;
					} else {
						_this.$message.error(retMsg);
					}
					}).catch(function (error) {
						console.log(error);
					}
				);
			}, 
			
			handleNodeClick(data) {
				this.loadOrgData(data.orgId);
				this.loadUserOrgData(data.orgId);
				this.orgForm.orgId = data.orgId;
				this.orgForm.orgName = data.orgName;
				this.addOrgForm.parentOrgId = data.orgId;
				this.addOrgForm.parentOrgName = data.orgName;
				this.addPersonForm.orgId = data.orgId;
				this.addPersonForm.orgName = data.orgName;
	        },
	        
			//显示新增部门界面
			handleOrgAdd: function () {
				if(this.$refs.tree.getCurrentNode() == null) {
					this.$message.error('请选择一个部门，继续新增子部门');
				} else {
					this.addOrgDialogVisible = true;
					this.$refs.addOrgForm.resetFields();
					this.addOrgForm.parentOrgId = this.orgForm.orgId;
					this.addOrgForm.parentOrgName = this.orgForm.orgName;
				}
			},
			//显示编辑部门界面
			handleOrgEdit: function () {
				if(this.$refs.tree.getCurrentNode() == null) {
					this.$message.error('请选择一个部门');
				} else {
					this.editOrgDialogVisible = true;
					let params = {
						orgId: this.$refs.tree.getCurrentNode().orgId
					};
					let _this = this;
					axios.post('/org/getDetail', params).then(function(response) {
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.editOrgForm = response.data.result;
						} else {
							_this.$message.error(retMsg);
						}
					}).catch(function (error) {
						console.log(error);
					});
				}
			},
			//显示新增部门人员界面
			handlePersonAdd: function () {
				if(this.$refs.tree.getCurrentNode() == null) {
					this.$message.error('请选择一个部门，继续新增人员');
				} else {
					this.addPersonDialogVisible = true;
					this.$refs.addPersonForm.resetFields();
					this.addPersonForm.orgId = this.$refs.tree.getCurrentNode().orgId;
					this.addPersonForm.orgName = this.$refs.tree.getCurrentNode().orgName;
				}
			},
			//显示编辑界面
			handlePersonEdit: function (index, row) {
				this.editPersonDialogVisible = true;
				this.editPersonForm = Object.assign({}, row);
			},
			//显示编辑界面
			handlePersonClick: function (row, event, column) {
				this.editPersonDialogVisible = true;
				this.editPersonForm = Object.assign({}, row);
			},
			//显示查看界面
			handleShow: function (index, row) {
				this.showDialogVisible = true;
        		this.showForm = Object.assign({}, row);
			},
			//新增部门
			addOrgSubmit: function () {
				this.$refs.addOrgForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addOrgLoading = true;
							let orgId = this.orgForm.orgId;
							let params = this.addOrgForm;
							let _this = this;
							axios.post('/org/add', params).then(function(response) {
								_this.addOrgLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									var node = {orgId : _this.orgForm.orgId, orgName : _this.orgForm.orgName};
									_this.loadData(node);
									_this.handleNodeClick(node);
									_this.addOrgDialogVisible = false;
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
			//编辑部门
			editOrgSubmit: function () {
				this.$refs.editOrgForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.editOrgLoading = true;
							let orgId = this.orgForm.orgId;
							let params = this.editOrgForm;
							this.orgForm.orgName = this.editOrgForm.orgName;
							let _this = this;
							axios.post('/org/update', params).then(function(response) {
								_this.editOrgLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									var node = {orgId : _this.editOrgForm.orgId, orgName : _this.editOrgForm.orgName};
									_this.loadData(node);
									_this.handleNodeClick(node);
									_this.editOrgDialogVisible = false;
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
			//删除部门
			deleteOrgSubmit: function () {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					let params = {
						orgId: this.editOrgForm.orgId
					};
					let _this = this;
					axios.post('/org/delete', params).then(function(response) {
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadData(null);
							_this.editOrgDialogVisible = false;
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
			
			//新增子部门-选择上级部门
			handleOrgAddParentOrgName() {
				this.addOrgSelectParentOrgDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
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
				var node = {orgId : this.addOrgForm.parentOrgId, orgName : this.addOrgForm.parentOrgName};
				this.targetNodes = node;
		   	},
		   	handleAddOrgSelectParentOrgNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleAddOrgSelectParentOrgDeleteItem(id) {
				this.targetNodes = {};
			},
			addOrgSelectParentOrgSubmit() {
				this.$emit('close');
				this.addOrgSelectParentOrgDialogVisible = false;
				this.addOrgForm.parentOrgId = this.targetNodes.orgId;
				this.addOrgForm.parentOrgName = this.targetNodes.orgName;
			},
			
			//编辑部门-选择上级部门
			handleOrgEditParentOrgName() {
				this.editOrgSelectParentOrgDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
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
				var node = {orgId : this.editOrgForm.parentOrgId, orgName : this.editOrgForm.parentOrgName};
				this.targetNodes = node;
		   	},
		   	handleEditOrgSelectParentOrgNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleEditOrgSelectParentOrgDeleteItem(id) {
				this.targetNodes = {};
			},
			editOrgSelectParentOrgSubmit() {
				this.$emit('close');
				this.editOrgSelectParentOrgDialogVisible = false;
				this.editOrgForm.parentOrgId = this.targetNodes.orgId;
				this.editOrgForm.parentOrgName = this.targetNodes.orgName;
			},
			
			//新增部门人员
			addPersonSubmit: function () {
				this.$refs.addPersonForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.addPersonLoading = true;
							let orgId = this.orgForm.orgId;
							let params = this.addPersonForm;
							let _this = this;
							axios.post('/user/org/add', params).then(function(response) {
								_this.addPersonLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
						         	_this.loadUserOrgData(orgId);
									_this.addPersonDialogVisible = false;
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
			//编辑部门人员
			editPersonSubmit: function () {
				this.$refs.editPersonForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认保存吗？', '提示', {}).then(() => {
							this.editPersonLoading = true;
							let orgId = this.orgForm.orgId;
							let params = this.editPersonForm;
							let _this = this;
							axios.post('/user/org/update', params).then(function(response) {
								_this.editPersonLoading = false;
								var retCode = response.data.retCode;
								var retMsg = response.data.retMsg;
								if(retCode == '0000000') {
									_this.$message({
										message: '保存成功',
										type: 'success'
									});
									_this.loadUserOrgData(orgId);
						         	_this.editPersonDialogVisible = false;
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
			handlePersonDelete: function () {
				this.$confirm('确认删除该记录吗？', '提示', { type: 'warning' }).then(() => {
					this.listPersonLoading = true;
					let params = {
						userOrgId: row.userOrgId
					};
					let _this = this;
					axios.post('/user/org/delete', params).then(function(response) {
						_this.listPersonLoading = false;
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							_this.$message({
								message: '删除成功',
								type: 'success'
							});
							_this.loadUserOrgData(orgId);
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
			//批量删除人员
			handlePersonBatchDelete: function (rows) {
				if(rows == null || rows == '') {
					this.$message.error('请选择要删除的人员');
				} else {
					this.$confirm('确认批量删除记录吗？', '提示', { type: 'warning' }).then(() => {
						this.listPersonLoading = true;
						let orgId = this.orgForm.orgId;
						let params = {
							userOrgIds: rows
						};
						let _this = this;
						axios.post('/user/org/batchDelete', params).then(function(response) {
							_this.listPersonLoading = false;
							var retCode = response.data.retCode;
							var retMsg = response.data.retMsg;
							if(retCode == '0000000') {
								_this.$message({
									message: '删除成功',
									type: 'success'
								});
								_this.loadUserOrgData(orgId);
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
			handleSelectionChange(val) {
				let userOrgIds = [];
		    	val.forEach(function(item){
		    		userOrgIds.push(item.userOrgId);
				});
				this.tableChecked = userOrgIds;
			},
			
			//新增部门人员-选择上级部门
			handlePersonAddParentPersonName() {
				this.addPersonSelectParentPersonDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
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
				var node = {orgId : this.addPersonForm.parentPersonId, orgName : this.addPersonForm.parentPersonName};
				this.targetNodes = node;
		   	},
		   	handleAddPersonSelectParentPersonNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleAddPersonSelectParentPersonDeleteItem(id) {
				this.targetNodes = {};
			},
			addPersonSelectParentPersonSubmit() {
				this.$emit('close');
				this.addPersonSelectParentPersonDialogVisible = false;
				this.addPersonForm.orgId = this.targetNodes.orgId;
				this.addPersonForm.orgName = this.targetNodes.orgName;
			},
			
			//编辑部门人员-选择上级部门
			handlePersonEditParentPersonName() {
				this.editPersonSelectParentPersonDialogVisible = true;
			    let params = {};
				let _this = this;
				axios.post('/org/getTreeList', params).then(function(response) {
					var retCode = response.data.retCode;
					var retMsg = response.data.retMsg;
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
				var node = {orgId : this.editPersonForm.parentPersonId, orgName : this.editPersonForm.parentPersonName};
				this.targetNodes = node;
		   	},
		   	handleEditPersonSelectParentPersonNodeClick(node) {
		   		this.targetNodes = node;
		   	},
		   	handleEditPersonSelectParentPersonDeleteItem(id) {
				this.targetNodes = {};
			},
			editPersonSelectParentPersonSubmit() {
				this.$emit('close');
				this.editPersonSelectParentPersonDialogVisible = false;
				this.editPersonForm.orgId = this.targetNodes.orgId;
				this.editPersonForm.orgName = this.targetNodes.orgName;
			},
			
		},
		
		mounted() {
			this.$refs.tree.setCurrentKey(-1);
		},
		computed: {
		},
		watch: {
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