import request from '@/utils/request';
import store from '@/store'
const url = store.getters.baseUrl;

const func = {
  createTask:create_task,
  getTaskList:get_task_list,
  setMess:set_mess,
  getMess:get_mess,
  setSource:set_source,
  getSource:get_source,
  getStatis:get_statis,
  manageMess:manage_mess,
  manageSource:manage_source,
  setAutoDialog:set_auto_dialog,
  getAutoDialog:get_auto_dialog,
  setJobRuntime:set_job_runtime,
  getUserSendStat:get_user_send_stat,
  setUserSendNum:set_user_send_msg_num
}

function create_task(data) {                                                    //创建任务
  return request({
    url: url + "fb_api/add_job",
    method: 'post',
    data
  })
}

function get_task_list(data) {                                                   //查询任务
  return request({
    url: url + "fb_api/get_job_list",
    method: 'post',
    data
  })
}

function set_mess(data) {                                                        //创建消息
  return request({
    url: url + "fb_api/add_greet_msg",
    method: 'post',
    data
  })
}

function get_mess(data) {                                                        //查询消息
  return request({
    url: url + "fb_api/get_job_greets",
    method: 'post',
    data
  })
}

function manage_mess(data) {                                                     //管理消息
  return request({
    url: url + "fb_api/manage_msg",
    method: 'post',
    data
  })
}

function set_source(data) {                                                      //创建数据源
  return request({
    url: url + "fb_api/add_group",
    method: 'post',
    data
  })
}

function get_source(data) {                                                      //查询数据源
  return request({
    url: url + "fb_api/get_job_groups",
    method: 'post',
    data
  })
}

function manage_source(data) {                                                    //管理数据源
  return request({
    url: url + "fb_api/manage_group",
    method: 'post',
    data
  })
}

function get_statis(data) {                                                       //查询数据统计
  return request({
    url: url + "fb_api/get_job_stat",
    method: 'post',
    data
  })
}

function set_auto_dialog(data) {                                                  //操作智能回复
  return request({
    url: url + "fb_api/update_auto_dialog",
    method: 'post',
    data
  })
}

function get_auto_dialog(data) {                                                  //查询智能回复
  return request({
    url: url + "fb_api/get_auto_dialog",
    method: 'post',
    data
  })
}

function set_job_runtime(data) {                                                 //设置消息下发时间
  return request({
    url: url + "fb_api/set_job_runtime",
    method: 'post',
    data
  })
}

function get_user_send_stat(data) {                                               //查询用户消息发送总数
  return request({
    url: url + "fb_api/get_user_send_stat",
    method: 'post',
    data
  })
}

function set_user_send_msg_num(data) {                                             //设置用户消息发送总数
  return request({
    url: url + "fb_api/set_user_send_msg_num",
    method: 'post',
    data
  })
}

export default func