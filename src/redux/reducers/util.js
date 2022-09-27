import TYPE from '../types/util';
const INITIAL_STATE = {
	selectedZone:{},
	zones:[],
	categories:[],
	configInfo:[],
	cartData:[],
	nonServingDays : {}
};
export default function (state = INITIAL_STATE, action) {
	switch (action.type) {
		case TYPE.RES_COMMON_DATA:
			const { data } = action;
			return {
				...state,
				zones: data.zones,
				categories: data.categories,
				configInfo: data.configInfo,
			}
		case TYPE.SELECTED_ZONE_DATA:
			return {
				...state,
				selectedZone: action.data
			}
		case TYPE.GET_NON_SERVING_DAYS:
			return {
				...state,
				nonServingDays: action.data
			}
		default: return state;
	}
};

export const actions = {
	setSelectedZone: ({ commonData }) => commonData.selectedZone,
	nonServingDays: ({ commonData }) => commonData.nonServingDays
};

export const selectors = {
	getSelectedZone: ({ commonData }) => commonData ? commonData.selectedZone: {},
	getZones: ({ commonData }) => commonData?commonData.zones:[],
	getCategories: ({ commonData }) => commonData.categories,
	getConfigInfo: ({ commonData }) => commonData.configInfo,
	getNonServingDays: ({ commonData }) => commonData ? commonData.nonServingDays: {},
};
