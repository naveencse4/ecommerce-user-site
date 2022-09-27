import prefixer from './prefixer';

const prefix = '@@homeTypes';

const types = {
	REQ_DATA: null,
	RES_ORDERS_LIST_PAGE_DATA: null,
	RES_ORDER_SINGLE_PAGE: null,
	FAIL_DATA: null
};

export default prefixer(types, prefix);
