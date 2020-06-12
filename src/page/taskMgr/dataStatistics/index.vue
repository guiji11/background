<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 数据统计</h2>
		<div class="echart">
			<div class="list-chart" id="echart_list"></div>
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
						prop="count"
					    label="时间">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="发送总量">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="成功数量">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="成功率">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="回复数量">
					</el-table-column>
					<el-table-column
						prop="count"
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
	import echarts from 'echarts';
    export default {
		name:"DataStatistics",
        data(){
            return {
				listLoading:false,
				myChart:'',
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[{"count":122}],
				serveNum:"0",
				serveList:[{"id":"0","name":"全部"}],
            }
        },
        mounted(){
			document.getElementById('taskMgr').classList.add("is-active");
			this.myChart = echarts.init(document.getElementById('echart_list'));
			this.lineChart([56,67,89],[51,47,89]);
        },
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(){

			},
			changeServeNum(){

			},
			returnPage(){

			},
            async getUsers(){
                const Users = await getUserList({offset: this.offset, limit: this.limit});
			},
			lineChart(dataX,dataY){                                                           //折线图
				this.myChart.setOption({
					tooltip: {
						trigger: 'axis'
					},
					legend: {         //图例名
						data:['发送总量','成功数量','回复数量','成功率','回复率']
					},
					grid: {                                                                   //折线图位置                                                  
						left: "10%",
						bottom: "0%",
						top: "0%",
						right:"10%",
						containLabel: false
					},
					xAxis: {                                                                  //横坐标轴
						type: "category",
						boundaryGap: false,
						data: ['8-1','8-2','8-3','8-4','8-5','8-6','8-7'],
						show:false,                                                           //隐藏坐标轴
					},
					yAxis: [{                                                                 //纵坐标轴
						type: 'value',
						show:false,
					}],
					series: [
						{
							name:'发送总量',
							type:'line',
							stack: '总量',
							color:['#1296db'],
							width:"1.5",					
							data:[120, 132, 101, 134, 90, 230, 210],
							
						},
						{
							name:'成功数量',
							type:'line',
							stack: '总量',
							color:['#ef8f3a'],
							width:"1.5",
							data:[220, 182, 191, 234, 290, 330, 310],
							
						},
						{
							name:'回复数量',
							type:'line',
							stack: '总量',
							color:['#7dd850'],
							width:"1.5",
							data:[150, 232, 201, 154, 190, 330, 410],
							
						},  
						{
							name:'成功率',
							type:'line',
							stack: '总量',
							color:['#4675d2'],
							width:"1.5",
							data:[420, 132, 100, 134, 90, 20, 210],
							
						},
						{
							name:'回复率',
							type:'line',
							stack: '总量',
							color:['#3C599B'],
							width:"1.5",
							data:[420, 132, 100, 134, 90, 20, 210],
							
						},  
					]
				});
			}
        },
    }
</script>

<style lang="less" scoped>
.return{
    position: absolute;
    margin-left: 19px;
    padding-top: 11px;
    height: 24px;
    width: 52px;
    cursor: pointer;
}
.title{
	position:relative;
	margin-left: 79px;
	padding-top: 15px;
	font-size: 12px;	
	color: #34404b;
}
.echart{
	position: relative;
	margin: 15px 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
	height: 240px;
	background-color: #ffffff;
	box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.04);
	border-radius: 3px;
	.list-chart{
		position: absolute;
		margin-top: 10px;
		left: 15px;
		right: 15px;
		height: 200px;
		background-color: #ffffff;
		border-radius: 3px;
	}
}
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:305px;
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
