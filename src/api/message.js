import request from '@/utils/request';
import store from '@/store'
const url = store.getters.messageUrl;

const func = {
  getSessionList:get_session_list,
  setHeartBeat:set_heart_beat,
  getMessageList:get_message_list,
  read:read,
  sendMessage:send_message
}

function set_heart_beat(cid,type) {                                                   //心跳
  return request({
    url: url + "heartbeat.php?cid="+cid+"&open="+type,
    method: 'get',
  })
}

function get_session_list(cid,time) {                                                 //获取会话列表
  return request({
    url: url + "get_session_list.php?cid="+cid+"&time="+time,
    method: 'get',
  })
}

function get_message_list(obj) {                                                      //获取会话内容
  return request({
    url: url + "get_message_list.php?fid="+obj.fid+"&otherFid="+obj.otherFid,
    method: 'get',
  })
}

function read(obj) {                                                                  //标记已读
  return request({
    url: url + "read.php?fid="+obj.fid+"&otherFid="+obj.otherFid,
    method: 'get',
  })
}

function send_message(data) {                                                         //发送消息
  return request({
    url: url + "send_message.php",
    method: 'post',
    data
  })
}

export default func