import TYPE from '../types/product';
const initialState = {};
export default function (state = initialState, action) {
	switch (action.type) {
		case TYPE.RES_PRODUCT_PAGE_DATA: 
			return Object.assign( {...state}, {[action.data.slug]: action.data.info});
		case TYPE.FAIL_DATA: 
			return resData(state, action);
		case TYPE.EMPTY_PRODUCT_PAGE: return initialState;
		default: return state;
	}
}

function resData(state, action) {
	const { data } = action;
	return data;
}
