import TYPE from '../types/orders';

const initialState = {
    ordersAll: null,
    singleOrder:{},
};

export default function (state = initialState, action) {
	switch (action.type) {
		case TYPE.RES_ORDERS_LIST_PAGE_DATA: 
		return {
			...state,
			ordersAll: action.data
		}
		case TYPE.RES_ORDER_SINGLE_PAGE: 
			return {
				//singleOrder: Object.assign( {...state}, {[action.data.id]: action.data})
				singleOrder: action.data
			}
		case TYPE.FAIL_DATA: return resData(state, action);
		default: return state;
	}
}

function resData(state, action) {
	const { data } = action;
	return data;
}