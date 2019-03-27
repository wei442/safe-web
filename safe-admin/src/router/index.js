import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Register from '@/views/register/Register'
import ChangePassword from '@/views/password/ChangePassword'
import Enterprise from '@/views/enterprise/Enterprise'
import Org from '@/views/org/Org'
import Title from '@/views/title/Title'
import Post from '@/views/post/Post'
import Dict from '@/views/dict/Dict'
import DictItem from '@/views/dict/DictItem'

Vue.use(Router)

export default new Router({
  routes: [
	    {
    		path: '/',
    		redirect: '/login'
	    },
	    {
	        path: '/login',
	        name: '登录',
	        component: Login
	    },
	    {
	    	path: '/register',
	    	name: '注册',
	    	component: Register
	    },
	    {
	    	path: '/changePassword',
	    	name: '修改密码',
	    	component: ChangePassword
	    },
	    {
	    	path: '/',
	    	component: Home,
	    	name: '',
	    	children: [
	    		{
            	  path: '/index',
            	  name: '首页',
            	  meta: { requireAuth: true },
            	  component: Index,
	    		},
	    		{
	    			path: '/enterprise',
	    			name: '企业管理',
	    			meta: { requireAuth: true },
	    			component: Enterprise,
	    		},
	    		{
	    			path: '/org',
	    			name: '组织机构管理',
	    			meta: { requireAuth: true },
	    			component: Org,
	    		},
	    		{
	    			path: '/post',
	    			name: '岗位管理',
	    			meta: { requireAuth: true },
	    			component: Post,
	    		},
	    		{
	    			path: '/title',
	    			name: '职务管理',
	    			meta: { requireAuth: true },
	    			component: Title,
	    		},
	    		{
	    			path: '/dict',
	    			name: '字典管理',
	    			meta: { requireAuth: true },
	    			component: Dict,
	    		},
	    		{
	    			path: '/dictItem',
	    			name: '字典子项管理',
	    			meta: { requireAuth: true },
	    			component: DictItem,
	    		},
    		]
	    },
    ]
})

