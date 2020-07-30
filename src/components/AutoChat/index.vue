<template>
	<el-dialog
	title="智能回复"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-border"
	center>
		<el-button type="primary"  class="add-reply" @click.native.prevent="addReply()">添加回复</el-button>
		<div class="list">
			<div class="border">
				<span class="default-complete" @click="defaultOpera()">保存</span>
				<svg-icon iconClass="add" style="left:0px;" class="add" @click="addAns(defaultWord)"/>
				<div style="margin-left: 22px;" class="margin item" v-for="(ite,index) in defaultWord" :key="index">
					<span>默认回复{{index+1}} ：</span>
					<el-input style="margin-left:5px;" v-model="ite.ans" class="key-textarea" resize="none" type="textarea" placeholder="匹配不上关键词时默认回复"/>
				</div>				
			</div>
			<div class="border" v-for="(item,index) in dataList" :key="item.id">
				<div class="item">
					<span>对方关键词{{index+1}} ：</span>
					<el-input v-model="item.keyword" class="key-input" type="text" placeholder="不区分大小写"/>
					<span class="complete" @click="chatOpera(item)">保存</span>
					<svg-icon iconClass="delete" class="delete" @click="chatOpera(item, -1)"/>
				</div>
				<svg-icon iconClass="add" class="add" @click="addAns(item.send_dialog)"/>
				<div class="margin item" v-for="(ite,index) in item.send_dialog" :key="index">
					<span>回复{{index+1}} ：</span>
					<el-input v-model="ite.ans" class="key-textarea" resize="none" type="textarea"/>
				</div>
			</div>
		</div>
	</el-dialog>
</template>

