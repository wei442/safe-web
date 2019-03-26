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
import Dict from '@/views/dict/Dict'

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
	        component: Login
	    },
	    {
	    	path: '/register',
	    	name: 'register',
	    	component: Register
	    },
	    {
	    	path: '/changePassword',
	    	name: 'changePassword',
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
	    			path: '/title',
	    			name: '岗位管理',
	    			meta: { requireAuth: true },
	    			component: Title,
	    		},
	    		{
	    			path: '/dict',
	    			name: '字典管理',
	    			meta: { requireAuth: true },
	    			component: Dict,
	    		}
    		]
	    },
    ]
})

