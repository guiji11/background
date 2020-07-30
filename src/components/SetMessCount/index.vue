<template>
	<el-dialog
	title="设置消息发送总量"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font>目标消息数 : </font>
				<el-input v-model="num" type="text"/>
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
			num:"",
			currentIndex:this.dialogVisible,
			loading:false,
		}
	},
	props:{
		info: {
		  type: Object,
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
			this.num = this.info.total_send_num || "";
			this.loading = false;
		},
	},
	methods: {
		async complete(){
			var req = {
				"token":getToken(),
				"userid":this.info.userid,
				"num":Number(this.num || 0 )
			}
			this.loading = true;
			const data = await task.setUserSendNum(JSON.stringify(req));
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
			margin-left: 75px;
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-input{
			width: 205px;
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
		margin-top: 60px;
		width: 410px;
		height: 160px;
    	.item{
    		position:relative;
    		margin-top: 18px;
		    width: 280px;
			height: 38px;
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
