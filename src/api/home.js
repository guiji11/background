import request from '@/utils/request';
import store from '@/store'

const func = {
  getServerList:get_server_list,
  getServerInfo:get_server_info,
  getMessInfo:get_mess_info,
  setServerCc:set_server_cc,
}

function get_server_list(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/get_servers",                    //查询数据总览
    method: 'post',
    data,
  })
}

function get_server_info(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/get_server_stat",               //查询数据详情
    method: 'post',
    data,
  })
}

function get_mess_info(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/get_greet_succ_stat",           //查询消息详情
    method: 'post',
    data,
  })
}

function set_server_cc(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/set_server_cc",                //编辑机器并发数
    method: 'post',
    data,
  })
}

export default func
