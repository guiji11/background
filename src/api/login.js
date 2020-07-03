import request from '@/utils/request';
import store from '@/store'

export function login(data) {
  return request({
    url: store.getters.baseUrl+"fb_api/user_login",               //登录
    method: 'post',
    data,
  })
}

export default login
