import TYPE from '../types/orders';
import api from './root';

export class OrdersService {

	getOrdersListData = (status, offset, limit, storeId) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/user/orders?status='+ status+'&offset='+offset+'&limit='+limit, storeId)
					.then((response) => {
						dispatch({
							type: TYPE.RES_ORDERS_LIST_PAGE_DATA,
							data: response
						});
						resolve();
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

	getSingleOrderData = (slug, storeId) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/public/order/' + slug.params.slug, storeId)
					.then((response) => {
						dispatch({
							type: TYPE.RES_ORDER_SINGLE_PAGE,
							data: response.responseBody.responseData
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

	getSingleOrderDataSSR = (slug, storeId) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/public/order/' + slug.params.slug, storeId)
					.then((response) => {
						dispatch({
							type: TYPE.RES_ORDER_SINGLE_PAGE,
							data: response.responseBody.responseData
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}
	
}