<script>
import task from '@/api/task-mgr';
import { getToken } from '@/utils/auth'
import { MessageBox } from 'element-ui'
export default {
	data:function(){
		return{
			currentIndex:this.dialogVisible,
			dataList:[],
			defaultWord:[{"ans":""}],
			defalt_id:'',
		}
	},
	props:{
		jobId: {
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
				this.getChatInfo();
			}
		},
	},
	methods: {
		callback(){		
			this.$emit('changeStatus',false);
		},
		addAns(arr){
			arr.push({"ans":""});
		},
		addReply(){
			const obj = this.dataList.find( value =>value.id == "0" );
			if ( !obj ){
				var req = {"id":"0","key_dialogs":"","send_dialog":[{"ans":""}]};
				this.dataList.push(req);
				this.$nextTick(function(){
					var div = document.getElementsByClassName('list')[0];
					div.scrollTop = div.scrollHeight;
				});
			}
		},
		defaultOpera(){			
			var obj = {
				"id":this.defalt_id,
				"keyword":"",
			}
			var prodData = [];
			for ( var i=0; i<this.defaultWord.length; i++ ){
				if ( this.defaultWord[i].ans ){
					prodData.push(this.myTrim(this.defaultWord[i].ans));
				}
			}
			this.sendData(obj, 3, prodData);
		},
		async getChatInfo(){
			var req = {
				"token":getToken(),
				"job_id":this.jobId,
			}
			const data = await task.getAutoDialog(JSON.stringify(req));
			if ( data.rtn == 0 ){
				var list = data.data.list || [];
				for ( var i=0;i<list.length; i++ ){
					var arr = [];
					for ( var j=0; j<list[i].send_dialogs.length;j++){
						arr.push({"ans":list[i].send_dialogs[j]})
					}
					this.$set(list[i],"send_dialog",arr);
				}
				this.dataList = list;
				if ( this.dataList.length == 0 ){
					this.addReply();
				}
				if ( data.data.default_dialog ){
					var ary = [];
					var ark = data.data.default_dialog.send_dialogs || [];
					for ( var j=0; j<ark.length;j++){
						ary.push({"ans":ark[j]});
					}
					if ( ark.length >0 ){
						this.defaultWord = ary;
					}else{
						this.defaultWord = [{"ans":""}];
					}
					this.defalt_id = data.data.default_dialog.id || "";
				}else{
					this.defaultWord = [{"ans":""}];
					this.defalt_id = '';
				}
			}
		},
		chatOpera(obj,type){
			if ( type !=-1 ){
				if ( obj.id == "0" ){
					type = 1;
				}else{
					type = 2;
				}
			}else if ( type ==-1 && obj.id == "0" ){
				this.dataList.splice(this.dataList.findIndex(item => item.id === "0"), 1);
				return;
			}
			var prodData = [];
			for ( var i=0; i<obj.send_dialog.length; i++ ){
				if ( obj.send_dialog[i].ans ){
					prodData.push(this.myTrim(obj.send_dialog[i].ans));
				}
			}
			if ( !obj.keyword ){
				this.$message({
					message: "请输入对方关键词",
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
				return;
			}else if ( !prodData[0] ){
				this.$message({
					message: "请输入回复内容",
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
				return;	
			}
			if ( type ==-1 ){
				MessageBox.confirm('是否删除该回复？', '', {
					confirmButtonText: '删除',
					showCancelButton:false,
					type: 'warning'
				}).then(() => {
					this.sendData(obj, type, prodData);
				});
			}else{
				this.sendData(obj, type, prodData);
			}
		},
		async sendData(obj, type, prodData){
			var req = {
				"token":getToken(),
				"job_id":this.jobId,
				"id":obj.id,
				"keyword":obj.keyword,
				"send_dialogs":prodData,
				"opt":type,
			}
			const data = await task.setAutoDialog(JSON.stringify(req));
			if ( data.rtn == 0 ){
				this.$message({
					message: "success",
					center: true,
					type: 'success',
					duration: 3 * 1000
				})
				this.getChatInfo();
			}else{
				this.$message({
					message: data.msg,
					center: true,
					type: 'error',
					duration: 3 * 1000
				})
			}
		},
		myTrim(x) {
			return x.replace(/^\s+|\s+$/gm,'');
		},
	}	
}			
</script>

<style lang="less" scoped>
	.list-border /deep/{                        
		.el-dialog {
			width: 826px;
			height: 560px;
		}	
		/deep/ .el-textarea__inner {
			font-size: 12px;
			height: 50px;
		}
	}
	.add-reply{
		position: relative;
		margin-left: 47px;
		padding: 5px 13px;
		font-size: 12px;
	}
    .list{
	    position: relative;
	    margin-left: 47px;
	    margin-top: 20px;
	    width: 736px;
		height: 435px;
		overflow-x: hidden;
		overflow-y: auto;
		.border{
			margin-bottom: 20px;
			.default-complete{
				position: absolute;
				right: 46px;
				margin-top: 4px;
				height: 25px;
				width: 50px;
				border: 1px solid #7a9e9f;
				border-radius: 6px;
				text-align: center;
				line-height: 25px;
				cursor: pointer;
				color: #7a9e9f;
			}
			.item{
				margin-bottom: 12px;
				font-size: 12px;
				.key-input{
					margin-left: 15px;
					width: 500px;
				}
				.key-textarea{
					margin-left: 15px;
					width: 500px;
				}
				.complete{
					position: absolute;
					margin-left: 40px;
					margin-top: 4px;
					height: 25px;
					width: 50px;
					border: 1px solid #7a9e9f;
					border-radius: 6px;
					text-align: center;
					line-height: 25px;
					cursor: pointer;
					color: #7a9e9f;
				}
				.delete{
					position: absolute;
					right: 10px;
					margin-top: 7px;
					width: 20px;
					height: 20px;
					cursor: pointer;
				}
			}
			.add{
				position: absolute;
				margin-top: 18px;
				left: 15px;
				width: 14px;
				height: 14px;
				cursor: pointer;
			}
			.margin{
				margin-left: 37px;
				line-height: 50px;
			}
		}
    }
</style>
