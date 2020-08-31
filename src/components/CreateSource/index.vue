<template>
	<el-dialog
	:title="groupId?'编辑数据源':'创建数据源'"
	:visible.sync="currentIndex"
	@close ="callback(false)"
	destroy-on-close
	append-to-body
	:close-on-click-modal="false"
	class="list-borde"
	center>
		<div class="list">
			<el-radio v-model="radio" label="1" @change="changeLabel()" :disabled="maildi">邮箱组</el-radio>
			<el-radio v-model="radio" label="2" @change="changeLabel()" :disabled="fbdi">自建FB组</el-radio>
			<div class="item">
				<div class="name">组名称 : </div>
				<el-input v-model="emailName" type="text" />
			</div>
			<div class="item">
				<div class="name">{{radio==1?'邮箱列表（ 一行一个邮箱，回车隔开多个邮箱 ）:':'FB组列表（ 为一个数组，输入格式：["xx","aa"] ）'}}</div>
				<button class="file-btn">{{fileName}}</button>
				<input type="file" class="file" @change="importFile()" ref="inputer" accept="text/plain" multiple="multiple"/>
				<el-input v-model="emailList" resize="none" type="textarea" @change="clearFile()"/>
			</div>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" :disabled="loading" @click.native.prevent="complete()">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getToken } from '@/utils/auth';
import email from '@/api/mail';
export default {
	data:function(){
		return{
			emailList:'',
			emailName:'',
			currentIndex:this.dialogVisible,
			loading:false,
			radio:"1",
			maildi:false,
			fbdi:false,
			fileName:'导入Txt',
			count:0,
			otherValue:'',
		}
	},
	props:{
		name: {
			type: String,
			required: true
		},
		typeRadio: {
			type: Number,
			required: false
		},		
		groupId: {
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
			this.loading = false;
			this.maildi = false;
			this.fbdi = false;
			this.currentIndex = data;
			this.emailName = this.name || '';
			this.emailList = '';
			this.otherValue ='';
			this.radio = String(this.typeRadio);
			if ( this.groupId && this.typeRadio == 1 ){
				this.fbdi = true;
			}
			if ( this.groupId && this.typeRadio == 2 ){
				this.maildi = true;
			}
		},
	},
	methods: {
		changeLabel(){
			this.emailList = '';
			this.otherValue ='';
		},
		clearFile(){
			this.otherValue = this.emailList;
		},
		importFile(){
			if ( !this.$refs.inputer.files ){
				return;
			}
			this.count = 0;
			var files = this.$refs.inputer.files;
			for ( var i=0; i<files.length; i++){
				this.readFiles(files[i], files.length);
			}
			this.$refs.inputer.value = null;
		},
		readFiles(files, length){
			var self = this;
			const reader = new FileReader();
			reader.readAsText(files, "UTF-8");
			reader.onload = function(e){
				self.fileName = '解析中';
				self.count++;
				self.otherValue += e.target.result;
				if ( self.count== length ){
					setTimeout(function(){
						if ( self.radio == 2 ){
							self.otherValue = self.otherValue.replace(/\]\[/g,',');							
						}
						self.emailList = self.otherValue;
						self.$nextTick(function(){
							self.fileName = '导入Txt';
						});
					},500);
				}
			};
		},
		async complete(){
			if ( !this.emailName ){
				this.$message({
					message: "请输入组名称",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}else if ( this.radio =='2' && this.emailList && this.emailList.indexOf('[')==-1 ){
				this.$message({
					message: "FB组列表输入格式有误，请输入一个数组",
					center: true,
					type: 'error',
					duration: 3 * 1000
				});
				return;
			}
			if ( this.radio =='1' ){
				var list = this.myTrim(this.emailList).split('\n') || [];
			}else if ( this.radio =='2' && this.emailList ){
				var value = this.myTrim(this.emailList);
				var list = eval('(' + value + ')') || [];
			}else{
				var list = [];
			}
			var req = {
				"token":getToken(),
				"group_id":this.groupId,
				"type":Number(this.radio),
				"name":this.emailName,
				"list":list,
			}
			this.loading = true;
			const data = await email.addSrcGroup(JSON.stringify(req));
			if ( data.rtn == 0 ){
				this.callback(Number(this.radio));
				this.loading = false;
				this.$message({
					message: "success",
					center: true,
					type: 'success',
					duration: 3 * 1000
				})
			}else {
				this.loading = false;
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
		callback(data){
			this.$emit('changeStatus',data);	
			this.currentIndex = false;
		},
	}	
}			
</script>

<style lang="less" scoped>
	.list-borde {                        
		/deep/ .el-dialog {
			width: 826px;
			height: 560px;
		}	
		/deep/ .el-input__inner{
			height: 38px;
			padding-left: 10px;
			line-height: 38px;
			color: #48465b;
		}	
		/deep/ .el-input{
			width: 662px;
		}
		/deep/ .el-textarea__inner {
			font-size: 12px;
			height: 215px;
		}
		/deep/ .el-dialog--center .el-dialog__footer .el-button--primary,
		/deep/ .el-dialog--center .el-dialog__footer{
			width: 280px;
			height: 48px;
		}
    }
    .list{
		position: relative;
		margin-left: 65px;
		margin-top: 20px;
		width: 736px;
		height: 380px;
    	.item{
    		position:relative;
    		margin-top: 15px;
		    width: 662px;
			.name{
				margin-left: 0px;
				z-index: 1;
				line-height: 38px;
				font-size: 12px;
				font-weight: 500;
				font-stretch: normal;
				letter-spacing: 0.36px;
				color: #74788d;
			}
			.file-btn{
				position: absolute;
				top: 6px;
				right: 0px;
				height: 25px;
				width: 68px;
				color: #74788d;
				border-radius: 5px;
				font-size: 12px;
			}
			.file{
				position: absolute;
				top: 6px;
				right: 0px;
				height: 25px;
				width: 68px;
				opacity: 0;
				font-size: 0;
				cursor: pointer;
			}
    	}
    }
</style>
