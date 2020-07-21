<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 数据统计</h2>
		<div class="table-title">
			<div class="table-item">
				<font class="title">日期选择 ：</font>
				<el-date-picker
					v-model="dateArr"
					@change = changeTime
					value-format="yyyy-MM-dd"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期">
				</el-date-picker>
			</div>
		</div>
		<div class="echart">
			<div class="list-chart" id="echart_bar"></div>
			<div class="list-chart" style="background-color: #172b4d" id="echart_line"></div>
		</div>
		<div class="list">
			<div class="table-content">
				<el-table
					v-loading="listLoading"
					height="100%"
					element-loading-text="Loading"
					:data="dataList"
					tooltip-effect="dark">
					<el-table-column
						prop="name"
					    width="200px">
						<template slot="header" slot-scope="scope">
							<div class="table-item">
								<font class="title">任务名</font>
								<el-select v-model="taskId" placeholder="全部" @change="changeTask" class="select-border"  >
									<el-option
										v-for="item in taskList"
										:key="item.job_id"
										:label="item.job_name"
										:value="item.job_id" >
									</el-option>
								</el-select>
							</div>
						</template>
					</el-table-column>
					<el-table-column
						prop="date"
					    label="时间">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="发送总量">
					</el-table-column>
					<el-table-column
						prop="succ_send_num"
					    label="成功数量">
					</el-table-column>
					<el-table-column
					    label="成功率">
						<template scope="scope">
							<span >{{scope.row.succ_send_per}}%</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="reply_num"
					    label="回复数量">
					</el-table-column>
					<el-table-column
					    label="回复率">
						<template scope="scope">
							<span >{{scope.row.reply_per}}%</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="table-pagination">
				<el-pagination
					@current-change="handleCurrentChange"
					:current-page.sync="currentPage"
					:page-size="pageSize"
					background
					layout="prev, pager, next"
					:page-count="pageTotal">
				</el-pagination>
			</div>
		</div>
    </div>
</template>

<script>
	import task from '@/api/task-mgr';
	import { getToken, getJobId, setJobId, getUserType, getUserId } from '@/utils/auth';
	import echarts from 'echarts';
	import moment from 'moment';
    export default {
		name:"DataStatistics",
        data(){
            return {
				listLoading:true,
				myChartLine:'',
				myChartBar:'',
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				taskList:[],
				taskId:"",
				jobId:getJobId(),
				taskTime:[],
				succ_send_sum:[],
				reply_num:[],
				succ_send_per:[],
				reply_per:[],
				send_num:[],
				remain_quota:[],
				accType:getUserType(),
				userid:"",
				dateArr:'',
				begin:"",
				end:"",
            }
		},
		created(){
			var start = this.getLocalTime(new Date().getTime()/1000-60*60*24*9);
			this.dateArr=[moment(start).format('YYYY-MM-DD'),moment(new Date()).format('YYYY-MM-DD')];
			this.getTaskList();
		},
        mounted(){
			if ( this.accType ==3 ){
				this.$router.push({ name: 'MessageMgr' });
			}
			document.getElementById('taskMgr').classList.add("is-active");
		},
		destroyed(){
			document.getElementById('taskMgr').classList.remove("is-active");
		},
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			getLocalTime(nS) { 
				return new Date(parseInt(nS) * 1000);  
			},
			changeTime(){
				this.begin = this.dateArr[0];
				this.end = this.dateArr[1];
				this.getStatisticsList();
			},
			changeTask(){
				this.jobId = this.taskId;
				setJobId(this.taskId);
				this.getStatisticsList();
            },
			returnPage(){
				this.$router.push({ name: "TaskMgr" }); 
			},
            async getStatisticsList(){
              	var req = {
					"token":getToken(),
					"job_id":this.jobId,
					"from":this.begin,
					"to":this.end
				}
				const data = await task.getStatis(JSON.stringify(req));
				this.listLoading = false;
				if ( data.rtn ==0 ){
					this.taskTime = [];
					this.succ_send_sum = [];
					this.reply_num = [];
					this.succ_send_per = [];
					this.reply_per = [];
					this.send_num = [];
					this.remain_quota = [];
					const obj = this.taskList.find( value =>value.job_id == this.jobId);
					var list = data.data.list || [];
					for ( var i=0; i<list.length;i++ ){
						var reply_per = 0;
						var succ_send_per = 0;
						if ( list[i].send_num >0 ){
							succ_send_per = Math.round(list[i].succ_send_num/list[i].send_num*1000)/10;
						}
						if ( list[i].succ_send_num >0 ){
							reply_per = Math.round(list[i].reply_num/list[i].succ_send_num*1000)/10;
						}
						this.$set(list[i],"reply_per",reply_per);
						this.$set(list[i],"succ_send_per",succ_send_per);
						this.$set(list[i],"name",obj.job_name);
						this.setEchartData(list[i]);
					}
					this.dataList = list;
					this.initChart();
				}
			},
			async getTaskList(){
				if ( this.accType !=1 ){
					this.userid = getUserId();
				}
				var req = {
					"token":getToken(),
					"userid":this.userid
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.taskList = data.data.list || [];
					this.taskId = this.jobId;
				}else{
					if ( data.msg.indexOf('nvalid token')!=-1 ){
						data.msg = "身份验证过期，请重新登录！";
					}
					this.$message({
						message: data.msg,
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
				}
				this.changeTime();
			},
			setEchartData(obj){
				this.taskTime.unshift(obj.date);
				this.succ_send_sum.unshift(obj.succ_send_num);
				this.reply_num.unshift(obj.reply_num);
				this.succ_send_per.unshift(obj.succ_send_per);
				this.reply_per.unshift(obj.reply_per);
				this.send_num.unshift(obj.send_num);
				this.remain_quota.unshift(obj.remain_quota);
			},	
			initChart(){
				this.myChartLine = echarts.init(document.getElementById('echart_line'));
				this.myChartBar = echarts.init(document.getElementById('echart_bar'));
				var lineArr=[
					{"name":"成功率","width":3,"type":"line","color":"#5e72e4","data":this.succ_send_per},
					{"name":"回复率","width":3,"type":"line","color":"#a0650b","data":this.reply_per},
				];
				var barArr=[
					{"name":"发送总量","type":"bar","color":"#fb6340","data":this.send_num},
					{"name":"成功数量","type":"bar","color":"#5e72e4","data":this.succ_send_sum},
					{"name":"回复数量","type":"bar","color":"#a0650b","data":this.reply_num},
				];
				this.lineChart(this.myChartLine, this.taskTime, lineArr, 1);
				this.lineChart(this.myChartBar, this.taskTime, barArr, 2);
			},
			lineChart(show, dataX, dataY, type){                                                    
				this.lineDataStyle(dataY);
				if ( type ==1 ){
					var legend = {
						textStyle: {
							fontSize: 12,
							color: '#ffffff'
						},
						data:['成功率','回复率']
					}
				}else if ( type ==2 ){
					var legend = {
						data:['发送总量','成功数量','回复数量']
					}
				}
				show.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: legend,                                                           //图例名
					grid: {                                                                   //折线图位置                                                  
						left: "5%",
						bottom: "3%",
						top: "12%",
						right:"5%",
						containLabel: false
					},
					xAxis: {                                                                  //横坐标轴
						type: "category",
						boundaryGap: false,
						data: dataX,
						show:false,                                                           //隐藏坐标轴
					},
					yAxis: [{                                                                 //纵坐标轴
						type: 'value',
						show:false,
					}],
					series: this.series
				});
			},
			lineDataStyle(arr){
				this.series = [];
				for ( var i=0; i<arr.length;i++ ){
					var obj = {
						type: arr[i].type,
						name:arr[i].name,
						barWidth:15,
						symbol: 'none',                                                       //拐点标记隐藏掉
						smooth:true,                                                          //拐点平滑
						itemStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
									offset: 0,
									color: arr[i].color
								}]),
								lineStyle: { width:arr[i].width }
							},
						},		
						data:arr[i].data,					
					};
					this.series.push(obj);
				}
			},
        },
    }
