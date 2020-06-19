<template>
    <div class="mess">
        <h2 class="title">聊天管理</h2>
		<div class="left-content" style="width:240px;">
            <div v-for="item in taskList" :key="item.job_id" :class="['task-border',item.job_id==cur_task.job_id?'sel':'']" @click="getSessionList(item)">
                <div class="task-name">{{item.job_name}}</div>
            </div>
        </div>
		<div class="right-content">
            <div class="left-content friend-border">
                <div v-for="item in accList" :key="item.id" :class="['acc-border',item.id==cur_session.id?'sel':'']" @click="getMessageList(item)">
                    <svg-icon iconClass="user" class="acc-icon"/>
                    <div class="acc-name">{{item.to.nickname}}</div>
                    <div class="msg-name">{{item.msg}}</div>
                    <span v-if="item.unread >0" class="unread"></span>
                </div>
            </div>
			<div class="chat-list" id="chat_list">
                <div v-for="item in chatList" :key="item.mid" :class="!item.send?'chat-border':'chat-border-right'">
                    <div :class="item.send?'icon-right':'icon'">
                        <svg-icon :iconClass="!item.send?'head':'head-right'" class="chat-icon"/>
                    </div>
                    <div class="chat-content">
                        <div class="chat-body">{{item.body}}</div>
                        <div class="footer-time">11:22</div>
                    </div>
                </div>
            </div>
            <div class="send-message">
                <input v-model="mess_value" class="content-input" placeholder="在此输入！" @enter="sendMessage()"/>
                <div class="msg-btn" @click="sendMessage()">发送</div>
            </div>
		</div>
    </div>
</template>

<script>
    import task from '@/api/task-mgr';
    import { getToken, getUserId } from '@/utils/auth';
    export default {
        data(){
            return {
                mess_value:'',
                open:0,
                taskList:[],
                accList:[{"id":3,"msg":"gggg","from":{"nickname":"灌灌灌灌"},"to":{"nickname":"灌灌灌灌"}}],
                chatList:[{"mid":3,"body":"灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌","send":false},{"mid":2,"body":"灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌灌","send":true}],
                cur_task:{},
                cur_session:{},
                socket:'',
            }
        },
        mounted(){
            //this.connectWesocket();
        },
        activated(){
            this.getTaskList();
        },
        methods: {
            async getTaskList(){
				var req = {
					"token":getToken()
				}
				const data = await task.getTaskList(JSON.stringify(req));
				if ( data.rtn ==0 ){
					this.taskList = data.data.list || [];
				}
            },	
            getSessionList(obj){
                this.cur_task = obj;
                var req = {
                    "type":"get_chat_list",
                    "job_id":this.cur_task.job_id,
                }
                this.socket.send(this.str2ab(JSON.stringify(req)));
            },
            getMessageList(obj){
                this.cur_session = obj;
                var req = {
                    "type":"get_dialog",
                }
                this.socket.send(this.str2ab(JSON.stringify(req)));
            },
            sendMessage(){
                if ( this.mess_value =="" || !this.cur_session.fid ){
                    return;
                }
                var req = {
                    "type":"send_msg",
                    "fid":this.cur_session.fid,
                    "ofid":this.cur_session.otherFid,
                    "msg":this.mess_value,
                }
                this.socket.send(this.str2ab(JSON.stringify(req)));
                this.mess_value = "";
            },
            connectWesocket(){
                this.socket = new WebSocket(this.$store.getters.baseUrl+"messager");
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
                this.socket.onmessage = (data) => {
                    if ( data.type == "get_chat_list" ){
                        this.accList = data.list || [];
                    }else if ( data.type == "get_dialog" ){
                        this.chatList = data.list || [];
                    }else if ( data.type == "send_msg" ){
                        var div = document.getElementById('chat_list');
                        div.scrollTop = div.scrollHeight;
                    }
                },
                this.socket.onclose = () => {
                    console.log("socket已经关闭");
                }
            },
            str2ab(str) {
                var buf = new ArrayBuffer(str.length); // 2 bytes for each char
                var bufView = new Uint8Array(buf);
                for (var i=0, strLen=str.length; i < strLen; i++) {
                    bufView[i] = str.charCodeAt(i);
                }
                return buf;
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
            }
            .acc-name{
                position: absolute;
                left: 45px;
                right: 20px;
                color: #768492;
                margin-left: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .msg-name{
                position: absolute;
                margin-top: 24px;
                left: 45px;
                right: 20px;
                color: #768492;
                margin-left: 15px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            .unread{
                position: absolute;
                right: 10px;
                top: 23px;
                height: 8px;
                width: 8px;
                border-radius: 25px;
                background-color: #7a9e9f;
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
        .chat-list{
            position: absolute;
            top: 5px;
            bottom: 80px;
            left: 295px;
            right: 15px;
            overflow-y: auto;
            overflow-x: hidden;
            border-bottom: 1px solid #f1eae0;
            .chat-border{
                position: relative;
                margin-top: 15px;
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
                margin-top: 15px;
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                .icon-right{
                    position: relative;
                    width: 40px;
                    height:40px;
                    order: 2;
                    .chat-icon{
                        width: 40px;
                        height:40px;
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
                .chat-body{
                    word-wrap: break-word;
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
                margin-top: 5px;
                padding: 0;
                float: right;
            }
        }
        .send-message{
            position: absolute;
            height:50px;
            bottom: 15px;
            left: 295px;
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
</style>
