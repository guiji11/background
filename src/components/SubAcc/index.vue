<template>
	<el-dialog
	title="创建子账号"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font>账号 : </font>
				<el-input v-model="username" type="text"/>
			</div>
			<div class="item">
				<font>密码 : </font>
				<el-input v-model="psw" type="text"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken, getUserType } from '@/utils/auth';
import sub from '@/api/sub';
export default {
	data:function(){
		return{
			currentIndex:this.dialogVisible,
			loading:false,
			accType:getUserType(),
			username:"",
			psw:"",
		}
	},
	props: {
		dialogVisible: {
		  type: Boolean,
		  required: true
		},
	},
	watch:{
		dialogVisible:function(data){//监听属性变化
			this.currentIndex = data;
			this.loading = false;
		},
	},
	methods: {
		complete(){
			if ( !this.username || !this.psw  ){
				this.$message({
					message: "请先填写完整资料",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			this.createSubAcc();
		},
		createSubAcc(){
			var type = 3;
			if ( this.accType ==1 ){
				var type = 2;
			}
			var req = {
				"token":getToken(),
				"name":this.myTrim(this.username),
				"pwd":this.myTrim(this.psw),
				"type":type
			}
			this.loading = true;
			sub.addUser(JSON.stringify(req)).then(data=>{
				if ( data.rtn == 0 ){
					this.callback(true);
					this.loading = false;
				}else{
					this.loading = false;
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
			})
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
	.list-border /deep/{                        
		/deep/ .el-dialog {
			width: 540px;
			height: 380px;
		}	
		/deep/ .el-input__inner{
			height: 38px;
			padding-left: 55px;
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
		margin-top: 50px;
		width: 410px;
		height: 200px;
    	.item{
    		position:relative;
    		margin-top: 18px;
		    width: 280px;
			height: 38px;
			font{
				position:absolute;
				margin-left: 10px;
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
