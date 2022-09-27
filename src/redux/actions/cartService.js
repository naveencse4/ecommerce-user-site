import TYPE from '../types/cart';
import api from './root';

export class CartService {
	
	updateCart = (variant = null) => {
		return (dispatch) => {
			const data = {
				product : variant.id,
				quantity : variant.quantity
			}
			return new Promise((resolve, reject) => {
                api.postData('/user/cart', data)
					.then((response) => {
						dispatch({
							type: TYPE.CART_DATA,
							data: response.responseBody.responseData
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	}
	
    getCartData = () => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
            api.getData('/user/cart', '')
                .then((response) => {
                    dispatch({
                        type: TYPE.CART_DATA,
                        data: response.responseBody.responseData,
                    });
                    resolve();
                })
                .catch((error) => {
                    dispatch({
                        type: TYPE.FAIL_DATA,
                        data: error
                    });
                    reject(error);
                });
            });
        };
    };
}
