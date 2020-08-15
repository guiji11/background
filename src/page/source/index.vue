<template>
    <div class="fillcontain">
		<h2 class="title">数据源管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="editGroup('','')">创建数据源</el-button>
		<div :class="['mail-mgr-tag',sourceType==1?'sel':'']" @click="changeType(1)">邮箱组管理</div>
		<div :class="['other-mgr-tag',sourceType==1?'':'sel']" @click="changeType(2)">自建FB组管理</div>
		<div class="list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					height="100%"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark">
					<el-table-column
					    label="名称">
					    <template scope="scope">
							<span style="font-weight:600;">{{scope.row.name}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="job_name"
					    label="绑定的任务">
					</el-table-column>
					<el-table-column
						prop="total"
					    label="导入总数">
					</el-table-column>
					<el-table-column
					    label="已完成">
							<template scope="scope">
							<span >{{scope.row.changed?scope.row.changed:'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column
					    label="有效FB账号数">
						<template scope="scope">
							<span >{{scope.row.valid_num?scope.row.valid_num:'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column
						width="130px"
					    label="操作">
					    <template scope="scope">
							<button class="check-info" @click="editGroup(scope.row.group_id,scope.row.name)">编辑</button>
							<svg-icon iconClass="delete" class="margin delete" @click="deleteGroup(scope.row)"/>
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
		<create-source :dialogVisible="showDialog" :groupId="groupId" :typeRadio="sourceType" :name="name" @changeStatus="closeDialog"></create-source>
    </div>
</template>

<script>
	import email from '@/api/mail';
	import task from '@/api/task-mgr';
	import { getToken, getUserType } from '@/utils/auth'
	import { MessageBox } from 'element-ui'
	import CreateSource from '@/components/CreateSource';
    export default {
        data(){
            return {
				accType:getUserType(),
				listLoading:false,
				groupId:'',
				name:'',
				showDialog:false,
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				taskObj:{},
				sourceType:1,
            }
		},
		components: {
			CreateSource
		},
		activated(){
			if ( this.$route.query.type ){
				this.sourceType = this.$route.query.type;
			}
			if ( this.accType ==3 ){
				this.$router.push({ name: 'MessageMgr' });
			}
			this.getTaskList();
		},
        methods: {
			changeType(type){
				if ( this.sourceType == type ){
					return;
				}
				this.sourceType = type;
				this.getEmailList();
			},
			handleCurrentChange(val){                           
				this.currentPage = val;
				this.getEmailList();
			},
			editGroup(group_id, name){
				this.groupId = group_id;
				this.name = name;
				this.showDialog = true;
			},
			closeDialog(data){
				this.showDialog = false;
				if ( data ){
					this.sourceType = data;
					this.getEmailList();
				}
			},
            async getEmailList(){
				var req = {
					"token":getToken(),
					"type":this.sourceType
				}
				const data = await email.getSrcGroup(JSON.stringify(req));
				if ( data.rtn == 0 ){
					var list = data.data.list || [];
					for ( var i=0; i<list.length; i++ ){
						var job_name = this.taskObj[list[i].job_id] || '--';
						this.$set(list[i], 'job_name', job_name);
					}
					this.dataList = list;
				}else {
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
			},
			async getTaskList(){
				var req = {
					"token":getToken(),
					"userid":'',
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					var list = data.data.list || [];
					for ( var i=0; i<list.length; i++ ){
						this.taskObj[list[i].job_id] = list[i].job_name;
					}
				}
				this.getEmailList();
			},
			deleteGroup(obj){
				MessageBox.confirm('是否删除该数据？', '', {
				confirmButtonText: '删除',
				showCancelButton:false,
				type: 'warning'
				}).then(() => {
					this.sendDeleteGroup(obj);
				});
			},
			async sendDeleteGroup(obj){
				var req = {
					"token":getToken(),
					"group_id":obj.group_id,
					"type":this.sourceType
				}
				const data = await email.deleteGroup(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.dataList.splice(this.dataList.findIndex(item => item.group_id === obj.group_id), 1);
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
.mail-mgr-tag{
	position:absolute;
	margin-top: 50px;
	margin-left: 19px;
	color:#74788d;
	width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
	background-color:#f0f0f0;
	border-radius: 15px;
	cursor: pointer;
}
.other-mgr-tag{
	position:absolute;
	margin-top: 50px;
    margin-left: 135px;
	color:#74788d;
	width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
	background-color:#f0f0f0;
	border-radius: 15px;
	cursor: pointer;
}
.mail-mgr-tag:hover,
.other-mgr-tag:hover,
.sel{
	transition: all, .3s;
	background-color: #7a9e9f;
	color:#ffffff;
}
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:95px;
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
		.margin{
			margin-left: 10px;
		}
		.delete{
			position: absolute;
			display:none;
			margin-top: 1px;
			width: 23px;
			height: 23px;
			cursor: pointer;
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
