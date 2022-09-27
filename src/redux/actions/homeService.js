import TYPE from '../types/home';
import UTYPE from '../types/util';
import api from './root';
import service from './index';

export class HomePageService {

	getHomeData = (re, storeId) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/public/homepage?appType=USER_WEB', storeId)
					.then((response) => {
						dispatch({
							type: TYPE.RES_HOME_PAGE_DATA,
							data: response
						});
						dispatch(service.emptyCategoryData());
						resolve(dispatch(service.emptyProductPage()));
					})
					.catch((error) => {
						// dispatch({
						// 	type: TYPE.FAIL_DATA,
						// 	data: error
						// });
						reject(error);
					});
			});
		};
	}

	getHomeDataSSR = (re, storeId) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/public/homepage?appType=USER_WEB', storeId)
					.then((response) => {
						dispatch({
							type: TYPE.RES_HOME_PAGE_DATA,
							data: response
						});
					    resolve(dispatch(service.getUserCommonData()));
					})
					.catch((error) => {
						// dispatch({
						// 	type: TYPE.FAIL_DATA,
						// 	data: error
						// });
						reject(error);
					});
			});
		};
	}

	emptyHomeData = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				dispatch({
					type:TYPE.EMPTY_HOME_DATA,
					data: ""
				});	
				resolve();
			});
		};
	}
}
