import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Register from '@/views/register/Register'
import ChangePassword from '@/views/password/ChangePassword'
import UserInfo from '@/views/user/UserInfo'
import Enterprise from '@/views/enterprise/Enterprise'
import UserAdmin from '@/views/enterprise/UserAdmin'
import OrgTree from '@/views/org/OrgTree'
import Org from '@/views/org/Org'
import OrgIndex from '@/views/org/OrgIndex'
import Title from '@/views/title/Title'
import Post from '@/views/post/Post'
import Dict from '@/views/dict/Dict'
import DictItem from '@/views/dict/DictItem'
import OrgQuality from '@/views/quality/OrgQuality'
import UserQuality from '@/views/quality/UserQuality'
import LawRule from '@/views/rule/LawRule'
import ProductionRule from '@/views/rule/ProductionRule'
import OperationRule from '@/views/rule/OperationRule'
import ActivitySummary from '@/views/activity/ActivitySummary'
import ActivityPublic from '@/views/activity/ActivityPublic'
import Setting from '@/views/setting/Setting'

import Risk from '@/views/risk/Risk'
import RiskAccept from '@/views/risk/RiskAccept'
import RiskFile from '@/views/risk/RiskFile'

import PostCheck from '@/views/danger/PostCheck'
import PostCheckSend from '@/views/danger/PostCheckSend'
import PostCheckStatistics from '@/views/danger/PostCheckStatistics'
import DangerExpress from '@/views/danger/DangerExpress'
import DangerCheck from '@/views/danger/DangerCheck'
import DangerBook from '@/views/danger/DangerBook'

Vue.use(Router)