</script>

<style lang="less" scoped>
.return{
    position: absolute;
    margin-left: 18px;
    padding-top: 11px;
    height: 24px;
    width: 24px;
    cursor: pointer;
}
.title{
	position:relative;
	margin-left: 49px;
	padding-top: 15px;
	font-size: 12px;	
	color: #34404b;
}
.echart{
	position: relative;
	margin: 15px 19px;
    display: flex;
    justify-content:space-between;
    cursor: default;
	height: 310px;
	.list-chart{
		position: relative;
		padding-top: 10px;
		width:49%;
		height: 300px;
		background-color: #ffffff;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 6px 10px -4px rgba(0, 0, 0, 0.15);
	}
}
.table-title{
	position: relative;
	margin-top: 13px;
    left: 0px;
    right: 320px;
    height: 34px;
	.table-item{
		margin-right: 21px;
		float:left;
		.title{
			position: relative;
			margin-left: 19px;
			padding-top: 15px;
			margin-right: 9px;
			font-weight: 500;
			font-size: 12px;
			font-stretch: normal;
			letter-spacing: 0.36px;
			color: #595d6e;
		}
		.select-border{
			width: 136px;
			height: 34px;
			background-color: #ffffff;
			border-radius: 4px;
		}
	}
}
.list {
	position: absolute;
	left:19px;
	right:19px;
	top:420px;
	bottom:20px;
	border-radius: 4px;
	.table-content{
		position: absolute;
		width:100%;
		top: 0px;
		bottom: 40px;
		box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.04);
		border-radius: 4px;
		.check-info{
			position: relative;
			padding: 4px 13px;
			background-color: #ffffff;
			border: solid 1px #e7e7e7;
			border-radius: 19px;
			font-size: 12px;
			color: #828f9c;
			cursor:pointer;
		}
		.table-item{
			padding-left: 0px;
			margin-right: 21px;
			float:left;
			.title{
				position: relative;
				margin-left: 0px;
				padding-top: 15px;
				margin-right: 0px;
				font-weight: 500;
				font-size: 12px;
				font-stretch: normal;
				letter-spacing: 0.36px;
				color: #595d6e;
			}
			.select-border {
				padding-left: 10px;
				width: 116px;
				height: 34px;
				background-color: #ffffff;
				border-radius: 4px;
			}
		}
	}
	.table-pagination /deep/{
		position: absolute;
		bottom: 0px;
		left: 0px;
		right: 0px;
		margin-top: 5px;
		text-align: center;
		height: 27px;
		.el-pagination{
			padding: 0 0;
		}
	}
}
</style>
