<template>
    <div class="fillcontain">
		<h2 class="title">数据总览</h2>
		<div class="card-list">
			<div class="card-border margin-right">
				<div class="card-content">
					<svg-icon iconClass="acc-count" class="card-icon"/>
					<div class="card-value">1000000</div>
				</div>
				<div class="card-name">账号总数</div>
			</div>
			<div class="card-border margin-right" style="flex-grow: 1;">
				<div class="card-content">
					<svg-icon iconClass="acc-block" class="card-icon"/>
					<div class="card-value">1000000</div>
				</div>
				<div class="card-name">封号总数</div>
			</div>
			<div class="card-border">
				<div class="card-content">
					<svg-icon iconClass="acc-mess" class="card-icon"/>
					<div class="card-value">1000000</div>
				</div>
				<div class="card-name">今日发消息数</div>
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
        created(){
    
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
.card-list{
	position: relative;
	margin: 15px 19px;
	display: flex;
    cursor: default;
	height: 138px;
	.card-border{
		position:relative;
		width: 31%;
		height: 100%;
		background-color: #ffffff;
		box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
		border-radius: 6px;
		.card-content{
			position:relative;
			border-bottom: 1px solid #eeeeee;
			padding-top: 15px;
			width: 90%;
			margin-left: auto;
			margin-right: auto;
			height: 77px;
			.card-value{
				position: absolute;
				top: 35px;
				right: 0px;
				height: 30px;
				line-height: 30px;
				color: #74788d;
				font-size: 30px;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.card-icon{
				margin-left: 10px;
				color: #768492;
				height:42px;
				width:42px;
				padding-top: 15px;
			}
		}
		.card-name{
			margin-left: auto;
			margin-right: auto;
			padding-top: 12px;
			color: #a49e93;
			font-size: 14px;
			font-weight: 500;
			width: 90%;
		}
	}
	.margin-right{
		margin-right: 30px;
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
	top:250px;
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
