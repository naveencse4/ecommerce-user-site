import TYPE from '../types/checkout';

export default function (state = null, action) {
	switch (action.type) {
		case TYPE.CHECKOUT_DATA: return resData(state, action);
		case TYPE.USER_PLACE_ORDER: return resData(state, action);
		case TYPE.AFTER_PAYMENT: return resData(state, action);
		default: return state;
	}
}

function resData(state, action) {
	const { data } = action;
	return data;
}
