<template>
    <div class="mess">
        <h2 class="title">聊天管理</h2>
		<div class="left-content" style="width:240px;">
            <div v-for="item in taskList" :key="item.job_id" :class="['task-border',item.job_id==cur_task?'sel':'']" @click="getSessionList(item)">
                <div class="task-name">{{item.job_name}}</div>
            </div>
        </div>
		<div class="right-content">
            <div class="left-content friend-border">
                <div v-for="item in accList" :key="item.id" :class="['acc-border',item.id==cur_session.id?'sel':'',item.from.online==1?'':'gray']" @click="getMessageList(item,false)">
                    <img :src="baseUrl+item.to.avt" class="acc-icon" :fid="item.from.fid" :ofid="item.to.fid" :onerror="errorImg"/>
                    <div class="acc-name">{{item.to.nickname?item.to.nickname:'--'}}</div>
                    <div class="msg-name">{{item.latest_msg}}</div>
                    <span v-if="item.unread_flag" class="unread"></span>
                    <svg-icon v-if="item.to.home_page" iconClass="acc-index" class="acc-index" @click.prevent.stop="openIndex(item.to.home_page)"/>
                </div>
                <div class="table-pagination" v-show="this.cur_task">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        :hide-on-single-page ="true"
                        background
                        layout="prev, pager, next"
                        :page-count="pageTotal">
                    </el-pagination>
                </div>
            </div>
			<div class="chat-list" id="chat_list">
                <div class="all-mess" @click="getMessageList(cur_session,true)">查看更多消息</div>
                <div v-for="item in chatList" :key="item.mid" :class="!item.send?'chat-border':'chat-border-right'">
                    <div v-if="item.send" class="icon-right">
                        <svg-icon iconClass="user" :class="['chat-icon',cur_session.from.online==1?'':'gray']"/>
                    </div>
                    <div v-else class="icon">
                        <img :src="baseUrl+cur_session.to.avt" :class="['chat-icon',cur_session.from.online==1?'':'gray']" :onerror="errorImg"/>
                    </div>
                    <div class="chat-content">
                        <div class="chat-body">{{item.text}}</div>
                        <div v-if="item.time" class="footer-time">{{item.time}}</div>
                    </div>
                    <img v-if="item.sending" :src="loading" class="loading-icon"/>
                </div>
            </div>
            <div class="send-message">
                <textarea v-model="mess_value" class="content-input" type="textarea" @keyup.enter="sendMessage"></textarea>
                <div class="msg-btn" @click="sendMessage()">发送</div>
            </div>
		</div>
    </div>
</template>

