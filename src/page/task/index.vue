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
						prop="userName"
						v-if ="accType==1"
					    width="180px">
						<template slot="header" slot-scope="scope">
							<div class="table-item">
								<font class="title">用户名</font>
								<el-select v-model="userid" placeholder="全部" @change="changeUser" class="select-border"  >
									<el-option
										v-for="item in allUser"
										:key="item.userid"
										:label="item.name"
										:value="item.userid" >
									</el-option>
								</el-select>
							</div>
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
					    label="成功发送数/成功率">
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
						width="350px"
					    label="任务管理">
					    <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row,'DataStatistics')">数据统计</button>
							<button class="check-info margin" @click="checkInfo(scope.row,'DataMess')">消息</button>
							<button class="check-info margin" @click="checkInfo(scope.row,'DataSource')">数据源</button>
							<button class="check-info margin" @click="showChatDialog(scope.row)">智能回复</button>
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
		<auto-chat :jobId = "jobId" :dialogVisible="showAutoChat" @changeStatus="closeDialog"></auto-chat>
    </div>
</template>

<script>
	import AutoChat from '@/components/AutoChat';
	import CreateTask from '@/components/CreateTask';
	import task from '@/api/task-mgr';
	import { getToken, setJobId, getUserType, getUserId } from '@/utils/auth';
	import moment from 'moment';
    export default {
		name:'TaskMgr',
        data(){
            return {
				accType:getUserType(),
				listLoading:false,
				showCreateTask:false,
				showAutoChat:false,
				jobId:"",
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				allUser:[],
				userObj:{},
				userid:"",
            }
		},
		components: {
			CreateTask,
			AutoChat,
		},
		computed: {
			key: function(){
				return this.$route.path.replace('/', '');
			},
		},
		activated(){
			this.getAllUser();
			document.getElementById('taskMgr').classList.add("is-active");
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(obj,name){
				setJobId(obj.job_id);
				this.$router.push({ name: name}); 
            },
            showChatDialog(obj){
				this.jobId = obj.job_id;
				this.showAutoChat = true;
			},
			showDialog(){
				this.showCreateTask = true;
			},
			closeDialog(data){
				this.showCreateTask = false;
				this.showAutoChat = false;
				if ( data ){
					this.getTaskList();
				}
			},
			changeUser(){
				this.getTaskList();
			},
			async getAllUser(){
				var req = {
					"token":getToken()
				}
				const data = await task.getAllUser(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.allUser = data.data.list || [];
					this.allUser.unshift({"userid":"","name":"全部"})
					for ( var i=0; i<this.allUser.length; i++ ){
						this.userObj[this.allUser[i].userid] = this.allUser[i].name;
					}
				}
				this.getTaskList();
			},
            async getTaskList(){
				if ( this.accType !=1 ){
					this.userid = getUserId();
				}
				var req = {
					"token":getToken(),
					"userid":this.userid
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					var list = data.data.list || [];
					for ( var i=0; i<list.length;i++ ){
						var succ_send_per = 0;
						var reply_num_per = 0;
						if ( list[i].send_num >0 ){
							succ_send_per = Math.round(list[i].succ_send_num/list[i].send_num*1000)/10;
						}
						if ( list[i].succ_send_num >0 ){
							reply_num_per = Math.round(list[i].reply_num/list[i].succ_send_num*1000)/10;
						}
						this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD'));
						this.$set(list[i],"succ_send_per",succ_send_per+"%");
						this.$set(list[i],"reply_num_per",reply_num_per+"%");
						this.$set(list[i],"userName",this.userObj[list[i].userid]);
					}
					this.dataList = list;
				}else{
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
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
		.table-item{
			padding-left: 0px;
			margin-right: 21px;
			float:left;
			.title{
				position: relative;
				margin-left: 0px;
				padding-top: 15px;
				margin-right: 0px;
				font-weight: 500;
				font-size: 12px;
				font-stretch: normal;
				letter-spacing: 0.36px;
				color: #595d6e;
			}
			.select-border {
				padding-left: 10px;
				width: 100px;
				height: 34px;
				background-color: #ffffff;
				border-radius: 4px;
			}
		}
	}
	/deep/ .el-select>.el-input{
		padding-left: 0px;
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
