<template>
	<el-dialog
	title="封号统计"
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
						width="120px"
					    prop="time"
					    label="封号时间">
					</el-table-column>
					<el-table-column
					    prop="live_time"
					    label="存活时间">
					</el-table-column>
					<el-table-column
					    prop="acc"
					    label="账号">
					</el-table-column>
					<el-table-column
					    prop="host"
					    label="Host">
					</el-table-column>
					<el-table-column
					    label="设备ID">
						<template scope="scope">
							<el-tooltip effect="dark" :content="scope.row.did" placement="top">
								<div>{{scope.row.did}}</div>
							</el-tooltip>
						</template>	
					</el-table-column>
					<el-table-column
					    label="Ipv6">
						<template scope="scope">
							<el-tooltip effect="dark" :content="scope.row.ipv6" placement="top">
								<div>{{scope.row.ipv6}}</div>
							</el-tooltip>
						</template>	
					</el-table-column>
					<el-table-column
						width="85px"
					    label="截图">
						<template scope="scope">
							<img style="position: absolute;top:5px;cursor:pointer;height:30px;" :src="scope.row.snapshot_url" @click="snapshot(scope.row.snapshot_url)" />
						</template>	
					</el-table-column>
				</el-table>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import home from '@/api/home';
import { getToken } from '@/utils/auth'
import moment from 'moment';
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
				var start = this.getLocalTime(new Date().getTime()/1000-60*60*24);
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
			this.getSuspendInfo();
		},
		getLocalTime(nS) { 
			return new Date(parseInt(nS) * 1000);  
		},
		snapshot(url){
			if ( url ){
				window.open(url);
			}
		},
		async getSuspendInfo(){
			var req = {
				"token":getToken(),
				"begin":this.begin,
				"end":this.end,
			}
			const data = await home.getSuspendInfo(JSON.stringify(req));
			this.listLoading = false;
			if ( data.rtn == 0 ){
				var list = data.data || [];
				for ( var i=0; i<list.length;i++ ){
					this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD HH:mm'));
					var time = Math.round((list[i].ts-list[i].reg_ts)/60/60/24)+'天';
					this.$set(list[i],"live_time",time);
				}
				this.dataList = list;
			}
		}
	}	
}			
</script>

<style lang="less" scoped>
	.list-border /deep/{                        
		/deep/ .el-dialog {
			width: 876px;
			height: 560px;
		}
    }
    .list{
	    position: relative;
	    margin-left: 47px;
	    margin-top: 10px;
	    width: 786px;
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
