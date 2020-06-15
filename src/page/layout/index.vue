<template>
	<el-container class="manage-page">
		<el-aside class="aside">
			<div class="logout" @click="logout()">
	            <span class= "person-name">{{name}}</span>
				<svg-icon iconClass="logout" class="logout-icon"/>
	        </div>  
			<el-menu
				:default-active="defaultActive"
				text-color="#768492"
				active-text-color="#3092fc" theme="dark" router>
				<el-menu-item index="home"><svg-icon iconClass="data-screening" /><span class="menu-name">数据总览</span></el-menu-item>
				<el-menu-item index="taskMgr" id="taskMgr"><svg-icon iconClass="task-mgr" /><span class="menu-name">任务管理</span></el-menu-item>
				<el-menu-item index="messageMgr"><svg-icon iconClass="mess-mgr" /><span class="menu-name">聊天管理</span></el-menu-item>
			</el-menu>
		</el-aside>
		<el-main class="right-main">
			<transition name="fade-transform" mode="out-in">
				<keep-alive exclude="DataSource,DataStatistics,DataMess">           <!--exclude和include用法要求在需要的组件内声明name，否则无效 -->
					<router-view :key="defaultActive" />
				</keep-alive>
			</transition>
		</el-main>
  	</el-container>
</template>

<script>
	import { removeToken, getUser} from '@/utils/auth'
	import { MessageBox } from 'element-ui'
    export default {
		data(){
            return {
                name:'admin',
            }
        },
		computed: {
			defaultActive: function(){
				return this.$route.path.replace('/', '');
			},
		},
		methods:{
			logout(){
	   			MessageBox.confirm('是否退出登录？', '', {
		          confirmButtonText: '确定',
		          showCancelButton:false,
		          type: 'warning'
		        }).then(() => {
		        	removeToken();
		        	this.$router.push({ name: 'Login' });
		        })
			}
		}
    }
</script>

<style lang="less" scoped>
	.manage-page /deep/{
		background-color: #f7f7f7;
		height:100%;
		width:100%;
		.el-col{
			min-height: 100%; 
			background-color: #f7f7f7;
		}
		.el-menu{
			margin-top: 26px;
			min-height: 100%;
			border-right:solid 1px #f0f0f0;
			background-color:#f7f7f7;
		}
		.el-aside{
			width:190px !important;
		}
		.el-menu-item:hover,
		.is-active{
			background-color:#f0f0f0;
			color: #3092fc;
		}
	}
	.aside{
		position: absolute;
		height: 100%;
		float: left;
		width:190px;
		left: 0px;
		border-right: solid 1px #f0f0f0;
		background-color: #f7f7f7;
		box-shadow: 0px 2px 8px 0.6px rgba(21, 63, 105, 0.03);
		overflow: hidden;
		.logout{
			position: relative;
			left: 15px;
			margin-top: 20px;
			border-radius: 13px;
			width: 146px;
			height: 26px;
			background-color: #f0f0f0;
			color: #6a7988;
			border: none;
			cursor: pointer;
			.person-name{
				position:absolute;
				line-height: 26px;
				margin-left: 13px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				max-width: 100px;
			}
			.logout-icon{
				position:absolute;
				right: 10px;
				top: 4px;
				width:16px;
				height:18px;
			}
		}
	}
	.right-main{
		position: absolute;
		min-width:870px;
        left: 190px;
        right: 0px;
        padding: 0px;
        overflow: hidden;
		height: 100%;
		background-color:#f0f0f0;
	}
	.menu-name{
		margin-left: 10px;
	}
</style>
