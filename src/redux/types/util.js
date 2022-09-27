import prefixer from './prefixer';

const prefix = '@@utilTypes';

const types = {
	REQ_DATA: null,
	RES_COMMON_DATA: null,
	FAIL_DATA: null,
	SELECTED_ZONE_DATA: null,
	GET_NON_SERVING_DAYS: null,
	NOTIFY_AVAILABILITY: null,
	CONFIG_INFO : null
};

export default prefixer(types, prefix);
