<template>
    <div class="fillcontain">
		<h2 class="title">任务管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建任务</el-button>
		<div class="table-list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					height="100%"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark">
					<el-table-column
					    label="任务名">
					    <template scope="scope">
							<span style="font-weight:600;">{{scope.row.job_name}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="time"
					    label="创建时间">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="已下发消息数">
					</el-table-column>
					<el-table-column
					    label="成功下发数/成功率">
						<template scope="scope">
							<span>{{scope.row.succ_send_num+"/"+scope.row.succ_send_per}}</span>
						</template>
					</el-table-column>
					<el-table-column
					    label="回复数/回复率">
						<template scope="scope">
							<span>{{scope.row.reply_num+"/"+scope.row.reply_num_per}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="remain_quota"
					    label="剩余可用数据">
					</el-table-column>
					<el-table-column
						width="250px"
					    label="任务管理">
					    <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row,'DataStatistics')">数据统计</button>
							<button class="check-info margin" @click="checkInfo(scope.row,'DataMess')">消息</button>
							<button class="check-info margin" @click="checkInfo(scope.row,'DataSource')">数据源</button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-pagination">
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page.sync="currentPage"
					:page-size="pageSize"
					background
					layout="prev, pager, next"
					:page-count="pageTotal">
				</el-pagination>
			</div>
		</div>
		<create-task :dialogVisible="showCreateTask" @changeStatus="closeDialog"></create-task>
    </div>
</template>

<script>
	import CreateTask from '@/components/CreateTask';
	import task from '@/api/task-mgr';
	import { getToken, setJobId } from '@/utils/auth';
	import moment from 'moment';
    export default {
		name:'TaskMgr',
        data(){
            return {
				listLoading:false,
				showCreateTask:false,
				multipleSelection:[],
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
            }
		},
		components: {
			CreateTask,
		},
		computed: {
			key: function(){
				return this.$route.path.replace('/', '');
			},
		},
		mounted(){
			this.getTaskList();
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(obj,name){
				setJobId(obj.job_id);
				this.$router.push({ name: name}); 
            },
            changeTask(){

			},
			showDialog(){
				this.showCreateTask = true;
			},
			closeDialog(data){
				this.showCreateTask = false;
				if ( data ){
					this.getTaskList();
				}
			},
            async getTaskList(){
				var req = {
					"token":getToken()
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					var list = data.data.list || [];
					for ( var i=0; i<list.length;i++ ){
						var succ_send_per = 0;
						var reply_num_per = 0;
						if ( list[i].send_num >0 ){
							succ_send_per = Math.round(list[i].succ_send_num/list[i].send_num*100);
						}
						if ( list[i].succ_send_num >0 ){
							reply_num_per = Math.round(list[i].reply_num/list[i].succ_send_num*100);
						}
						this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD'));
						this.$set(list[i],"succ_send_per",succ_send_per+"%");
						this.$set(list[i],"reply_num_per",reply_num_per+"%");
					}
					this.dataList = list;
				}
            }
        },
    }
</script>

<style lang="less" scoped>
.title{
	position:absolute;
	margin-left: 19px;
	padding-top: 20px;
	font-size: 12px;	
	color: #34404b;
}
.create-mess-btn{
	position:absolute;
	margin-top: 12px;
	float:right;
	right:22px;
	width: 130px;
	height: 36px;
	background-color: #7a9e9f;
	border-radius: 4px;
	color: #ffffff;
}
.table-title{
    position: relative;
    top: 55px;
    left: 0px;
    right: 320px;
    height: 34px;
	.table-item{
		margin-right: 21px;
		float:left;
		.title{
			position: relative;
			margin-left: 19px;
			padding-top: 15px;
			margin-right: 9px;
			font-weight: 500;
			font-size: 12px;
			font-stretch: normal;
			letter-spacing: 0.36px;
			color: #595d6e;
		}
		.select-border{
			width: 136px;
			height: 34px;
			background-color: #ffffff;
			border-radius: 4px;
		}
	}
}
.table-list /deep/{
    position: absolute;
    left: 19px;
    right: 19px;
    top: 65px;
    bottom: 20px;
    border-radius: 4px;
	.table-content{
		position: absolute;
		width:100%;
		top: 0px;
		bottom: 40px;
		box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.04);
		border-radius: 4px;
		.check-info{
			position: relative;
			padding: 4px 13px;
			background-color: #ffffff;
			border: solid 1px #e7e7e7;
			border-radius: 19px;
			font-size: 12px;
			color: #828f9c;
			cursor:pointer;
		}
		.margin{
			margin-left: 10px;
		}
        .info-icon{
            position: absolute;
            margin-left: 2px;
            top: 12px;
            cursor: pointer;
        }
        .popover-border{
            cursor: pointer;
        }
        .popover-btn{
            position: absolute;
            margin-left: 0px;
            top: 9px;
            cursor: pointer;
            min-width: 24px;
            min-height: 23px;
			opacity: 0;
			z-index: 10;
        }
	}
	.table-pagination /deep/{
		position: absolute;
		bottom: 0px;
		left: 0px;
		right: 0px;
		margin-top: 5px;
		text-align: center;
		height: 27px;
		.el-pagination{
			padding: 0 0;
		}
	}
}
</style>
