import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Enterprise from '@/views/enterprise/Enterprise'
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
	    	path: '/',
	    	component: Home,
	    	name: '',
	    	children: [
	    		{ 
            	  path: '/index', 
            	  name: '首页', 
            	  component: Index,
	    		},
	    		{ 
	    			path: '/enterprise', 
	    			name: '企业管理', 
	    			component: Enterprise,
	    		},
	    		{ 
	    			path: '/dict', 
	    			name: '字典管理', 
	    			component: Dict,
	    		}
    		]
	    },
    ]
})

