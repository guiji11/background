import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/icons'
import '@/style/index.less'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueLazyLoad from 'vue-lazyload'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueLazyLoad);
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})

Vue.prototype.$message=function(msg){                                          //错误提示框只显示一个
	if (document.getElementsByClassName('el-message').length > 0) {
		return;
	}
	ElementUI.Message(msg);
}
