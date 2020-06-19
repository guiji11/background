<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 数据源管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建数据源</el-button>
		<div class="table-title">
			<div class="table-item">
				<font class="title">任务名</font>
				<el-select v-model="taskId" placeholder="全部" @change="changeTask" class="select-border"  >
					<el-option
						v-for="item in taskList"
						:key="item.job_id"
						:label="item.job_name"
						:value="item.job_id" >
					</el-option>
				</el-select>
			</div>
		</div>
		<div class="list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					height="100%"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark">
					<el-table-column
						prop="time"
					    label="时间">
					</el-table-column>
					<el-table-column
					    label="小组ID">
						<template scope="scope">
							<el-tooltip effect="dark" :content="scope.row.fb_group_id" placement="top">
								<span>{{scope.row.fb_group_id}}</span>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column
						prop="member_num"
					    label="用户总数">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="下发数">
					</el-table-column>
					<el-table-column
						prop="reply_num"
					    label="回复数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="状态">
						<template scope="scope">
							<span>{{scope.row.status==1?'开始':'停止'}}</span>
						</template>
					</el-table-column>
					<el-table-column
						width="120px"
					    label="操作">
						 <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row)">{{scope.row.status==1?'停止':'开始'}}</button>
							<svg-icon iconClass="delete" class="margin delete"/>
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
		<create-source :job_id="jobId" :dialogVisible="showSourceDialog" @changeStatus="closeDialog"></create-source>
    </div>
</template>

<script>
	import CreateSource from '@/components/CreateSource';
	import task from '@/api/task-mgr';
	import { getToken, getJobId, setJobId } from '@/utils/auth';
	import moment from 'moment';
    export default {
		name:"DataMess",
        data(){
            return {
				listLoading:false,
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				taskList:[],
				taskId:"",
				showSourceDialog:false,
				jobId:getJobId(),
            }
		},
		components: {
			CreateSource,
		},
		created(){
			this.getTaskList();
		},
        mounted(){
			this.getSourceList();
			document.getElementById('taskMgr').classList.add("is-active");
        },
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(){

			},
			showDialog(){
				this.showSourceDialog = true;
			},
			closeDialog(data){
				this.showSourceDialog = false;
				if ( data ){
					this.getSourceList();
				}
			},
			changeTask(){
				this.jobId = this.taskId;
				setJobId(this.taskId);
				this.getSourceList();
            },
			returnPage(){
				this.$router.push({ name: "TaskMgr" }); 
			},
			async getSourceList(){
				var req = {
					"token":getToken(),
					"job_id":this.jobId
				}
				const data = await task.getSource(JSON.stringify(req));
				if ( data.rtn ==0 ){
					var list = data.data.list || [];
					for ( var i=0; i<list.length;i++ ){
						this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD'));
					}
					this.dataList = list;
				}
			},
			async getTaskList(){
				var req = {
					"token":getToken()
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.taskList = data.data.list || [];
					this.taskId = this.jobId;
				}
            }			
        },
    }
</script>

<style lang="less" scoped>
.return{
    position: absolute;
    margin-left: 18px;
    padding-top: 16px;
    height: 24px;
    width: 24px;
    cursor: pointer;
}
.title{
	position:absolute;
	margin-left: 49px;
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
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:105px;
	bottom:20px;
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
		.delete{
			position: absolute;
			margin-top: 1px;
			width: 23px;
			height: 23px;
			cursor: pointer;
		}
		.margin{
			margin-left: 12px;
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
