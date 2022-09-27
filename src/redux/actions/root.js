import axios from 'axios';
import { API_URL } from '../../env';
import Cookies from 'js-cookie';

class Services {
	constructor() {
		this.host = API_URL;
	}
	
	getHeadersInfo = (storeId) => {
		const headers = {};
		// if (storeId) {
		// 	Object.assign(this.headers, { 'store': storeId });
		// } else if (Cookies.get('store')) {
		// 	Object.assign(this.headers, { 'store': Cookies.get('store') });
		// }
		
		if (storeId) {
			Object.assign(headers, { 'store': storeId });
		} else if (Cookies.get('store')) {
			Object.assign(headers, { 'store': Cookies.get('store') });
		}
		if (Cookies.get('token')) {
			Object.assign(headers, { 'Authorization': 'jwt ' + Cookies.get('token') });
			// axios.defaults.headers.common['Authorization'] = this.headers;
		}
		return {headers};
	}

	errorResponseHandler = (error) => {
		if (error.response) {
			const statuscode = error.response.status;
			switch (statuscode) {
				case 401:
				   // window.location.href = '/login';
					break;
				default:
					return error.response.data;
			}
		} else {
			return error.data;
		}
	}

	getData = (url, storeId) => {
		const HEADERS = this.getHeadersInfo(storeId);
		const fullUrl = this.getCompleteUrl(url);
		return new Promise((resolve, reject) => {
			return axios.get(fullUrl, HEADERS)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(this.errorResponseHandler(error));
					// reject(error);
				});
		});
	}

	postData = (url, dataobj) => {
		const HEADERS = this.getHeadersInfo();
		const fullUrl = this.getCompleteUrl(url);
		return new Promise((resolve, reject) => {
			return axios.post(fullUrl, dataobj, HEADERS)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(this.errorResponseHandler(error));
				});
		});
	}

	deleteData = (url) => {
		const HEADERS = this.getHeadersInfo();
		const fullUrl = this.getCompleteUrl(url);
		return new Promise((resolve, reject) => {
			return axios.delete(fullUrl, HEADERS)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(this.errorResponseHandler(error));
				});
		});
	}

	patchData = (url, dataobj) => {
		const HEADERS = this.getHeadersInfo();
		const fullUrl = this.getCompleteUrl(url);
		return new Promise((resolve, reject) => {
			return axios.put(fullUrl, dataobj, HEADERS)
				.then((response) => {
					resolve(response.data);
				})
				.catch((error) => {
					reject(this.errorResponseHandler(error));
				});
		});
	}

	getCompleteUrl = (url) => {
		return this.host + url;		
	}

}
const api = new Services();
export default api;