export default new Router({
  routes: [
	    {
    		path: '/',
    		redirect: '/login'
	    },
	    {
	        path: '/login',
	        name: 'login',
	        title: '登录',
	        meta: { 
				title: '登录', 
			},
	        component: Login
	    },
	    {
	    	path: '/register',
	    	name: 'register',
	    	title: '注册',
	    	meta: { 
				title: '注册', 
			},
	    	component: Register
	    },
	    {
	    	path: '/changePassword',
	    	name: 'changePassword',
	    	title: '修改密码',
	    	meta: { 
				title: '修改密码', 
			},
	    	component: ChangePassword
	    },
	    {
	    	path: '/',
	    	component: Home,
	    	name: '',
	    	children: [
	    		{
            	  path: '/index',
            	  name: 'index',
            	  meta: { 
	    				title: '首页', 
	    				requireAuth: true 
	    			},
            	  component: Index,
	    		},
	    		{
	    			path: '/userInfo',
	    			name: 'userInfo',
	    			meta: { 
	    				title: '用户信息管理', 
	    				requireAuth: true 
	    			},
	    			component: UserInfo,
	    		},
	    		{
	    			path: '/enterprise',
	    			name: 'enterprise',
	    			meta: { 
	    				title: '企业管理', 
	    				requireAuth: true 
	    			},
	    			component: Enterprise,
	    		},
	    		{
	    			path: '/userAdmin',
	    			name: 'userAdmin',
	    			meta: { 
	    				title: '用户管理', 
	    				requireAuth: true 
	    			},
	    			component: UserAdmin,
	    		},
	    		{
	    			path: '/org',
	    			name: 'org',
	    			meta: { 
	    				title: '组织机构管理', 
	    				requireAuth: true 
	    			},
	    			component: Org,
	    		},
	    		{
	    			path: '/post',
	    			name: 'post',
	    			meta: { 
	    				title: '岗位管理', 
	    				requireAuth: true 
	    			},
	    			component: Post,
	    		},
	    		{
	    			path: '/title',
	    			name: 'title',
	    			meta: { 
	    				title: '职务管理', 
	    				requireAuth: true 
	    			},
	    			component: Title,
	    		},
	    		{
	    			path: '/dict',
	    			name: 'dict',
	    			meta: { 
	    				title: '字典管理', 
	    				requireAuth: true 
	    			},
	    			component: Dict,
	    		},
	    		{
	    			path: '/dictItem',
	    			name: 'dictItem',
	    			meta: { 
	    				title: '字典子项管理', 
	    				requireAuth: true 
	    			},
	    			component: DictItem,
	    		},
	    		
	    		{
	    			path: '/orgQuality',
	    			name: 'orgQuality',
	    			meta: { 
	    				title: '机构资质管理', 
	    				requireAuth: true 
	    			},
	    			component: OrgQuality,
	    		},
	    		{
	    			path: '/userQuality',
	    			name: 'userQuality',
	    			meta: { 
	    				title: '用户资质管理', 
	    				requireAuth: true 
	    			},
	    			component: UserQuality,
	    		},
	    		
	    		{
	    			path: '/lawRule',
	    			name: 'lawRule',
	    			meta: { 
	    				title: '法律法规与制度管理', 
	    				requireAuth: true 
	    			},
	    			component: LawRule,
	    		},
	    		{
	    			path: '/productionRule',
	    			name: 'productionRule',
	    			meta: { 
	    				title: '安全生产管理制度管理', 
	    				requireAuth: true 
	    			},
	    			component: ProductionRule,
	    		},
	    		{
	    			path: '/operationRule',
	    			name: 'operationRule',
	    			meta: { 
	    				title: '安全操作规程管理', 
	    				requireAuth: true 
	    			},
	    			component: OperationRule,
	    		},
	    		{
	    			path: '/activitySummary',
	    			name: 'activitySummary',
	    			meta: { 
	    				title: '活动总结管理', 
	    				requireAuth: true 
	    			},
	    			component: ActivitySummary,
	    		},
	    		{
	    			path: '/activityPublic',
	    			name: 'activityPublic',
	    			meta: { 
	    				title: '文化宣传管理', 
	    				requireAuth: true 
	    			},
	    			component: ActivityPublic,
	    		},
	    		{
	    			path: '/setting',
	    			name: 'setting',
	    			meta: { 
	    				title: '设置管理', 
	    				requireAuth: true 
	    			},
	    			component: Setting,
	    		},
	    		{
	    			path: '/risk',
	    			name: 'risk',
	    			meta: { 
	    				title: '风险因素管理', 
	    				requireAuth: true 
	    			},
	    			component: Risk,
	    		},
	    		{
	    			path: '/riskAccept',
	    			name: 'riskAccept',
	    			meta: { 
	    				title: '控制措施验收管理', 
	    				requireAuth: true 
	    			},
	    			component: RiskAccept,
	    		},
	    		{
	    			path: '/riskFile',
	    			name: 'riskFile',
	    			meta: { 
	    				title: '风险档案管理', 
	    				requireAuth: true 
	    			},
	    			component: RiskFile,
	    		},
	    		
	    		{
	    			path: '/postCheck',
	    			name: 'postCheck',
	    			meta: { 
	    				title: '岗位排查清单管理', 
	    				requireAuth: true 
	    			},
	    			component: PostCheck,
	    		},
	    		{
	    			path: '/postCheckSend',
	    			name: 'postCheckSend',
	    			meta: { 
	    				title: '排查任务指派管理', 
	    				requireAuth: true 
	    			},
	    			component: PostCheckSend,
	    		},
	    		{
	    			path: '/postCheckStatistics',
	    			name: 'postCheckStatistics',
	    			meta: { 
	    				title: '排查结果统计管理', 
	    				requireAuth: true 
	    			},
	    			component: PostCheckStatistics,
	    		},
	    		{
	    			path: '/dangerExpress',
	    			name: 'dangerExpress',
	    			meta: { 
	    				title: '隐患快报管理', 
	    				requireAuth: true 
	    			},
	    			component: DangerExpress,
	    		},
	    		{
	    			path: '/dangerCheck',
	    			name: 'dangerCheck',
	    			meta: { 
	    				title: '隐患抽查管理', 
	    				requireAuth: true 
	    			},
	    			component: DangerCheck,
	    		},
	    		{
	    			path: '/dangerBook',
	    			name: 'dangerBook',
	    			meta: { 
	    				title: '隐患台账管理', 
	    				requireAuth: true 
	    			},
	    			component: DangerBook,
	    		},
    		]
	    },
    ]
})

