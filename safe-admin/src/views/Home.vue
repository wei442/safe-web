<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				{{collapsed?'':sysName}}
			</el-col>
			<el-col :span="1" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="onRoutes" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect" unique-opened router v-show="!collapsed">
			      	<template v-for="item in items">
				        <template v-if="item.child">
				    		<el-submenu :index="item.path">
				            	<template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
				            		<el-menu-item v-for="(subItem,i) in item.child" :key="i" :index="subItem.path" v-if="!subItem.hidden">{{ subItem.name }}
				            	</el-menu-item>
			            	</el-submenu>
				        </template>
				        <template v-else>
				          	<el-menu-item :index="item.path">
				          		<i :class="item.icon"></i>{{ item.name }}
			          		</el-menu-item>
				        </template>
			        </template>
			    </el-menu>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="breadcrumb-container">
						<el-breadcrumb separator="/">
							<el-breadcrumb-item :to="{ path: '/index' }">首页</el-breadcrumb-item>
							<el-breadcrumb-item v-for="(item, index) in $route.meta.title" :key="index">{{ item }}</el-breadcrumb-item>
						</el-breadcrumb>
					</el-col>
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
	import axios from 'axios'

	export default {
		data() {
			return {
				sysName:'VUEADMIN',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				
				items: [
					{
			        	path: '/index',
			        	name: '首页',
		            	icon: 'el-icon-menu'
			      	},
			      	{
			      		path: '1',
			      		name: '企业管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/enterpriseSetting',
			            		name: '企业设置',
			            	},
			            	{
			            		path: '/masterAdminFirst',
			            		name: '更换主管理员',
			            	},
			            	{
			            		path: '/slaveAdmin',
			            		name: '设置子管理员',
			            	},
			        	]
			      	},
			      	{
			      		path: '2',
			      		name: '系统管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/enterprise',
			            		name: '企业管理',
			            	},
			            	{
			            		path: '/org',
			            		name: '组织机构管理',
			            	},
			            	{
			            		path: '/dict',
			            		name: '字典管理',
			            	},
			            	{
			            		path: '/dictItem',
			            		name: '字典子项管理',
			            		hidden: true,
			            	},
			            	{
			            		path: '/post',
			            		name: '岗位管理', 
			            	},
			            	{
			            		path: '/title',
			            		name: '职务管理',
			            	},
			        	]
			      	},
			      	{
			      		path: '3',
			      		name: '资质管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/orgQuality',
			            		name: '机构资质管理',
			            	},
			            	{
			            		path: '/userQuality',
			            		name: '用户资质管理',
			            	}
			        	]
			      	},
			      	{
			      		path: '4',
			      		name: '规范性文件管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/lawRule',
			            		name: '法律法规与制度管理',
			            	},
			            	{
			            		path: '/productionRule',
			            		name: '安全生产管理制度管理',
			            	},
			            	{
			            		path: '/operationRule',
			            		name: '安全操作规程管理',
			            	}
			        	]
			      	},
			      	{
			      		path: '5',
			      		name: '安全生产活动管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/activitySummary',
			            		name: '活动总结管理',
			            	},
			            	{
			            		path: '/activityPublic',
			            		name: '活动宣传管理',
			            	},
			        	]
			      	},
			      	
			      	{
			      		path: '6',
			      		name: '风险管控管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/risk',
			            		name: '风险因素管理',
			            	},
			            	{
			            		path: '/riskAccept',
			            		name: '控制措施验收管理',
			            	},
			            	{
			            		path: '/riskFile',
			            		name: '风险档案管理',
			            	}
			        	]
			      	},
			      	{
			      		path: '7',
			      		name: '安全隐患管理',
			            icon: 'el-icon-menu',
			            child: [
			            	{
			            		path: '/postCheck',
			            		name: '岗位排查清单管理',
			            	},
			            	{
			            		path: '/postCheckSend',
			            		name: '排查任务指派管理',
			            	},
			            	{
			            		path: '/postCheckStatistics',
			            		name: '排查结果统计管理',
			            	},
			            	{
			            		path: '/dangerExpress',
			            		name: '隐患快报',
			            	},
			            	{
			            		path: '/dangerCheck',
			            		name: '隐患抽查',
			            	},
			            	{
			            		path: '/dangerBook',
			            		name: '隐患台账',
			            	},
			        	]
			      	},
		        ]
			}
		},
		/*生命周期钩子方法，创建的时候调用该方法*/
	    created: function () {
	    },
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
			},
			handleclose() {
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				this.$confirm('确认退出吗？', '提示', {}).then(() => {
					let params = {};
					let _this = this;
					axios.post('/user/logout', params).then(function(response) {
						var retCode = response.data.retCode;
						var retMsg = response.data.retMsg;
						if(retCode == '0000000') {
							sessionStorage.removeItem('token');
							sessionStorage.removeItem('userAccount');
							sessionStorage.removeItem('userName');
							sessionStorage.clear();
							_this.$router.push('/login');
						} else {
							_this.$message.error(retMsg);
						}
		              }).catch(function (error) {
		                	console.log(error);
		              });
				});
			},
			
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
		},
		computed: {
			onRoutes() {
				return this.$route.path.replace('/', '');
			}
    	}, 
		mounted() {
			this.sysUserAvatar = '../assets/user.png';
		}
	}

