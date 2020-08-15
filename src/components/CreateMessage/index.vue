<template>
	<el-dialog
	:title="title"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font class="name">目标消息数 : </font>
				<el-input style="margin-left:14px;" v-model="count" type="text" placeholder="群发数量"/>
			</div>
			<div class="item">
				<font class="name">重发次数 : </font>
				<el-input v-model="retryTimes" type="text" placeholder="重发上限，非必填项"/>
			</div>
			<div class="item">
				<font class="name">重发间隔(天) : </font>
				<el-input style="margin-left:6px;" v-model="retryduration" type="text" placeholder="每间隔几天，若对方没回复则再次重发，非必填项"/>
			</div>			
			<div class="item">
				<font style="line-height: 200px;" class="name">消息内容 : </font>
				<el-input v-model="msg" resize="none" type="textarea"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import task from '@/api/task-mgr';
export default {
	data:function(){
		return{
			currentIndex:this.dialogVisible,
			msg:'',
			count:'',
			retryTimes:'',
			retryduration:'',
			loading:false,
		}
	},
	props:{
		info: {
		  type: Object,
		  required: true
		},
		title: {
		  type: String,
		  required: true
		},
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
			this.count = this.info.quota || '';
			this.msg = this.info.msg || '';
			this.loading = false;
		},
		info:function(data){//监听属性变化
			this.count = this.info.quota || '';
			this.retryTimes = this.info.retry_times || '';
			this.retryduration = this.info.retry_interval || '';
			this.msg = this.info.msg || '';
		},
	},
	methods: {
		async complete(){
			if ( !this.msg ){
				this.$message({
					message: "请输入消息内容",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}else if ( this.msg.indexOf('http')!=-1 || this.msg.indexOf('www')!=-1){
				this.$message({
					message: "消息内容不能包含Url链接",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}else if ( this.info.msg_id && this.count < this.info.quota ){
				this.$message({
					message: "编辑下消息数不能小于之前已设定目标消息数 "+this.info.quota,
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
				return;
			}
			var req = {
				"token":getToken(),
				"job_id":this.job_id,
				"msg_id": this.info.msg_id || "",
				"msg":this.myTrim(this.msg),
				"quota":Number(this.count || 1),
				"retry_times":Number(this.retryTimes || 0),
				"retry_interval":Number(this.retryduration || 0),
			}
			this.loading = true;
			const data = await task.setMess(JSON.stringify(req));
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
		myTrim(x) {
			return x.replace(/^\s+|\s+$/gm,'');
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
			width: 826px;
			height: 560px;
		}	
		/deep/ .el-input__inner{
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-input{
			width: 583px;
			margin-left: 27px;
		}
		/deep/ .el-textarea {
			width: 582px;
			margin-left: 28px;
		}
		/deep/ .el-textarea__inner {
			font-size: 12px;
			height: 200px;
		}
		/deep/ .el-dialog--center .el-dialog__footer .el-button--primary,
		/deep/ .el-dialog--center .el-dialog__footer{
			width: 280px;
			height: 48px;
		}
    }
    .list{
		position: relative;
		margin-left: 65px;
		margin-top: 20px;
		width: 736px;
		height: 380px;
    	.item{
    		position:relative;
    		margin-top: 18px;
		    width: 705px;
			.name{
				margin-left: 0px;
				z-index: 1;
				line-height: 38px;
				font-size: 12px;
				font-weight: 500;
				font-stretch: normal;
				letter-spacing: 0.36px;
				color: #74788d;
			}
    	}
    }
</style>
