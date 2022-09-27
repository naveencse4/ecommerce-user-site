import TYPE from '../types/util';
import api from './root';
import service from './index';
import StaticConstants, {getMinOrderValue} from "../../components/constants/StaticConstants";

export class UtilService {
    getUserCommonData = () => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
            api.getData('/public/commondata', '')
                .then((response) => {
                    try{
                        StaticConstants.configInfo = response.responseBody.responseData.configInfo.data
                        getMinOrderValue()
                    }catch (e) {
                        console.log(e)
                    }
                    dispatch({
                        type: TYPE.RES_COMMON_DATA,
                        data: response.responseBody.responseData
                    });
                     resolve(
                         dispatch(service.getCartData()),
                        //  dispatch(service.getAddressData()),
                        //  dispatch(service.getProfileData()),
                        //  dispatch(service.getSearchData()),
                        //  dispatch(service.getNonServingDays())
                     );
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

	setSelectedZone = (zone) => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
				dispatch({
					type: TYPE.SELECTED_ZONE_DATA,
					data: zone
				});
				resolve();
            });
        };
    };

    getNonServingDays = () => {
        return (dispatch) => {
            return new Promise((resolve, reject) => {
                api.getData('/public/notservingdates', '')
                    .then((response) => {
                        StaticConstants.nonServingDaysData = response.responseBody.responseData.data
                        dispatch({
                            type: TYPE.GET_NON_SERVING_DAYS,
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

    notifyAvailability = (variant = null) => {
        return (dispatch) => {
            const data = {
                product : variant.id
            }
            return new Promise((resolve, reject) => {
                api.postData('/user/cart/notifyme', data)
                    .then((response) => {
                        dispatch({
                            type: TYPE.NOTIFY_AVAILABILITY,
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
