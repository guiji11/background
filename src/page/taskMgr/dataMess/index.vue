<template>
    <div class="fillcontain">
		<svg-icon iconClass="return" class="return" @click.native.prevent="returnPage()"/>
		<h2 class="title">任务管理 / 消息管理</h2>
		<el-button class="create-mess-btn" @click.native.prevent="showDialog()">创建消息</el-button>
		<div class="table-title">
			<div class="table-item">
				<font class="title">任务名</font>
				<el-select v-model="taskId" placeholder="全部" @change="changeTask" class="select-border"  >
					<el-option
						v-for="item in taskList"
						:key="item.id"
						:label="item.name"
						:value="item.id" >
					</el-option>
				</el-select>
			</div>
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
					    label="发送内容">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="目标发送量">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="已发送量">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="回复率">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="状态">
					</el-table-column>
					<el-table-column
						width="150px"
					    label="操作">
						 <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row)">编辑</button>
							<button class="check-info margin" @click="checkInfo(scope.row)">开始</button>
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
	import echarts from 'echarts';
    export default {
		name:"DataMess",
        data(){
            return {
				listLoading:false,
				currentPage:1,
				pageSize:100,
				pageTotal:1,
				dataList:[{"count":122}],
				taskList:[{"id":"0","name":"全部"}],
				taskId:"0",
            }
        },
        mounted(){
			document.getElementById('taskMgr').classList.add("is-active");
        },
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(){

			},
			showDialog(){

			},
			changeTask(){

            },
			returnPage(){
				this.$router.push({ name: "TaskMgr" }); 
			},		
        },
    }
</script>

<style lang="less" scoped>
.return{
    position: absolute;
    margin-left: 18px;
    padding-top: 16px;
    height: 24px;
    width: 24px;
    cursor: pointer;
}
.title{
	position:absolute;
	margin-left: 49px;
	padding-top: 20px;
	font-size: 12px;	
	color: #34404b;
}
.create-mess-btn{
	position:absolute;
	margin-top: 12px;
	float:right;
	right:22px;
	width: 130px;
	height: 36px;
	background-color: #278fff;
	border-radius: 4px;
	color: #ffffff;
}
.table-title{
    position: relative;
    top: 55px;
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
.list{
	position: absolute;
	left:19px;
	right:19px;
	top:105px;
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
		.margin{
			margin-left: 10px;
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
