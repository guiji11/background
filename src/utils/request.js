import axios from 'axios'
import { Message } from 'element-ui';

const service = axios.create({
	baseURL: "", 
	timeout: 360000 // request timeout
})

service.interceptors.request.use(
	config => {
	//  if (store.getters.token) {
	//    // ['X-Token'] is a custom headers key
	//    //config.headers['X-Token'] = getToken()
	//  }
		config.headers['content-type'] = 'application/json';
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response.data
		return res
	},
	error => {
//	    Message({
//		    message: error.message,
//		    type: 'error',
//		    center:true,
//		    duration: 3 * 1000
//	    })
	    return Promise.reject(error)
	}
)

export default service
