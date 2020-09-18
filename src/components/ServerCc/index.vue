<template>
	<el-dialog
	title="编辑机器并发数"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font>IPV6并发数 : </font>
				<el-input v-model="taskName" type="text"/>
			</div>
			<div class="item">
				<font>IPV4并发数 : </font>
				<el-input v-model="taskIpv4" type="text"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary"  @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import home from '@/api/home';
export default {
	data:function(){
		return{
			taskName:0,
			taskIpv4:0,
			currentIndex:this.dialogVisible,
		}
	},
	props:{
		ccNum: {
		  type: Number,
		  required: true
		},
		ccNumIpv4: {
		  type: Number,
		  required: true
		},
		hostname: {
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
			this.taskName = this.ccNum;
			this.taskIpv4 = this.ccNumIpv4;
		},
	},
	methods: {
		async complete(){
			var req = {
				"token":getToken(),
				"host":this.hostname,
				"cc_num":Number(this.taskName),
				"ipv4_cc_num":Number(this.taskIpv4),
			}
			const data = await home.setServerCc(JSON.stringify(req));
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
			height: 360px;
		}	
		/deep/ .el-input__inner{
			margin-left: 78px;
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-input{
			width: 225px;
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
