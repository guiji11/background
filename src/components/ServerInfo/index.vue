<template>
	<el-dialog
	title="历史详情"
	:visible.sync="currentIndex"
	@close ="callback()"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark"
					height="451px"
					class="table-dark">
					<el-table-column
					    prop="date"
					    label="时间">
					</el-table-column>
					<el-table-column
					    prop="succ_send_num"
					    label="发消息数">
					</el-table-column>
					<el-table-column
					    prop="reply_num"
					    label="回复数">
					</el-table-column>
					<el-table-column
					    prop="suspend_num"
					    label="封号数">
					</el-table-column>
				</el-table>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import home from '@/api/home';
import { getToken } from '@/utils/auth'
export default {
	data:function(){
		return{
			currentIndex:this.dialogVisible,
			listLoading:true,
			dataList:[],
		}
	},
	props:{
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
			if ( this.currentIndex ){
				this.getServerInfo();
			}
		},
	},
	methods: {
		callback(){		
			this.$emit('changeStatus',false);
		},
		async getServerInfo(){
			var req = {
				"token":getToken(),
				"hostname":this.hostname,
			}
			const data = await home.getServerInfo(JSON.stringify(req));
			this.listLoading = false;
			if ( data.rtn == 0 ){
				this.dataList = data.data.list || [];
			}
		}
	}	
}			
</script>

<style lang="less" scoped>
	.list-border /deep/{                        
		.el-dialog {
			width: 826px;
			height: 560px;
		}	
    }
    .list{
	    position: relative;
	    margin-left: 47px;
	    margin-top: 10px;
	    width: 736px;
	    height: 480px;
    	.chip-title{
    		position: relative;
    		left:0px;
    		margin-bottom: 12px;
			font-size: 12px;
			font-weight: 600;
			font-stretch: normal;
			letter-spacing: 0.36px;
			color: #74788d;
    	}
    	.table-content{
	        position: relative;
	        border: solid 1px #ebedf2;
	        border-radius: 4px;
	        height: 450px;
		    .table-dark{
	            position: relative;
	            width:97%;
	            left:50%;
	            transform: translateX(-50%);
	        }
        }
    }
</style>
