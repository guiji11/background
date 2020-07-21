<template>
	<el-dialog
	title="分配客服"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-borde"
	center>
		<div class="list">
			<div class="name">子账号列表：</div>
			<div class="item" v-if ="dataList.length>0">
				<div v-for="item in dataList" :key="item.userid" :class="['tag-name',item.selType==1?'sel':'']" @click="selAcc(item)">{{item.name}}</div>
			</div>
			<div class="item" v-else style="text-align: center;line-height: 150px;">
				<font>无可用的客服列表，</font>
				<font @click="mail()" style="color:#3092fc;cursor:pointer;">去添加-></font>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import sub from '@/api/sub';
export default {
	data:function(){
		return{
			dataList:'',
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
			this.loading = false;
			this.currentIndex = data;
			if ( data ){
				this.getAllUser();
			}
		},
	},
	methods: {
		mail(){
			this.callback(false);
			this.$router.push({ name: 'Sub' });
		},
		selAcc(obj){
			if ( obj.selType == 1 ){
				this.$set(obj, "selType", 0);
			}else{
				this.$set(obj, "selType", 1);
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
				if ( this.info.uids ){                                                            //勾选已分配客服
					var arr = this.info.uids.split(',');
					for ( var i=0; i<arr.length; i++ ){
						var index = this.dataList.findIndex(item => item.userid === arr[i]);
						if ( index > -1 ){
							this.$set(this.dataList[index], "selType", 1);
						}
					}
				}
			}
		},
		async complete(){
			var arr = [];
			for ( var i=0; i<this.dataList.length; i++ ){
				if ( this.dataList[i].selType == 1 ){
					arr.push(this.dataList[i].userid);
				}
			}
			if ( arr.length==0 ){
				this.$message({
					message: "请选择子账号",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			var req = {
				"token":getToken(),
				"uids":arr,
				"job_id":this.info.job_id,
			}
			this.loading = true;
			const data = await sub.assignTask(JSON.stringify(req));
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
			width: 540px;
			height: 360px;
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
			height: 215px;
		}
		/deep/ .el-dialog--center .el-dialog__footer .el-button--primary,
		/deep/ .el-dialog--center .el-dialog__footer{
			width: 280px;
			height: 48px;
		}
    }
    .list{
		position: relative;
		margin-left: 30px;
		width: 480px;
		height: 210px;
		.name{
			position: relative;
			margin-left: 0px;
			line-height: 30px;
			font-size: 12px;
			font-weight: 500;
			font-stretch: normal;
			letter-spacing: 0.36px;
			color: #74788d;
		}
		.item{
			position: relative;
			margin-top: 8px;
			height: 175px;
			overflow-x:hidden;
			overflow-y: auto;
			.tag-name{
				position: relative;
				float:left;
				padding: 5.5px 10px;
				margin-right: 10px;
				margin-bottom: 10px;
				background-color: #f5f6f8;
				border-radius: 4px; 
				font-size: 12px;
				font-weight: 500;
				color: #74788d;
				cursor: pointer;
				max-width: 240px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.tag-name:hover,
			.sel{
				transition: all, .3s;
				background-color:#7a9e9f;
				color: #ffffff;
			}
			font{
				position:relative;
				font-size: 12px;
				font-weight: 500;
				color: #74788d;
			}
		}
    }
</style>
