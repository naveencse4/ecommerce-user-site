import prefixer from './prefixer';

const prefix = '@@categoryTypes';

const types = {
	REQ_DATA: null,
	RES_CATEGORY_PAGE_DATA: null,
	EMPTY_CAT_DATA: null,
	FAIL_DATA: null
};

export default prefixer(types, prefix);
