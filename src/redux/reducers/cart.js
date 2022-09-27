import TYPE from '../types/cart';
const initialState = {count: null, cartData: []};
export default function (state = initialState, action) {
	const { data } = action;
	switch (action.type) {
		case TYPE.CART_DATA: return {
			...state,
			count: data.stats.all,
			cartData: data.data
		};
		default: return state;
	}
}
