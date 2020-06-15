<template>
    <div class="mess">
		<div class="start-heart" @click="setHeartBeat()">{{open==0?'开始接单':'停止接单'}}</div>
		<div class="left-content">
            <div v-for="item in accList" :key="item.id" :class="['acc-border',item.id==cur_session.id?'sel':'']" @click="getMessageList(item,1)">
                <svg-icon iconClass="user" class="acc-icon"/>
                <div class="acc-name">{{item.name}}</div>
                <span v-if="item.unread >0" class="unread"></span>
            </div>
        </div>
		<div class="right-content">
			<div class="chat-list" id="chat_list">
                <div v-for="item in chatList" :key="item.id" :class="item.send==0?'chat-border':'chat-border-right'">
                    <div :class="item.send==1?'icon-right':'icon'">
                        <svg-icon :iconClass="item.send==0?'head':'head-right'" class="chat-icon"/>
                    </div>
                    <div v-if="item.send==0" class="chat-name">{{item.name}}</div>
                    <span class="chat-content">{{item.body}}</span>
                </div>
            </div>
            <div class="send-message">
                <input v-model="mess_value" class="content-input" @enter="sendMessage()"/>
                <div class="msg-btn" @click="sendMessage()">发送</div>
            </div>
		</div>
    </div>
</template>

<script>
    import mess from '@/api/message';
    export default {
        data(){
            return {
                mess_value:'',
                open:0,
                accList:[],
                chatList:[],
                cur_time:0,
                cid:'',
                session_time:'',
                cur_session:{},
            }
        },
        mounted(){
            this.getSessionList(0);
        },
        methods: {
            async getSessionList(time){
                var data = await mess.getSessionList(this.cid, time);
                if ( data.rtn == 0 ){
                    this.cur_time = data.time;
                    if ( time == 0 ){
                        this.interval();
                    }
                    data.session_list.sort((a, b) => b.unread-a.unread);
                    this.accList = data.session_list;
                }else{
                    this.$message({
						message: "获取列表失败",
						center: true,
						type: 'error',
						duration: 3 * 1000
					});
                }
            },
            async getMessageList(obj, type){
                this.cur_session = obj;
                var data = await mess.getMessageList(obj);
                if ( data.rtn == 0 ){
                    this.chatList = data.message_list;
                    this.read(obj);
                    if ( type ){
                        var div = document.getElementById('chat_list');
                        div.scrollTop = div.scrollHeight;
                    }
                }
            },
            async read(obj){
                await mess.read(obj);
            },
            async sendMessage(){
                if ( this.mess_value =="" || !this.cur_session.fid ){
                    return;
                }
                var req = {
                    "fid":this.cur_session.fid,
                    "otherFid":this.cur_session.otherFid,
                    "message":this.mess_value,
                    "did":this.cur_session.did,
                    "nickname":this.cur_session.nickname
                }
                await mess.sendMessage(JSON.stringify(req));
                this.mess_value = "";
            },
            async setHeartBeat(value){
                if ( this.open == 0 || value==1 ){
                    var type = 1;
                }else{
                    var type = 0;
                }
                var data = await mess.setHeartBeat(this.cid, type);
                if ( data.rtn == 0 ){
                    this.open = type;
                }
            },
            interval(){
                window.clearInterval(this.session_time);
                // this.session_time = setInterval(function() {
                //     this.getSessionList(this.cur_time);
                //     if ( this.cur_session && this.cur_session.fid ){
                //         this.getMessageList(this.cur_session);
                //     }
                //     if ( this.open == 1 ){
                //         this.setHeartBeat(1);
                //     }
                // }.bind(this), 5000);
            }
        },
    }
</script>

<style lang="less">
    .mess{
        position: absolute;
        top: 65px;
        bottom: 30px;
        left: 19px;
        right:19px;
        max-width: 1100px;
    }
    .start-heart{
        position: absolute;
        top: -50px;
        float: right;
        right: 10px;
        width: 130px;
        height: 36px;
        background-color: #7a9e9f;
        color: #ffffff;
        border-radius: 4px;
        text-align: center;
        line-height: 36px;
        cursor: pointer;
    }
    .left-content{
        position: absolute;
        width:270px;
        height:100%;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
        overflow-y: auto;
        overflow-x: hidden;
        .acc-border{
            position: relative;
            border-bottom: 1px solid #f6f6f6;
            height: 50px;
            line-height: 50px;
            cursor: pointer;
            .acc-icon{
                position: absolute;
                margin-left: 10px;
                margin-top: 5px;
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
        .acc-border:hover,
        .sel{
            background-color: #f6f6f6;
            transition: all .3s;
        }
    }

    .right-content{
        position: absolute;
        left:280px;
        right:10px;
        height:100%;
        background-color: #ffffff;
        border-radius: 6px;
        box-shadow: 0 6px 10px -4px rgba(0,0,0,.15);
        .chat-list{
            position: absolute;
            top: 5px;
            bottom: 80px;
            left: 15px;
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
                    margin-top: 25px;
                    padding: 10px 14px;
                    margin-left: -10px;
                    border: 2px solid #b8d8d8;
                    border-radius: 10px;
                    max-width: 75%;
                    background-color: #b8d8d8;
                    color: #252422;
                    word-wrap: break-word;
                    word-break: normal;
                    overflow-y: auto;  
                    max-height: 400px;
                }
                .chat-content:before{
                    position: absolute;
                    content: "";
                    top: 10px;
                    left: -16px;
                    height: 0;
                    border: 8px solid #b8d8d8;
                    border-left-color: transparent;
                    border-bottom-color: transparent;
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
                    word-wrap:break-word;
                    word-break:normal; 
                    overflow-y: auto;  
                    max-height: 400px;
                }
            }
        }
        .send-message{
            position: absolute;
            height:50px;
            bottom: 15px;
            left: 15px;
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
