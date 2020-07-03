<template>
    <div class="fillcontain">
		<h2 class="title">数据总览</h2>
		<div class="card-list">
			<div class="card-border margin-right">
				<div class="card-content">
					<svg-icon iconClass="acc-count" class="card-icon"/>
					<div class="card-value">{{total_online}}</div>
				</div>
				<div class="card-name">在线账号数</div>
			</div>
			<div class="card-border margin-right" style="flex-grow: 1;">
				<div class="card-content">
					<svg-icon iconClass="acc-block" class="card-icon"/>
					<div class="card-value">{{total_suspend}}</div>
				</div>
				<div class="card-name">封号总数</div>
			</div>
			<div class="card-border">
				<div class="card-content">
					<svg-icon iconClass="acc-mess" class="card-icon"/>
					<div class="card-value">{{total_msg}}</div>
				</div>
				<div class="card-name">发消息数</div>
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
					    label="服务器编号">
					    <template scope="scope">
							<span style="font-weight:600;">{{scope.row.hostname}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="online"
					    label="在线数">
					</el-table-column>
					<el-table-column
						prop="today_suspend_num"
					    label="今日封号数">
					</el-table-column>
					<el-table-column
						prop="today_succ_send_num"
					    label="今日发消息数">
					</el-table-column>
					<el-table-column
						prop="today_reply_num"
					    label="今日回复数">
					</el-table-column>
					<el-table-column
						prop="succ_send_num"
					    label="累计发消息数">
					</el-table-column>
					<el-table-column
						prop="reply_num"
					    label="累计回复数">
					</el-table-column>
					<el-table-column
					    label="详情">
					    <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row)">查看</button>
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
		<server-info :dialogVisible="showMessDialog" :hostname="hostname" @changeStatus="closeDialog"></server-info>
    </div>
</template>

<script>
	import home from '@/api/home';
	import { getToken, getUserType} from '@/utils/auth'
	import ServerInfo from '@/components/ServerInfo';
    export default {
        data(){
            return {
				listLoading:false,
				hostname:"",
				showMessDialog:false,
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				accType:getUserType(),
				dataList:[],
				total_online:0,
				total_suspend:0,
				total_msg:0,
            }
		},
		components: {
			ServerInfo,
		},
        mounted(){
			if ( this.accType !=1 ){
				this.$router.push({ name: "TaskMgr" }); 
			}
		},
		activated(){
			this.getServerList();
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
				this.getServerList();
			},
			checkInfo(data){
				this.hostname = data.hostname;
				this.showMessDialog = true;
			},
			closeDialog(){
				this.showMessDialog = false;
			},
            async getServerList(){
				var req = {
					"token":getToken()
				}
				const data = await home.getServerList(JSON.stringify(req));
				if ( data.rtn == 0 ){
					this.dataList = data.data.list || [];
					this.total_online = data.data.total_online;
					this.total_suspend = data.data.total_suspend;
					this.total_msg = data.data.total_succ_send_num;
				}else if ( this.accType ==1 ){
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
	position:relative;
	margin-left: 19px;
	padding-top: 15px;
	font-size: 12px;	
	color: #34404b;
}
.card-list{
	position: relative;
	margin: 15px 19px;
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
	.margin-right{
		margin-right: 30px;
	}
}
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:205px;
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
