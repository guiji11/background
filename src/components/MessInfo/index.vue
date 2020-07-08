<template>
	<el-dialog
	title="发送消息统计"
	:visible.sync="currentIndex"
	@close ="callback()"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<div class="list">
			<span>日期选择 ：</span>
			<el-date-picker
				v-model="timeArr"
				@change = timeChange
				type="datetimerange"
				format="yyyy-MM-dd HH:mm"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期">
			</el-date-picker>
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark"
					height="421px"
					class="table-dark">
					<el-table-column
					    prop="send_num"
					    label="发送总数">
					</el-table-column>
					<el-table-column
					    prop="succ_send_num"
					    label="成功发送数">
					</el-table-column>
					<el-table-column
					    prop="dispatch_failed_num"
					    label="下发失败数">
					</el-table-column>
					<el-table-column
					    prop="failed_num"
					    label="发送失败数">
					</el-table-column>
					<el-table-column
					    prop="timeout_num"
					    label="超时个数">
					</el-table-column>
					<el-table-column
					    prop="succ_send_per"
					    label="成功率">
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
			timeArr:'',
			begin:0,
			end:0,
		}
	},
	props:{
		dialogVisible: {
		  type: Boolean,
		  required: true
		},
	},
	watch:{
		dialogVisible:function(data){//监听属性变化
			this.currentIndex = data;
			if ( this.currentIndex ){
				var start = this.getLocalTime(new Date().getTime()/1000-60*60);
				this.timeArr=[start,new Date()];
				this.timeChange();
			}
		},
	},
	methods: {
		callback(){		
			this.$emit('changeStatus',false);
		},
		timeChange(){
			this.begin = parseInt(new Date(this.timeArr[0]).getTime()/1000);
			this.end = parseInt(new Date(this.timeArr[1]).getTime()/1000);
			this.getMessInfo();
		},
		getLocalTime(nS) { 
			return new Date(parseInt(nS) * 1000);  
		},
		async getMessInfo(){
			var req = {
				"token":getToken(),
				"begin":this.begin,
				"end":this.end,
			}
			const data = await home.getMessInfo(JSON.stringify(req));
			this.listLoading = false;
			if ( data.rtn == 0 ){
				var list = data.data || {};
				list = [list];
				for ( var i=0; i<list.length;i++ ){
					var succ_send_per = 0;
					if ( list[i].send_num >0 ){
						succ_send_per = Math.round(list[i].succ_send_num/list[i].send_num*1000)/10;
					}
					this.$set(list[i],"succ_send_per",succ_send_per+"%");
				}
				this.dataList = list;
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
			height: 420px;
			margin-top: 15px;
		    .table-dark{
	            position: relative;
	            width:97%;
	            left:50%;
	            transform: translateX(-50%);
	        }
        }
	}
</style>
