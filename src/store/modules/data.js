import path from 'path'

const state = {
  baseUrl:"http://192.168.3.97/",
  messageUrl:"ws://192.168.3.97/",  //192.168.3.97
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
