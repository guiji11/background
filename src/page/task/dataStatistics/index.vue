<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 数据统计</h2>
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
						prop="time"
					    label="时间">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="发送总量">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="成功数量">
					</el-table-column>
					<el-table-column
						prop="send_num"
					    label="成功率">
					</el-table-column>
					<el-table-column
						prop="reply_num"
					    label="回复数量">
					</el-table-column>
					<el-table-column
						prop="reply_per"
					    label="回复率">
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
	import { getToken, getJobId, setJobId } from '@/utils/auth';
	import moment from 'moment';
	import echarts from 'echarts';
    export default {
		name:"DataStatistics",
        data(){
            return {
				listLoading:false,
				myChartLine:'',
				myChartBar:'',
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[],
				taskList:[],
				taskId:"",
				jobId:getJobId(),
				arr:[
					{"name":"成功数量","width":3,"type":"line","color":"#5e72e4","data":[210,150,367,200,400]},
					{"name":"回复数量","width":3,"type":"line","color":"#a0650b","data":[110,50,267,100,300]},
					{"name":"成功率","width":3,"type":"line","color":"#0ca563","data":[310,200,267,400,300]},
					{"name":"回复率","width":3,"type":"line","color":"#f4f5f7","data":[50,250,567,100,300]},
				]
            }
		},
		created(){
			this.getTaskList();
			this.getStatisticsList();
		},
        mounted(){
			document.getElementById('taskMgr').classList.add("is-active");
			this.myChartLine = echarts.init(document.getElementById('echart_line'));
			this.myChartBar = echarts.init(document.getElementById('echart_bar'));
			this.lineChart(this.myChartLine ,[56,67,89,78,90],this.arr,1);
			this.lineChart(this.myChartBar ,[56,67,89,78,90],[{"name":"发送总量","type":"bar","color":"#fb6340","data":[210,150,367,200,400]}],2);
        },
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
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
					"job_id":this.jobId
				}
				const data = await task.getMess(JSON.stringify(req));
				if ( data.rtn ==0 ){
					const obj = this.taskList.find( value =>value.job_id == this.taskId);
					var list = data.data.list || [];
					for ( var i=0; i<list.length;i++ ){
						var reply_per = 0;
						if ( list[i].succ_send_sum >0 ){
							reply_per = Math.round(list[i].reply_num/list[i].succ_send_sum*100);
						}
						this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD'));
						this.$set(list[i],"reply_per",reply_per+"%");
						this.$set(list[i],"name",obj.job_name);
					}
					this.dataList = list;
				}
			},
			async getTaskList(){
				var req = {
					"token":getToken()
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.taskList = data.data.list || [];
					this.taskId = this.jobId;
				}
            },	
			lineChart(show, dataX, dataY, type){                                                      
				this.lineDataStyle(dataY);
				if ( type ==1 ){
					var legend = {
						textStyle: {
							fontSize: 12,
							color: '#ffffff'
						},
						data:['成功数量','回复数量','成功率','回复率']
					}
				}else if ( type ==2 ){
					var legend = {
						data:['发送总量']
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
	height: 280px;
	.list-chart{
		position: relative;
		padding-top: 10px;
		width:49%;
		height: 270px;
		background-color: #ffffff;
		border-radius: 6px;
		overflow: hidden;
		box-shadow: 0 6px 10px -4px rgba(0, 0, 0, 0.15);
	}
}
.list {
	position: absolute;
	left:19px;
	right:19px;
	top:345px;
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
