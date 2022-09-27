import prefixer from './prefixer';

const prefix = '@@homeTypes';

const types = {
	REQ_DATA: null,
	RES_HOME_PAGE_DATA: null,
	EMPTY_HOME_DATA: null,
	FAIL_DATA: null
};

export default prefixer(types, prefix);
