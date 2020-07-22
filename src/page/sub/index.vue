<template>
    <div class="fillcontain">
		<h2 class="title">子账号管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建子账号</el-button>
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
					    label="用户名">
					</el-table-column>
					<el-table-column
						prop="pwd"
					    label="密码">
					</el-table-column>
					<el-table-column
						prop="status"
						v-if="accType==2"
					    label="状态">
						<template scope="scope">
							<span :style="scope.row.status==0?'color:#3092fc':'color:#ff8f5e'">{{scope.row.status==0?'启用中':'已禁止'}}</span>
						</template>
					</el-table-column>
					<el-table-column
						width="120px"
						v-if="accType==2"
					    label="操作">
						 <template scope="scope">
							<button class="check-info" :style="scope.row.status==0?'color:#ff8f5e':'color:#3092fc'" @click="manageUser(scope.row)">{{scope.row.status==0?'禁用':'启用'}}</button>
							<svg-icon iconClass="delete" class="margin delete" @click="manageUser(scope.row,-2)"/>
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
		<sub-acc :dialogVisible="showSourceDialog" @changeStatus="closeDialog"></sub-acc>
    </div>
</template>

<script>
	import SubAcc from '@/components/SubAcc';
	import sub from '@/api/sub'; 
	import { getToken, getUserType } from '@/utils/auth';
	import moment from 'moment';
	import { MessageBox } from 'element-ui';
    export default {
		name:"DataMess",                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
        data(){
            return {
				listLoading:true,
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				taskId:"",
				showSourceDialog:false,
				accType:getUserType(),
            }
		},
		components: {
			SubAcc,
		},
        mounted(){
			if ( this.accType ==3 ){
				this.$router.push({ name: 'MessageMgr' });
			}
			this.getAllUser();
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			showDialog(){
				this.showSourceDialog = true;
			},
			closeDialog(data){
				this.showSourceDialog = false;
				if ( data ){
					this.getAllUser();
				}
			},
			manageUser(obj,status){
				if ( !status ){
					status = 0;
					if ( obj.status ==0 ){
						status = -1;
					}
					this.sendUserData(obj, status);
				}else{
					MessageBox.confirm('是否删除该子账号？', '', {
					confirmButtonText: '删除',
					showCancelButton:false,
					type: 'warning'
					}).then(() => {
						this.sendUserData(obj, status);
					});
				}
			},
			async sendUserData(obj, status){
				var req = {
					"token":getToken(),
					"userid":obj.userid,
					"opt":status
				}
				const data = await sub.manageUser(JSON.stringify(req));
				if ( data.rtn ==0 ){
					if ( status !=-2 ){
						this.$set(obj,"status",status);
					}else{
						this.dataList.splice(this.dataList.findIndex(item => item.userid === obj.userid), 1);
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
			async getAllUser(){
				var req = {
					"token":getToken()
				}
				const data = await sub.getAllUser(JSON.stringify(req));
				this.listLoading = false;
				if ( data.rtn ==0 ){
					this.dataList = data.data.list || [];
					this.dataList.sort((a,b) => a.name.localeCompare(b.name));
					var index = this.dataList.findIndex(item => item.name === 'admin');
					if ( index >-1 ){
						this.dataList.splice(index, 1);
					}
				}
			},		
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
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:65px;
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
			margin-left: 12px;
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
