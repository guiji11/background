import path from 'path'
var host = window.location.host;
const state = {
  baseUrl:"http://"+host+"/",
  messageUrl:"ws://"+host+"/",  //192.168.3.97
  jobId:'',
}

const mutations = {
	SET_JOB_ID: (state, value) => {
		state.jobId = value;	
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
