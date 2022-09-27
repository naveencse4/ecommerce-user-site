import TYPE from '../types/category';
const initialState = {};
export default function (state = initialState, action) {
	switch (action.type) {
		case TYPE.RES_CATEGORY_PAGE_DATA: 
			return Object.assign( {...state}, {[action.data.slug]: action.data.info});
		case TYPE.FAIL_DATA: 
			return resData(state, action);
		case TYPE.EMPTY_CAT_DATA: return initialState;
		default: return state;
	}
}

function resData(state, action) {
	const { data } = action;
	return data;
}
