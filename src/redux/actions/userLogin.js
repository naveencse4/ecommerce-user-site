import TYPE from '../types/userLogin';
import api from './root';
import {installed_version} from '../../../package.json';
export class UserLoginPage {

	postUserLogin = (userData) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/public/userlogin', userData)
					.then((response) => {
						dispatch({
							type: TYPE.RES_USER_LOGIN,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	}

	postRegistrationData = (userData) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/public/register', userData)
					.then((response) => {
						dispatch({
							type: TYPE.RES_USER_REGISTRATION,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

	isUserExist = (userData) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/public/isuserexist', userData)
					.then((response) => {
						dispatch({
							type: TYPE.RES_USER_EXIST,
							data: response
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	}

	toggleLoginPopup = (flag) => {
		return (dispatch) => {
			dispatch({
				type: TYPE.TOGGLE_LOGIN_POPUP,
				data: flag
			});
		};
	}


	postUserAdderess = (userAddress) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/user/address', userAddress)
					.then((response) => {
						dispatch({
							type: TYPE.RES_USER_ADDRESS,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

	updateUserAdderess = (userAddress, id) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.patchData('/user/address/' + id, userAddress)
					.then((response) => {
						dispatch({
							type: TYPE.RES_USER_ADDRESS_UPDATE,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}
	
	getAddressData = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/user/address', '')
					.then((response) => {
						dispatch({
							type: TYPE.GET_ADDRESS_DATA,
							data: response.responseBody.responseData,
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	};

	getProfileData = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData('/user/profile', '')
					.then((response) => {
						dispatch({
							type: TYPE.GET_PROFILE_DATA,
							data: response.responseBody.responseData,
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	};

	updateProfileData = (profileData, id) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.patchData('/user/updateprofile/', profileData)
					.then((response) => {
						dispatch({
							type: TYPE.UPDATE_PROFILE_DATA,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						reject(error);
					});
			});
		};
	}

	getSearchData = (queryData) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData("/public/products/autosuggestions?search=" + queryData+ "&offset=0&limit=5",'')
					.then((response) => {
						dispatch({
							type: TYPE.GET_SEARCH_DATA,
							data: response,
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	};

	loginWithOtp = (data) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/public/userlogin/otp', data)
					.then((response) => {
						dispatch({
							type: TYPE.RES_LOGIN_OTP,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	}

	resetPassword = (data) => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.postData('/public/resetpassword', data)
					.then((response) => {
						dispatch({
							type: TYPE.RES_RESET_PASSWORD,
							data: response
						});
						resolve(response);
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	}

	checkList = () => {
		return (dispatch) => {
			return new Promise((resolve, reject) => {
				api.getData(`/user/checklist?platform=web&appType=USER_WEB&installedVersion=${installed_version}`, '')
					.then((response) => {
						dispatch({
							type: TYPE.GET_CHECKLIST_DATA,
							data: response.responseBody.responseData,
						});
						resolve();
					})
					.catch((error) => {
						dispatch({
							type: TYPE.FAIL_DATA,
							data: error
						});
						reject(error);
					});
			});
		};
	};
}
