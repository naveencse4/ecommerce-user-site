import prefixer from './prefixer';

const prefix = '@@cartTypes';

const types = {
	REQ_DATA: null,
	CART_DATA: null,
	FAIL_DATA: null
};

export default prefixer(types, prefix);
