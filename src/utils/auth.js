import Cookies from 'js-cookie'

const TokenKey = 'vue_private_cloud';
const UserKey = 'user_private_cloud';
const UserId = 'id_private_cloud';
const UserType= 'type_private_cloud';
const Userjobid= 'jobid_private_cloud';

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token,{expires:8})
}

export function removeToken() {
	Cookies.remove(TokenKey);
	Cookies.remove(UserKey);
	Cookies.remove(UserId);
	Cookies.remove(UserType);
  return;
}

export function getUser() {
  return Cookies.get(UserKey)
}

export function setUser(name) {
  return Cookies.set(UserKey, name,{expires:8})
}

export function setUserId(name) {
  return Cookies.set(UserId, name,{expires:8})
}

export function setUserType(name) {
  return Cookies.set(UserType, name,{expires:8})
}

export function getUserId() {
  return Cookies.get(UserId)
}

export function getUserType() {
  return Cookies.get(UserType)
}

export function setJobId(name) {
  return Cookies.set(Userjobid, name,{expires:8})
}

export function getJobId() {
  return Cookies.get(Userjobid)
}

