import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Register from '@/views/register/Register'
import ChangePassword from '@/views/password/ChangePassword'
import Enterprise from '@/views/enterprise/Enterprise'
import OrgTree from '@/views/org/OrgTree'
import Org from '@/views/org/Org'
import OrgIndex from '@/views/org/OrgIndex'
import Title from '@/views/title/Title'
import Post from '@/views/post/Post'
import Post2 from '@/views/post/Post2'
import Dict from '@/views/dict/Dict'
import DictItem from '@/views/dict/DictItem'
import OrgQuality from '@/views/quality/OrgQuality'
import UserQuality from '@/views/quality/UserQuality'
import LawRule from '@/views/rule/LawRule'
import ProductionRule from '@/views/rule/ProductionRule'
import OperationRule from '@/views/rule/OperationRule'
import ActivitySummary from '@/views/activity/ActivitySummary'
import ActivityPublic from '@/views/activity/ActivityPublic'

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
	    			path: '/enterprise',
	    			name: 'enterprise',
	    			meta: { 
	    				title: '企业管理', 
	    				requireAuth: true 
	    			},
	    			component: Enterprise,
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
	    			path: '/post2',
	    			name: 'post2',
	    			meta: { 
	    				title: '岗位管理', 
	    				requireAuth: true 
	    			},
	    			component: Post2,
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
    		]
	    },
    ]
})

