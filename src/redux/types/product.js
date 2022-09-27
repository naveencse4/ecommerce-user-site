import prefixer from './prefixer';

const prefix = '@@productTypes';

const types = {
	REQ_DATA: null,
	RES_PRODUCT_PAGE_DATA: null,
	FAIL_DATA: null,
	EMPTY_PRODUCT_PAGE: null,
};

export default prefixer(types, prefix);
