<template>
	<div class="tree-transfer" :style="{width,height}">
	    <el-dialog
	            :title="dialogTitle"
	            :visible.sync="visible"
	            :before-close="modalClose"
	            @open="handleDialogOpen"
	            class="tree-transfer__dialog">
	      <section class="tree-transfer__content">
	        <div class="tree-transfer__left">
	          <h3 class="tree-transfer__title">
	            {{ sourceTitle }}
	          </h3>
	          <div class="tree-transfer__list">
	            <el-tree
	                    ref="tree"
	                    :data="treeTransferData"
	                    :node-key="nodeKey"
	                    :props="defaultProps"
	                    :highlight-current="true"
	                    :expand-on-click-node="false"
	                    @node-click="handleNodeClick">
	            </el-tree>
	          </div>
	        </div>
	        <div class="tree-transfer__middle">
	          <el-button
	                  type="primary"
	                  icon="el-icon-arrow-right"
	                  circle
	                  :disabled="canAddNode"
	                  @click="handleAdd">
	          </el-button>
	        </div>
	        <div class="tree-transfer__right">
	          <h3 class="tree-transfer__title">
	            <span>{{ targetTitle }}</span>
	            <span
	                  class="tree-transfer__right-close"
	                  @click="clearTargetNodes"
	                  v-if="isTargetNodesEmpty">清空</span>
	          </h3>
	          <div class="tree-transfer__list">
	            <ul class="tree-transfer__list-ul">
	            	<li class="tree-transfer__list-li" v-if="targetNodes">
	                <label>{{targetNodes[defaultProps.label]}}</label>
	                <span class="tree-transfer__list-delete" v-if="targetNodes" 
	                   @click="handleDeleteItem(targetNodes[nodeKey])">删除</span>
                   </li>
	            </ul>
	          </div>
	        </div>
	      </section>
	      <span slot="footer" class="dialog-footer">
	        <el-button size="mini" type="primary" @click="handleSubmit">确定</el-button>
	        <el-button size="mini" @click="modalClose">取消</el-button>
	      </span>
	    </el-dialog>
    </div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'TreeTransferDialog',
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
		    // 树形列表数据
		    treeTransferData: {
		      type: Array,
		      default: () => [],
		    },
		    // dialog 标题
		    dialogTitle: {
		      type: String,
		      default: 'Title',
		    },
		    // transfer 标题
		    transferTitle: {
		      type: Array,
		      default: () => ['源列表', '目标列表'],
		    },
		    // 树形列表节点 key
		    nodeKey: {
		      type: String,
		      default: 'orgId',
		    },
		    // 树形列表 data 默认 prop
		    defaultProps: {
		      type: Object,
		      default: () => ({ label: 'orgName', children: 'orgList' }),
		    },
		    // dialog 显示状态
		    dialogVisible: {
		      type: Boolean,
		      default: false,
		      required: true,
		    },
		},
		data() {
			return {
		      visible: false,
		      canAddNode: true,
		      targetNodes: [],
			};
		},
		
		created() {
			this.visible = this.dialogVisible;
		},
		methods: {
			handleAdd() {
				const currNode = this.$refs.tree.getCurrentNode();
				const existed = this.isExistedTargetNode(currNode);
				if (!existed) {
					this.targetNodes.push(currNode);
					this.canAddNode = true;
				}
			},
			handleDeleteItem(id) {
				this.targetNodes = [];
			},
			handleSubmit() {
				alert('this.targetNodes==='+this.targetNodes);
				alert('this.targetNodes.orgName==='+this.targetNodes.orgName);
				this.$refs.addOrgForm.parentOrgName=this.targetNodes.orgName;
				this.visible = false;
			},
			handleNodeClick(node) {
				this.targetNodes = node;
				var existed = this.isExistedTargetNode(node);
			},
			clearTargetNodes() {
				this.targetNodes = [];
			},
			isExistedTargetNode(node) {
				return this.targetNodes.some(item => item[this.nodeKey] === node[this.nodeKey]);
			},
			handleDialogOpen() {
				if (this.getLocal(LOCAL_KEY) != null) {
					this.targetNodes = JSON.parse(this.getLocal(LOCAL_KEY));
				}
			},
			modalClose() {
				this.$emit('close');
				this.visible = false;
			},
			beforeunloadHandler() {
				this.removeLocal(LOCAL_KEY);
			},
			setLocal(key, value) {
				sessionStorage.setItem(key, value);
			},
			getLocal(key) {
				return sessionStorage.getItem(key);
			},
			removeLocal(key) {
				sessionStorage.removeItem(key);
			},
		},
		computed: {
			sourceTitle() {
				return this.transferTitle[0];
			},
			targetTitle() {
				return this.transferTitle[1];
			},
			isTargetNodesEmpty() {
				return this.targetNodes.length !== 0;
			},
		},
		watch: {
			dialogVisible(newValue) {
				this.visible = newValue;
			},
		},
		mounted() {
			window.addEventListener('beforeunload', e => this.beforeunloadHandler(e));
		},
		destroyed() {
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e));
		},
	};
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
