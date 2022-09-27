import prefixer from './prefixer';

const prefix = '@@userData';

const types = {
	REQ_DATA: null,
	RES_USER_LOGIN: null,
    RES_USER_EXIST: null,
	TOGGLE_LOGIN_POPUP: null,
	FAIL_DATA: null,
    RES_USER_REGISTRATION: null,
	RES_USER_ADDRESS: null,
	GET_ADDRESS_DATA: null,
	RES_USER_ADDRESS_UPDATE: null,
	RES_USER_ADDRESS_DELETE: null,
	GET_PROFILE_DATA: null,
	UPDATE_PROFILE_DATA: null,
	GET_SEARCH_DATA: null,
	RES_LOGIN_OTP: null,
	RES_RESET_PASSWORD: null,
	GET_CHECKLIST_DATA: null
};

export default prefixer(types, prefix);
