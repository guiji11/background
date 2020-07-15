import request from '@/utils/request';
import store from '@/store'

const func = {
  addMailGroup:add_mail_group,
  bindMailGroup:bind_mail_group,
  getMailGroup:get_mail_group,
  deleteGroup:deleteGroup,
}

function add_mail_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/add_mail_group",                 //添加邮件组
    method: 'post',
    data,
  })
}

function bind_mail_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/bind_mail_group",               //绑定邮件组到任务
    method: 'post',
    data,
  })
}

function get_mail_group(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/get_mail_group",                //查询邮件组列表
    method: 'post',
    data,
  })
}

function deleteGroup(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/del_mail_group",                //删除邮件组
    method: 'post',
    data,
  })
}

export default func