</script>

<style scoped lang="scss">

.container {
	position: absolute;
	top: 0px;
	bottom: 0px;
	width: 100%;
	.header {
		height: 60px;
		line-height: 60px;
		background: #ffffff;
		border-bottom: 5px solid #72bff3;
		color:#72bff3;
		.userinfo {
			text-align: right;
			padding-right: 35px;
			float: right;
			.userinfo-inner {
				cursor: pointer;
				color:#72bff3;
				img {
					width: 40px;
					height: 40px;
					border-radius: 20px;
					margin: 10px 0px 10px 10px;
					float: right;
				}
			}
		}
		.logo {
			//width:230px;
			height:160px;
			font-size: 22px;
			padding-left:20px;
			padding-right:20px;
			border-color: #f0f0f0;
			border-right-width: 1px;
			border-right-style: solid;
			background: url("http://img4.duitang.com/uploads/item/201511/26/20151126112617_vUaQf.jpeg") no-repeat center;
			background-size: 60%;
			background-color: #ffffff;
			img {
				width: 40px;
				float: left;
				margin: 10px 10px 10px 18px;
			}
			.txt {
				color:#fff;
			}
		}
		.logo-width{
			width:230px;
		}
		.logo-collapse-width{
			width:60px
		}
		.tools{
			padding: 0px 23px;
			width:14px;
			height: 60px;
			line-height: 60px;
			cursor: pointer;
		}
	}
	.main {
		display: flex;
		// background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: auto;
		aside {
			flex:0 0 230px;
			width: 230px;
			// position: absolute;
			// top: 0px;
			// bottom: 0px;
			.el-menu{
				height: 100%;
			}
			.collapsed{
				width:60px;
				.item{
					position: relative;
				}
				.submenu{
					position:absolute;
					top:0px;
					left:60px;
					z-index:99999;
					height:auto;
					display:none;
				}

			}
		}
		.menu-collapsed{
			flex:0 0 60px;
			width: 60px;
		}
		.menu-expanded{
			flex:0 0 230px;
			width: 230px;
			padding-top: 100px;
		}
		.content-container {
			// background: #f1f2f7;
			flex:1;
			// position: absolute;
			// right: 0px;
			// top: 0px;
			// bottom: 0px;
			// left: 230px;
			overflow-y: scroll;
			padding: 20px;
			.breadcrumb-container {
				//margin-bottom: 15px;
				.title {
					width: 200px;
					float: left;
					color: #475669;
				}
				.breadcrumb-inner {
					float: right;
				}
			}
			.content-wrapper {
				background-color: #fff;
				box-sizing: border-box;
			}
		}
	}
}
</style>