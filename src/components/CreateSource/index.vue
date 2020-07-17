<template>
	<el-dialog
	title="创建数据源"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<el-radio v-model="radio" label="1">输入小组ID</el-radio>
			<el-radio v-model="radio" label="2">选择邮箱组</el-radio>
			<div class="item" v-show="radio==1">
				<font>输入小组ID : </font>
				<el-input v-model="taskName" type="text" class="select-border"/>
			</div>
			<div class="item" v-show="radio==2&&dataList.length>0">
				<font>选择邮箱组 : </font>
				<el-select v-model="emailGroupId" class="select-border" >
					<el-option
						v-for="item in dataList"
						:key="item.group_id"
						:label="item.name"
						:value="item.group_id" >
					</el-option>
				</el-select>
			</div>
			<div class="item" v-show="radio==2&&dataList.length==0"><font style="position: relative;">无可用的邮箱组，</font><font @click="mail()" style="position: relative;color:#3092fc;cursor:pointer;">去添加-></font></div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import task from '@/api/task-mgr';
import email from '@/api/mail';
export default {
	data:function(){
		return{
			currentIndex:this.dialogVisible,
			dataList:[],
			radio:'1',
			taskName:'',
			emailGroupId:'',
			loading:false,
		}
	},
	props:{
		job_id: {
		  type: String,
		  required: true
		},
		dialogVisible: {
		  type: Boolean,
		  required: true
		},
	},
	watch:{
		dialogVisible:function(data){//监听属性变化
			this.currentIndex = data;
			this.taskName = "";
			this.radio = '1';
			if ( data ){
				this.getEmailList();
			}
		},
	},
	methods: {
		async complete(){
			if ( this.radio == 2 ){
				this.bindMailGroup();
				return;
			}
			if ( !this.taskName ){
				this.$message({
					message: "请输入小组ID",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			var req = {
				"token":getToken(),
				"job_id":this.job_id,
				"fb_group_id":this.taskName
			}
			this.loading = true;
			const data = await task.setSource(JSON.stringify(req));
			if ( data.rtn == 0 ){
				this.callback(true);
				this.loading = false;
			}else {
				this.loading = false;
				this.$message({
					message: data.msg,
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
			}
		},
		async bindMailGroup(){
			if ( !this.emailGroupId ){
				this.$message({
					message: "请选择邮件组",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			var req = {
				"token":getToken(),
				"job_id":this.job_id,
				"group_id":this.emailGroupId
			}
			const data = await email.bindMailGroup(JSON.stringify(req));
			if ( data.rtn == 0 ){
				this.callback(true);
			}else {
				this.$message({
					message: data.msg,
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
			}
		},
		async getEmailList(){
			this.dataList = [];
			var req = {
				"token":getToken()
			}
			const data = await email.getMailGroup(JSON.stringify(req));
			if ( data.rtn == 0 ){
				var list = data.data.list || [];
				for ( var i=0; i<list.length; i++ ){
					if ( !list[i].job_id ){
						this.dataList.push(list[i]);
					}
				}
				if ( this.dataList.length > 0 ){
					this.emailGroupId = this.dataList[0].group_id;
				}
			}else {
				this.$message({
					message: data.msg,
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
			}
		},
		mail(){
			this.callback(false);
			this.$router.push({ name: 'Mail' });
		},
		callback(data){
			this.$emit('changeStatus',data);	
			this.currentIndex = false;
		},
	}	
}			
</script>

<style lang="less" scoped="">
	.list-border {                        
		/deep/ .el-dialog {
			width: 540px;
			height: 360px;
		}	
		/deep/ .el-input__inner{
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-dialog--center .el-dialog__footer .el-button--primary,
		/deep/ .el-dialog--center .el-dialog__footer{
			width: 280px;
			height: 48px;
		}
    }
    .list{
		position: relative;
		margin-left: 130px;
		margin-top: 25px;
		width: 410px;
		height: 180px;
    	.item{
    		position:relative;
    		margin-top: 55px;
		    width: 280px;
			height: 38px;
			text-align: center;
			font{
				position:absolute;
				margin-left: 0px;
				z-index: 1;
				line-height: 38px;
				font-size: 12px;
				font-weight: 500;
				font-stretch: normal;
				letter-spacing: 0.36px;
				color: #74788d;
			}
			.select-border{
				margin-left: 75px;
				width: 205px;
			}
    	}
    }
</style>
