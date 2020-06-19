<template>
	<el-dialog
	title="创建消息"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font>消息内容 : </font>
				<el-input v-model="msg" resize="none" type="textarea"/>
			</div>
			<div class="item">
				<font>消息数 : </font>
				<el-input v-model="count" type="text"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary"  @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import task from '@/api/task-mgr';
export default {
	data:function(){
		return{
			msg:"",
			count:"",
			currentIndex:this.dialogVisible,
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
		},
	},
	methods: {
		async complete(){
			var req = {
				"token":getToken(),
				"job_id":this.job_id,
				"msg":this.msg,
				"quota":Number(this.count || 0)
			}
			const data = await task.setMess(JSON.stringify(req));
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
			height: 380px;
		}	
		/deep/ .el-input__inner{
			margin-left: 65px;
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-input{
			width: 280px;
		}
		/deep/ .el-textarea__inner {
			margin-left: 65px;
			font-size: 12px;
			height: 80px;
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
		margin-top: 40px;
		width: 410px;
		height: 200px;
    	.item{
    		position:relative;
    		margin-top: 18px;
		    width: 280px;
			height: 80px;
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
    	}
    }
</style>
