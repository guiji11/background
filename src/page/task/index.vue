<template>
    <div class="fillcontain">
		<h2 class="title">任务管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建任务</el-button>
		<div class="card-list">
			<div class="card-border margin-right">
				<div class="card-content">
					<svg-icon iconClass="send-total" class="card-icon"/>
					<div class="card-value" :style="overNum?'color:#ff8f5e':''">{{total_send}}</div>
				</div>
				<div class="card-name">目标发送总数</div>
			</div>
			<div class="card-border margin-right" style="flex-grow: 1;">
				<div class="card-content">
					<svg-icon iconClass="send-succ" class="card-icon"/>
					<div class="card-value">{{total_success}}</div>
				</div>
				<div class="card-name">成功发送数</div>
			</div>
			<div class="card-border">
				<div class="card-content">
					<svg-icon iconClass="acc-mess" class="card-icon"/>
					<div class="card-value">{{total_reply}}</div>
				</div>
				<div class="card-name">回复总数</div>
			</div>
		</div>
		<div class="table-list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					height="100%"
					:highlight-current-row ="highlight"
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
						v-if ="accType==1"
						prop="userName"
					    width="180px">
						<template slot="header" slot-scope="scope">
							<div class="table-item">
								<font class="title">所属用户</font>
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
						v-if ="accType==2"
					    label="分配的子账号">
						<template scope="scope">
							<el-tooltip effect="dark" :content="scope.row.sub" placement="top">
								<div>{{scope.row.sub}}</div>
							</el-tooltip>
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
					    label="剩余可用消息数">
					</el-table-column>
					<el-table-column
					    label="操作">
						 <template scope="scope">
							<svg-icon iconClass="more" class="info-icon"/>
                            <el-popover
                            placement="left"
                            width="90"
                            :visible-arrow="false"
                            transition="fade-transform"
                            trigger="hover">
                                <div class="popover-border">
									<button class="check-info" @click="checkInfo(scope.row,'DataStatistics')">数据统计</button>
									<button class="check-info" @click="checkInfo(scope.row,'DataMess')">群发消息</button>
									<button class="check-info" @click="checkInfo(scope.row,'DataSource')">数据源绑定</button>
									<button class="check-info" @click="showChatDialog(scope.row)">智能回复</button>
									<button class="check-info" @click="showSubDialog(scope.row)" v-if="accType==2">分配子账号</button>
                                </div>
                                <el-button slot="reference" class="popover-btn"></el-button>
                            </el-popover>
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
		<district-acc :info = "info" :dialogVisible="showSub" @changeStatus="closeDialog"></district-acc>
    </div>
</template>

<script>
	import AutoChat from '@/components/AutoChat';
	import CreateTask from '@/components/CreateTask';
	import DistrictAcc from '@/components/DistrictAcc';
	import task from '@/api/task-mgr';
	import sub from '@/api/sub';
	import { getToken, setJobId, getUserType, getUserId, formatCash } from '@/utils/auth';
	import moment from 'moment';
    export default {
		name:'TaskMgr',
        data(){
            return {
				accType:getUserType(),
				highlight:true,
				listLoading:true,
				showCreateTask:false,
				showAutoChat:false,
				showSub:false,
				jobId:'',
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				allUser:[],
				userObj:{},
				userid:'',
				info:{},
				total_send:0,
				total_success:0,
				total_reply:0,
				overNum:false,
            }
		},
		components: {
			CreateTask,
			AutoChat,
			DistrictAcc,
		},
		computed: {
			key: function(){
				return this.$route.path.replace('/', '');
			},
		},
		mounted(){
			if ( this.accType ==3 ){
				this.$router.push({ name: 'MessageMgr' });
			}
			this.getAllUser();
			this.getMessStat();
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
			showSubDialog(obj){
				this.info = obj;
				this.showSub = true;
			},
			showDialog(){
				this.showCreateTask = true;
			},
			closeDialog(data){
				this.showCreateTask = false;
				this.showAutoChat = false;
				this.showSub = false;
				if ( data ){
					this.getMessStat();
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
				const data = await sub.getAllUser(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.allUser = data.data.list || [];
					this.allUser.sort((a,b) => a.name.localeCompare(b.name));
					for ( var i=0; i<this.allUser.length; i++ ){
						this.userObj[this.allUser[i].userid] = this.allUser[i].name;
					}
					this.allUser.unshift({"userid":"","name":"全部"});
				}
				this.getTaskList();
			},
			async getMessStat(){
				var req = {
					"token":getToken()
				}
				const data = await task.getUserSendStat(JSON.stringify(req));
				if ( data.rtn ==0 ){
					if ( data.data.succ_send_num >=data.data.total_send_num ){
						this.overNum = true;
					}
					this.total_send = formatCash(data.data.total_send_num || 0);
					this.total_success = formatCash(data.data.succ_send_num || 0);
					this.total_reply = formatCash(data.data.reply_num || 0);
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
				this.listLoading = false;
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
						if ( list[i].uids && list[i].uids.length>0 ){                                                        
							var arr = list[i].uids;
							var ary = [];
							for ( var j=0; j<arr.length; j++ ){
								var name = this.userObj[arr[j]];
								if ( name ){
									ary.push(name);
								}
							}
							this.$set(list[i], "sub", ary.join('，')||'--');
						}else{
							this.$set(list[i], "sub", '--');
						}
					}
					this.dataList = list;
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
	right:18px;
	width: 130px;
	height: 36px;
	background-color: #7a9e9f;
	border-radius: 4px;
	color: #ffffff;
}
.card-list{
    position: relative;
    margin: 0px 19px;
    top: 65px;
    display: flex;
    cursor: default;
    height: 138px;
	.card-border{
		position:relative;
		width: 31%;
		height: 100%;
		background-color: #ffffff;
		box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
		border-radius: 6px;
		.card-content{
			position:relative;
			border-bottom: 1px solid #eeeeee;
			padding-top: 15px;
			width: 90%;
			margin-left: auto;
			margin-right: auto;
			height: 77px;
			.card-value{
				position: absolute;
				top: 35px;
				right: 0px;
				height: 30px;
				line-height: 30px;
				color: #74788d;
				font-size: 30px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.card-icon{
				margin-left: 10px;
				color: #768492;
				height:42px;
				width:42px;
				padding-top: 15px;
			}
		}
		.card-name{
			margin-left: auto;
			margin-right: auto;
			padding-top: 12px;
			color: #a49e93;
			font-size: 14px;
			font-weight: 500;
			width: 90%;
		}
	}
	.mess-detail{
		position: absolute;
		right: 4%;
		width: 25px;
		height: 22px;
		bottom: 12px;
		cursor: pointer;
		color: rgb(48, 146, 252);
	}
	.margin-right{
		margin-right: 30px;
	}
}
.table-list /deep/{
    position: absolute;
    left: 19px;
    right: 19px;
    top: 222px;
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
			top: 2px;
			cursor: pointer;
			min-width: 40px;
			min-height: 34px;
			opacity: 0;
			z-index: 3;
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
