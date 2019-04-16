// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(ElementUI);

router.beforeEach((to, from, next) => {
	var token = sessionStorage.getItem('token');
	if (to.path == '/register' || to.path == '/changePassword') {
		next()
	}  else {
		if (!token && to.path != '/login') {
			next({
				path: '/login'
			})
		} else {
			next()
		}
	}
})

//Add a request interceptor
axios.interceptors.request.use(function (config) {
	var token = sessionStorage.getItem('token');
    // Do something before request is sent
	if (token) {  // 判断是否存在webtoken，如果存在的话，则每个http header都加上webtoken
        config.headers.token = token;
	}
    return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
