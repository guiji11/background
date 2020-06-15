import path from 'path'

const state = {
  baseUrl:"http://192.168.0.53:8330/",
  messageUrl:"http://47.106.186.189/messenger/api/chat/",
}

const mutations = {
	ADD_CLIENT_INFO: (state, routes) => {
		state.client_info = routes;	
	}
}

const actions = {
  set_header({ commit }, value) {
    commit('SET_HEADER',value)
  },
}
			
export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
