<template>
	<el-dialog
	title="创建任务"
	:visible.sync="currentIndex"
	@close ="callback()"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="item">
				<font>任务名 : </font>
				<el-input v-model="taskName" type="text"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary"  @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken, getUserId } from '@/utils/auth';
export default {
	data:function(){
		return{
			taskName:"",
			currentIndex:true,
		}
	},
	methods: {
		complete(){

		},
		callback(){
			this.$emit('changeStatus',false);	
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
			margin-left: 55px;
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
