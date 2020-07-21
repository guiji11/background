import request from '@/utils/request';
import store from '@/store'

const func = {
  addUser:add_user,
  getAllUser:get_all_user,
  manageUser:manage_user,
  assignTask:assign_task
}

function add_user(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/add_user",                      //创建用户
    method: 'post',
    data,
  })
}

function get_all_user(data) {                                          //查询子用户
  return request({
    url: store.getters.baseUrl + "fb_api/get_all_user",
    method: 'post',
    data
  })
}


function manage_user(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/manage_user",                  //管理用户, 0：启用；-1：禁用；-2：删除
    method: 'post',
    data,
  })
}

function assign_task(data) {                                          //授权任务给子账号
  return request({
    url: store.getters.baseUrl + "fb_api/assign_task",
    method: 'post',
    data
  })
}

export default func
