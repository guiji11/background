<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 群发消息</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建消息</el-button>
		<div class="table-title">
			<div class="table-item">
				<font class="title">发送时间 : </font>
				<el-time-picker
					is-range
					v-model="timeArr"
					@change=setJobRuntime
					format="HH:mm"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					placeholder="选择时间范围">
				</el-time-picker>
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
						prop="name"
					    width="200px">
						<template slot="header" slot-scope="scope">
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
						</template>
					</el-table-column>
					<el-table-column
						prop="time"
					    label="时间">
					</el-table-column>
					<el-table-column
					    label="发送内容">
						<template scope="scope">
							<el-tooltip effect="dark" :content="scope.row.msg" placement="top">
								<div>{{scope.row.msg}}</div>
							</el-tooltip>
						</template>
					</el-table-column>
					<el-table-column
					    label="目标发送量">
						<template scope="scope">
							<span :style="scope.row.succ_send_num>=scope.row.quota?'color:#ff8f5e':''">{{scope.row.quota}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="succ_send_num"
					    label="已发送量">
					</el-table-column>
					<el-table-column
						prop="reply_num"
					    label="回复数量">
					</el-table-column>
					<el-table-column
						prop="reply_per"
					    label="回复率">
					</el-table-column>
					<el-table-column
					    label="状态">:
						<template scope="scope">
							<span :style="scope.row.status==1?'color:#3092fc':'color:#ff8f5e'">{{scope.row.status==1?'进行中':'暂停'}}</span>
						</template>
					</el-table-column>
					<el-table-column
						width="180px"
					    label="操作">
						 <template scope="scope">
							<button class="check-info" @click="editMess(scope.row)">编辑</button>
							<button class="check-info margin" :style="scope.row.status==1?'color:#ff8f5e':'color:#3092fc'" @click="manageMess(scope.row)">{{scope.row.status==1?'停止':'开始'}}</button>
							<svg-icon iconClass="delete" class="margin delete" @click="manageMess(scope.row,-1)"/>
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
		<create-message :job_id="jobId" :title = "title" :info="info" :dialogVisible="showMessDialog" @changeStatus="closeDialog"></create-message>
    </div>
</template>

<script>
	import CreateMessage from '@/components/CreateMessage';
	import task from '@/api/task-mgr';
	import { getToken, getJobId, setJobId, getUserType, getUserId } from '@/utils/auth';
	import moment from 'moment';
	import { MessageBox } from 'element-ui'
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
				showMessDialog:false,
				jobId:getJobId(),
				taskId:"",
				info:{},
				title:"",
				accType:getUserType(),
				userid:"",
				timeArr:"",
            }
		},
		components: {
			CreateMessage,
		},
		created(){
			this.getTaskList();
		},
        mounted(){
			if ( this.accType ==3 ){
				this.$router.push({ name: 'MessageMgr' });
			}
			document.getElementById('taskMgr').classList.add("is-active");
		},
		destroyed(){
			document.getElementById('taskMgr').classList.remove("is-active");
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			async setJobRuntime(){
				var req = {
					"token":getToken(),
					"job_id":this.jobId,
					"from":moment(this.timeArr[0]).format('HH:mm'),
					"to":moment(this.timeArr[1]).format('HH:mm')
				}
				const data = await task.setJobRuntime(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.$message({
						message: "success",
						center: true,
						type: 'success',
						duration: 3 * 1000
					});
				}else{
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
			},
			editMess(data){
				this.info = data;
				this.showMessDialog = true;
				this.title ="编辑消息";
			},
			showDialog(){
				this.showMessDialog = true;
				this.title ="创建消息";
				this.info = {};
			},
			closeDialog(data){
				this.showMessDialog = false;
				if ( data ){
					this.getMessList();
				}
			},
			changeTask(){
				this.jobId = this.taskId;
				setJobId(this.taskId);
				this.getMessList();
            },
			returnPage(){
				this.$router.go(-1);
			},
			manageMess(obj,status){
				if ( !status ){
					status = 1;
					if ( obj.status ==1 ){
						status = 0;
					}
					this.sendMessData(obj,status);
				}else{
					MessageBox.confirm('是否删除该消息？', '', {
					confirmButtonText: '删除',
					showCancelButton:false,
					type: 'warning'
					}).then(() => {
						this.sendMessData(obj,status);
					});
				}
			},
			async sendMessData(obj,status){
				var req = {
					"token":getToken(),
					"job_id":this.jobId,
					"msg_id":obj.msg_id,
					"status":status
				}
				const data = await task.manageMess(JSON.stringify(req));
				if ( data.rtn ==0 ){
					if ( status !=-1 ){
						this.$set(obj,"status",status);
					}else{
						this.dataList.splice(this.dataList.findIndex(item => item.msg_id === obj.msg_id), 1);
					}
				}else{
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
			},
			async getMessList(){
				var req = {
					"token":getToken(),
					"job_id":this.jobId
				}
				const data = await task.getMess(JSON.stringify(req));
				if ( data.rtn ==0 ){
					var list = data.data.list || [];
					list.sort(function(a,b){return b.status - a.status;});
					const obj = this.taskList.find( value =>value.job_id == this.jobId);
					for ( var i=0; i<list.length;i++ ){
						var reply_per = 0;
						if ( list[i].succ_send_num >0 ){
							reply_per = Math.round(list[i].reply_num/list[i].succ_send_num*1000)/10;
						}
						this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD'));
						this.$set(list[i],"reply_per",reply_per+"%");
						this.$set(list[i],"name",obj.job_name);
					}
					this.dataList = list;	
					var begin = moment(new Date()).format('YYYY-MM-DD');
					var end = new Date(begin+" "+obj.end);		
					begin = new Date(begin+" "+obj.begin);		
					this.timeArr=[begin, end];
				}
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
					this.taskList = data.data.list || [];
					this.taskId = this.jobId;
				}else{
					if ( data.msg.indexOf('nvalid token')!=-1 ){
						data.msg = "身份验证过期，请重新登录！";
					}
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
				this.getMessList();
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
	right:18px;
	width: 130px;
	height: 36px;
	background-color: #7a9e9f;
	border-radius: 4px;
	color: #ffffff;
}
.table-title{
    position: relative;
	left: 0px;
	top: 55px;
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
			display:none;
			margin-top: 1px;
			width: 23px;
			height: 23px;
			cursor: pointer;
		}
		.margin{
			margin-left: 10px;
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
				width: 116px;
				height: 34px;
				background-color: #ffffff;
				border-radius: 4px;
			}
		}
		/deep/ .el-table__row:hover .delete{
			display:initial;
			transition: all,.3s;
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
