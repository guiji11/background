import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import('@/page/login/index');
const layout = () => import('@/page/layout/index');
const home = () => import('@/page/home/index');
const taskMgr = () => import('@/page/task/index');
const dataSource = () => import('@/page/task/dataSource/index');
const dataStatistics = () => import('@/page/task/dataStatistics/index');
const dataMess = () => import('@/page/task/dataMess/index');
const messageMgr = () => import('@/page/message/index');

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: login
	},
	{
		path: '/',
		component: layout,
		name: 'Layout',
		children: [{
			path: '/home',
			name: 'Home',
			component: home,
			meta: ['数据总览'],
		},{
			path: '/task',
			name: 'TaskMgr',
			component: taskMgr,
			meta: ['任务管理'],
		},{
			path: '/message',
			name: 'MessageMgr',
			component: messageMgr,
			meta: ['聊天管理'],
		},{
			path: '/dataSource',
			name: 'DataSource',
			component: dataSource,
			meta: ['任务管理-数据源管理'],
		},{
			path: '/dataStatistics',
			name: 'DataStatistics',
			component: dataStatistics,
			meta: ['任务管理-数据统计'],
		},{
			path: '/dataMessage',
			name: 'DataMess',
			component: dataMess,
			meta: ['任务管理-消息管理'],
		}]
	}
]

export default new Router({
	routes,
})
