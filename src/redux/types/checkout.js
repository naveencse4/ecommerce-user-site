import prefixer from './prefixer';

const prefix = '@@cartTypes';

const types = {
	REQ_DATA: null,
	CHECKOUT_DATA: null,
	USER_PLACE_ORDER: null,
	AFTER_PAYMENT: null,
	FAIL_DATA: null
};

export default prefixer(types, prefix);
