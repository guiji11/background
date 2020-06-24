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
}

function create_task(data) {                                                    //创建任务
  return request({
    url: url + "fbapi/add_job",
    method: 'post',
    data
  })
}

function get_task_list(data) {                                                   //查询任务
  return request({
    url: url + "fbapi/get_job_list",
    method: 'post',
    data
  })
}

function set_mess(data) {                                                        //创建消息
  return request({
    url: url + "fbapi/add_greet_msg",
    method: 'post',
    data
  })
}

function get_mess(data) {                                                        //查询消息
  return request({
    url: url + "fbapi/get_job_greets",
    method: 'post',
    data
  })
}

function manage_mess(data) {                                                     //管理消息
  return request({
    url: url + "fbapi/manage_msg",
    method: 'post',
    data
  })
}

function set_source(data) {                                                      //创建数据源
  return request({
    url: url + "fbapi/add_group",
    method: 'post',
    data
  })
}

function get_source(data) {                                                      //查询数据源
  return request({
    url: url + "fbapi/get_job_groups",
    method: 'post',
    data
  })
}

function manage_source(data) {                                                    //管理数据源
  return request({
    url: url + "fbapi/manage_group",
    method: 'post',
    data
  })
}

function get_statis(data) {                                                       //查询数据统计
  return request({
    url: url + "fbapi/get_job_stat",
    method: 'post',
    data
  })
}

export default func