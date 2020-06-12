import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = () => import('@/page/login/index');
const layout = () => import('@/page/layout/index');
const home = () => import('@/page/home/index');
const taskMgr = () => import('@/page/taskMgr/index');
const dataSource = () => import('@/page/taskMgr/dataSource/index');
const dataStatistics = () => import('@/page/taskMgr/dataStatistics/index');
const dataMess = () => import('@/page/taskMgr/dataMess/index');
const messageMgr = () => import('@/page/messageMgr/index');

const routes = [
	{
		path: '/login',
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
			path: '/taskMgr',
			name: 'TaskMgr',
			component: taskMgr,
			meta: ['任务管理'],
		},{
			path: '/messageMgr',
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
			path: '/dataMess',
			name: 'DataMess',
			component: dataMess,
			meta: ['任务管理-消息管理'],
		}]
	}
]

export default new Router({
	routes,
})
