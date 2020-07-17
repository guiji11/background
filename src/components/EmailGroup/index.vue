<template>
	<el-dialog
	:title="groupId?'编辑邮箱组':'添加邮箱组'"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-borde"
	center>
		<div class="list">
			<div class="item">
				<div class="name">邮箱组名称 : </div>
				<el-input v-model="emailName" type="text" />
			</div>
			<div class="item">
				<div class="name">邮箱列表（一行一个邮箱，回车隔开多个邮箱）: </div>
				<el-input v-model="emailList" resize="none" type="textarea"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import email from '@/api/mail';
export default {
	data:function(){
		return{
			emailList:'',
			emailName:'',
			currentIndex:this.dialogVisible,
			loading:false,
		}
	},
	props:{
		name: {
			type: String,
			required: true
		},	
		groupId: {
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
			this.emailName = this.name || '';
			this.emailList = '';
		},
	},
	methods: {
		async complete(){
			if ( !this.emailName ){
				this.$message({
					message: "请输入邮箱组名称",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			const list = this.myTrim(this.emailList).split('\n') || [];
			var req = {
				"token":getToken(),
				"group_id":this.groupId,
				"name":this.emailName,
				"list":list,
			}
			this.loading = true;
			const data = await email.addMailGroup(JSON.stringify(req));
			if ( data.rtn == 0 ){
				this.callback(true);
				this.loading = false;
				this.$message({
					message: "success",
					center: true,
					type: 'success',
					duration: 3 * 1000
				})
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

<style lang="less" scoped>
	.list-borde {                        
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
			width: 662px;
		}
		/deep/ .el-textarea__inner {
			font-size: 12px;
			height: 230px;
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
		    width: 662px;
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
