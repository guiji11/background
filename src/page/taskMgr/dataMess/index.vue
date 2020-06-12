<template>
    <div class="fillcontain">
		<h2 class="title">数据总览</h2>
		<div class="item-list">
			<div class="info-num">
				<div class="num">100000</div>
				<div class="num-icon">账号总数</div>
			</div>
			<div class="info-num">
				<div class="num">0</div>
				<div class="num-icon">封号总数</div>
			</div>
			<div class="info-num">
				<div class="num">0</div>
				<div class="num-icon">今日发消息数</div>
			</div>
		</div>
		<div class="table-title">
			<div class="table-item">
				<font class="title">服务器编号</font>
				<el-select v-model="serveNum" placeholder="全部" @change="changeServeNum" class="select-border"  >
					<el-option
						v-for="item in serveList"
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
					    label="服务器编号">
					    <template scope="scope">
							<span style="font-weight:600;">S{{scope.row.count}}</span>
						</template>
					</el-table-column>
					<el-table-column
						prop="count"
					    label="在线数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="今日封号数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="今日发消息数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="今日回复数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="累计发消息数">
					</el-table-column>
					<el-table-column
						prop="count"
					    label="累计回复数">
					</el-table-column>
					<el-table-column
					    label="详情">
					    <template scope="scope">
							<button class="check-info" @click="checkInfo(scope.row)">查看</button>
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

    export default {
		name:"DataMess",
        data(){
            return {
				listLoading:false,
				multipleSelection:[],
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
        },
        methods: {
			handleCurrentChange(val){                           
				this.currentPage = val;
			},
			checkInfo(){

			},
			changeServeNum(){

			},
            async getUsers(){
                const Users = await getUserList({offset: this.offset, limit: this.limit});
            }
        },
    }
</script>

<style lang="less" scoped>
.title{
	position:relative;
	margin-left: 19px;
	padding-top: 15px;
	font-size: 12px;	
	color: #34404b;
}
.item-list{
	position: relative;
	margin: 15px 19px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: default;
	height: 120px;
	background-color: #ffffff;
	box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.04);
	border-radius: 3px;
	.info-num{
		position:relative;
		font-family: "Arial","Microsoft YaHei","黑体","宋体",sans-serif;
		font-weight: normal;
		font-stretch: normal;
		width: 43vw;
		.num{
			height: 30px;
			line-height: 30px;
			color: #4675d2;
			font-size: 32px;
			text-align: center;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.num-icon{
			color: #768492;
			text-align: center;
			padding-top: 15px;
		}
	}
}
.table-title{
	position: relative;
    left: 0px;
    right: 320px;
    height: 34px;
	.table-item{
		margin-right: 21px;
		float:left;
		.title{
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
	top:230px;
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
