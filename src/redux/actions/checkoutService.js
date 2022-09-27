import TYPE from '../types/checkout';
import api from './root';
import service from './index';

export class CheckoutService {

	userPlaceOrder = (orderDetails) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/user/orders/place', orderDetails)
					.then((response) => {
						dispatch({
							type: TYPE.USER_PLACE_ORDER,
							data: response
						});

						if (response.responseBody.responseData.status === 'PLACED') {
							dispatch(service.getCartData());
						}
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

	afterPayment = (paymentDetails) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/user/orders/afterpayment', paymentDetails)
					.then((response) => {
						dispatch({
							type: TYPE.AFTER_PAYMENT,
							data: response
						});
						dispatch(service.getCartData());
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

}
