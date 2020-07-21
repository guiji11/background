import request from '@/utils/request';
import store from '@/store'

const func = {
  addSrcGroup:add_src_group,
  bindSrcGroup:bind_src_group,
  getSrcGroup:get_src_group,
  deleteGroup:deleteGroup,
}

function add_src_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/add_src_group",                 //添加数据源组，1：邮箱组；2：自建FB成员组
    method: 'post',
    data,
  })
}

function bind_src_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/bind_src_group",               //绑定数据源组到任务
    method: 'post',
    data,
  })
}

function get_src_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/get_src_group",                //查询数据源组列表
    method: 'post',
    data,
  })
}

function deleteGroup(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/del_src_group",                //删除数据源组
    method: 'post',
    data,
  })
}

export default func
