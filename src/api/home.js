import request from '@/utils/request';
import store from '@/store'

const func = {
  getServerList:get_server_list,
  getServerInfo:get_server_info,
}

function get_server_list(data) {
  return request({
    url: store.getters.baseUrl+"fbapi/get_servers",                    //查询数据总览
    method: 'post',
    data,
  })
}

function get_server_info(data) {
  return request({
    url: store.getters.baseUrl+"fbapi/get_server_stat",               //查询数据详情
    method: 'post',
    data,
  })
}

export default func