<script>
    import task from '@/api/task-mgr';
    import { getToken, getUserId, getUserType } from '@/utils/auth';
    import moment from 'moment';
    import { mapGetters } from 'vuex';
    export default {
        data(){
            return {
                loading:require('../../../public/mess-loading.gif'),
                errorImg: 'javascript:this.src="' + require('../../../public/head.svg') + '";this.οnerrοr=null',
                mess_value:'',
                taskList:[],
                accList:[],
                chatList:[],
                cur_task:"",
                cur_session:{},
                socket:'',
                socket_close:false,
                send_mess_obj:'',
                last_mid:'',
                last_ts:-1,
                all_mess:false,
                currentPage:1,
				pageSize:100,
                pageTotal:1,
                userid:'',
                accType:getUserType(),
            }
        },
        computed: {
            ...mapGetters([
                'baseUrl',
            ]),
        },
        mounted(){
            this.connectWebsocket();
        },
        activated(){
            this.getTaskList();
            var div = document.getElementById('chat_list');
            div.scrollTop = div.scrollHeight;
            if ( this.socket_close ){
                this.connectWebsocket();
            }
        },
        methods: {
            handleCurrentChange(val){                           
                this.currentPage = val;
                this.sessionListPage();
            },
            async getTaskList(){
                if ( this.accType !=1 ){
					this.userid = getUserId();
				}
				var req = {
                    "token":getToken(),
                    "userid":this.userid,
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.taskList = data.data.list || [];
				}
            },	
            sessionListPage(){
                this.chatList = [];
                this.cur_session = {};
                var req = {
                    "type":"get_chat_list",
                    "job_id":this.cur_task,
                    "size":this.pageSize,
                    "page":this.currentPage
                }
                this.socket.onsend(JSON.stringify(req));
            },
            getSessionList(obj){
                this.cur_task = obj.job_id;
                this.currentPage = 1;
                this.pageTotal = 1;
                this.accList = [];
                this.chatList = [];
                this.cur_session = {};
                var req = {
                    "type":"get_chat_list",
                    "job_id":this.cur_task,
                    "size":this.pageSize,
                    "page":this.currentPage
                }
                this.socket.onsend(JSON.stringify(req));
            },
            getMessageList(obj,type){
                if ( this.cur_session.id == obj.id && !type){
                    return;
                }
                this.cur_session = obj;
                this.all_mess = type;
                if ( !this.cur_session.from ){
                    return;
                }
                if ( !type ){
                    this.chatList = [];
                    this.last_ts = -1;
                    this.last_mid = "";
                }
                this.$set(obj,"unread_flag",false);
                var req = {
                    "type":"get_dialog",
                    "fid":this.cur_session.from.fid,
                    "ofid":this.cur_session.to.fid,
                    "size":15,
                    "last_ts":this.last_ts,
                    "last_mid":this.last_mid
                }
                this.socket.onsend(JSON.stringify(req));
            },
            openIndex(url){
                window.open(url);
            },
            sendMessage(event){
               if ( this.mess_value =="" || !this.cur_session.from ){
                    return;
                }
                if ( !event || (event.shiftKey && event.key === "Enter")) {
                    this.send_mess_obj = {
                        "type":"send_msg",
                        "job_id":this.cur_task,
                        "fid":this.cur_session.from.fid,
                        "ofid":this.cur_session.to.fid,
                        "text":this.encodeUtf8(this.myTrim(this.mess_value))
                    }
                    this.socket.onsend(JSON.stringify(this.send_mess_obj));
                    this.send_mess_obj.text = this.myTrim(this.mess_value);
                    this.mess_value = "";
                }
            },
            getChatList(data){
                var list = data.data.list || [];
                list.sort(function(a,b){
                    return b.from.online - a.from.online;
                });
                list.sort(function(a,b){
                    return b.unread_flag - a.unread_flag;
                });
                for ( var i=0; i<list.length;i++ ){
                    list[i].id = list[i].from.fid+"_"+list[i].to.fid;
                }
                this.accList = list;
                this.pageTotal = data.data.total_page || 1;
            },
            getDialog(data){
                var list = data.data.list || [];
                for ( var i=0; i<list.length;i++ ){
                    this.$set(list[i],"time",moment(list[i].ts*1000).format('YYYY-MM-DD HH:mm'));
                }
                if ( this.all_mess ){
                    this.chatList = list.concat(this.chatList);
                    this.all_mess = false;
                    document.getElementById('chat_list').scrollTop = 0;
                }else{
                    this.chatList = list;
                    this.$nextTick(function(){
                        var div = document.getElementById('chat_list');
                        div.scrollTop = div.scrollHeight;
                    });
                }
                if ( list.length >0 ){
                    this.last_mid = list[0].mid || '';
                    this.last_ts = list[0].ts || -1;
                }
            },
            sendMsg(data){
                if ( data.rtn !=0 ){
                    this.$message({
                        message: data.msg,
                        center: true,
                        type: 'error',
                        duration: 3 * 1000
                    });
                    return;
                }
                var req = {
                    "mid":data.data.imid,
                    "send":true,
                    "text":this.send_mess_obj.text,
                    "sending":true
                }
                this.chatList.push(req);
                this.$nextTick(function(){
                    var div = document.getElementById('chat_list');
                    div.scrollTop = div.scrollHeight;
                });
            },
            updateUnread(data){
                if ( this.cur_task != data.job_id ){
                    return;
                }
                var id = data.fid+"_"+data.ofid;
                var unread_flag = true;
                if ( id == this.cur_session.id || data.send ){
                    unread_flag = false;
                }
                var index = this.accList.findIndex(item => item.id === id);
                if ( index >-1 && this.accList[index].unread_flag ){
                    unread_flag = true;
                }
                var obj = {
                    "id":id,
                    "from": {"fid": data.fid,"online":1},
                    "to": {"fid": data.ofid, "avt": data.o_avt, "nickname": data.o_nickname,"home_page":data.home_page},
                    "latest_msg":data.latest,  
                    "unread_flag": unread_flag, 
                    "ts": data.ts,
                }
                this.accList.splice(index, 1);
                this.accList.unshift(obj);
            },
            sendMsgSucc(data){
                var id = data.fid+"_"+data.ofid;
                if ( this.cur_session && id == this.cur_session.id ){
                    const obj = this.chatList.find( value =>value.mid == data.imid);
                    if ( obj && obj.mid ){
                        this.$set(obj,"sending",false);
                    }else{
                        var req = {
                            "mid":data.imid,
                            "send":true,
                            "text":data.text,
                        }
                        this.chatList.push(req);
                        this.$nextTick(function(){
                            var div = document.getElementById('chat_list');
                            div.scrollTop = div.scrollHeight;
                        });
                    }
                }
            },
            updateDialog(data){
                var id = data.fid+"_"+data.ofid;
                if ( this.cur_session && id == this.cur_session.id ){
                    this.chatList.push(data);
                    this.$nextTick(function(){
                        var div = document.getElementById('chat_list');
                        div.scrollTop = div.scrollHeight;
                    });
                }
            },
            showData(data){
                var self = this;
                switch (data.type){
                    case "get_chat_list":
                        self.getChatList(data);
                        break
                    case "get_dialog":
                        self.getDialog(data);
                        break  
                    case "send_msg":
                        self.sendMsg(data);
                        break
                    case "update_unread":
                        self.updateUnread(data);
                        break
                    case "send_msg_succ":
                        self.sendMsgSucc(data);
                        break
                    case "update_dialog":
                        self.updateDialog(data);
                        break
                }
                // const actions = new Map([
                //     ["get_chat_list",self.getChatList(data)],
                //     ["get_dialog",self.getDialog(data)],
                //     ["send_msg",self.sendMsg(data)],
                //     ["update_unread",self.updateUnread(data)],
                //     ["send_msg_succ",self.sendMsgSucc(data)],
                //     ["update_dialog",self.updateDialog(data)],
                // ]);
                // actions.get(data.type);
            },
            connectWebsocket(){
                this.socket = new WebSocket(this.$store.getters.messageUrl+"messager");
                this.socket.onopen = () => {
                    var req = {
                        "type":"handshake",
                        "uid":getUserId(),
                    }
                    this.socket.send(this.str2ab(JSON.stringify(req)));
                },
                this.socket.onerror = () => {
                    console.log("连接错误");
                },
                this.socket.onsend = (param) => {
                    console.log("send="+param);                   
                    this.socket.send(this.str2ab(param));
                },
                this.socket.onmessage = (data) => {
                    //console.log(data.data);
                    this.socket_close = false;
                    this.showData(JSON.parse(data.data));
                },
                this.socket.onclose = (e) => {
                    if ( this.$route.path == "/message" ){
                        setTimeout(()=>{
                            this.connectWebsocket();
                            console.log("重连"+e.code+ ' ' + e.reason)
                        },3000);
                    }
                    this.socket_close = true;
                }
            },
            str2ab(str) {
                var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                var bufView = new Uint8Array(buf);
                for (var i=0, strLen=str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
            },
            encodeUtf8(str) {
                if ( window.TextEncoder ){
                    var encoder = new TextEncoder('utf8');
                    var bytes = encoder.encode(str);
                    var result = '';
                    for(var i = 0; i < bytes.length; ++i) {
                        result += String.fromCharCode(bytes[i]);
                    }
                    return result;
                }else{
                    return eval('\''+encodeURI(str).replace(/%/gm, '\\x')+'\'');
                }
            },
            myTrim(x) {
                return x.replace(/^\s+|\s+$/gm,'');
            }
        },
    }
</script>

<style lang="less" scoped>
    .title{
        position: absolute;
        margin-left: 0px;
        padding-top: 5px;
        font-size: 12px;
        color: #34404b;
    }
    .mess{
        position: absolute;
        top: 10px;
        bottom: 30px;
        left: 19px;
        right:19px;
        max-width: 1300px;
    }
    .gray{
        -webkit-filter: grayscale(100%);
        -moz-filter: grayscale(100%);
        -ms-filter: grayscale(100%);
        -o-filter: grayscale(100%);
        filter: grayscale(100%);
        filter: gray;
        filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
    }
    .left-content{
        position: absolute;
        top: 40px;
        bottom: 0px;
        width:270px;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
        overflow-y: auto;
        overflow-x: hidden;
        .task-border{
            position: relative;
            border-bottom: 1px solid #f6f6f6;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
            .task-name{
                position: absolute;
                left: 0px;
                right: 20px;
                color: #768492;
                margin-left: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-weight: 600;
            }
        }
        .acc-border{
            position: relative;
            border-bottom: 1px solid #f6f6f6;
            height: 60px;
            line-height: 35px;
            cursor: pointer;
            .acc-icon{
                position: absolute;
                margin-left: 10px;
                margin-top: 10px;
                width:40px;
                height:40px;
                border-radius: 27px;
            }
            .acc-name{
                position: absolute;
                left: 45px;
                right: 20px;
                color: #3092fc;
                margin-left: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .msg-name{
                position: absolute;
                margin-top: 24px;
                left: 45px;
                right: 40px;
                color: #768492;
                margin-left: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .unread{
                position: absolute;
                right: 10px;
                top: 15px;
                height: 8px;
                width: 8px;
                border-radius: 25px;
                background-color: #3092fc;
            }
            .acc-index{
                position: absolute;
                right: 10px;
                bottom: 10px;
                height: 20px;
                width: 20px;
                cursor: pointer;
            }
        }
        .task-border:hover,
        .acc-border:hover,
        .sel{
            background-color: #f6f6f6;
            transition: all .3s;
        }
    }
    .friend-border{
        border-right: 1px solid #f0f0f0;
        top: 0px;
        box-shadow:none;
        width: 300px;
    }
    .right-content{
        position: absolute;
        top: 40px;
        bottom: 0px;
        left:250px;
        right:10px;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
        .all-mess{
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            color: #3092fc;
            cursor: pointer;
        }
        .chat-list{
            position: absolute;
            top: 5px;
            bottom: 80px;
            left: 325px;
            right: 15px;
            overflow-y: auto;
            overflow-x: hidden;
            border-bottom: 1px solid #f1eae0;
            .chat-border{
                position: relative;
                margin-top: 23px;
                margin-bottom: 10px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .icon{
                    position: relative;
                    width: 40px;
                    height:40px;
                    .chat-icon{
                        width: 40px;
                        height:40px;
                        border-radius: 27px;
                    }
                }
                .chat-content{
                    position: relative;
                    padding: 10px 14px;
                    margin-left: 18px;
                    border: 2px solid #b8d8d8;
                    border-radius: 10px;
                    max-width: 75%;
                    background-color: #b8d8d8;
                    color: #252422;
                }
                .chat-body{
                    word-wrap: break-word;
                    word-break: normal;
                    white-space: pre-line;
                    overflow-y: auto;  
                    max-height: 400px;
                }
                .chat-content::before{
                    position: absolute;
                    display: block;
                    content: "";
                    top: 14px;
                    left: -16px;
                    height: 0;
                    border: 8px solid #b8d8d8;
                    border-left-color: transparent;
                    border-bottom-color: transparent;
                }
            }
            .chat-border-right{
                position: relative;
                margin-top: 23px;
                margin-bottom: 10px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                .icon-right{
                    position: relative;
                    width: 40px;
                    height:40px;
                    order: 2;
                    .chat-icon{
                        width: 40px;
                        height:40px;
                        border-radius: 27px;
                    }
                }
                .icon-right:after{
                    position: absolute;
                    content: "";
                    display: inline-block;
                    bottom: 14px;
                    right: 48px;
                    width: 0;
                    height: 0;
                    border: 8px solid #d6c1ab;
                    border-right-color: transparent;
                    border-top-color: transparent;
                }
                .chat-content{
                    position: relative;
                    order: 1;
                    top: 0px;
                    padding: 10px 14px;
                    margin-right: 22px;
                    border: 2px solid #d6c1ab;
                    border-radius: 10px;
                    max-width: 75%;
                    background-color: #d6c1ab;
                    color: #252422;
                }
                .loading-icon{
                    margin-right: 10px;
                }
                .chat-body{
                    word-wrap: break-word;
                    white-space: pre-line;
                    word-break: normal;
                    overflow-y: auto;  
                    max-height: 400px;
                }
                .chat-name{
                    position: relative;
                    max-width: 40%;
                    margin-left: 8px;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
            .footer-time{
                margin-right: 0px;
                margin-top: 7px;
                padding: 0;
                float: right;
                color: rgba(0, 0, 0, 0.5);
            }
        }
        .send-message{
            position: absolute;
            height:50px;
            bottom: 15px;
            left: 325px;
            right: 15px;
            .content-input{
                position: absolute;
                left: 0px;
                right:90px;
                bottom: 0px;
                height: 30px;
                width: calc(100% - 132px);
                padding: 7px 18px;
                border: 1px solid #e8e7e3;
                color: #768492;
                border-radius: 5px;
                background-color: #f3f2ee;
                resize: none;
            }
            .msg-btn{
                position: absolute;
                float: right;
                top: 7px;
                right: 0px;
                width: 75px;
                height: 38px;
                text-align: center;
                line-height: 38px;
                border-radius: 20px;
                color: #ffffff;
                background-color: #7a9e9f;
                cursor: pointer;
            }
        }
    }
    .table-pagination /deep/{
        position: relative;
        text-align: center;
        overflow-x: auto;
        overflow-y: hidden;
		.el-pagination{
			padding: 20px 0;
		}
	}
</style>
