import TYPE from '../types/userLogin';
const initialState = {
    isLogin: false,
    token: null,
    userInfo: {},
    showLoginPopup: false,
    loginError: "",
    userResponse: true,
    addressData: {},
};
export default function (state = initialState, action) {
    const { data } = action;
    switch (action.type) {
        case TYPE.RES_USER_LOGIN:
            return {
                ...state,
                userLoginResponse: data
            }
        case TYPE.FAIL_DATA:
            return {
                ...state,
                loginError: action.data
            }
        case TYPE.RES_USER_EXIST:
            return {
                ...state,
                userResponse: action.data
            }
        case TYPE.RES_USER_REGISTRATION:
            return {
                ...state,
                userRegisterData: data.userData
            }
        case TYPE.TOGGLE_LOGIN_POPUP:
            return {
                ...state,
                showLoginPopup: data
            };
        case TYPE.RES_USER_ADDRESS:
            return {
                ...state,
                addressResponds: action.data
            };
        case TYPE.GET_ADDRESS_DATA:
            return {
                ...state,
                addressData: action.data
            }
        case TYPE.GET_CHECKLIST_DATA:
            return {
                ...state,
                checkList: action.data
            }
        case TYPE.RES_USER_ADDRESS_UPDATE:
            return {
                ...state,
                addressResponds: action.data
            }
        
        case TYPE.GET_PROFILE_DATA:
            return {
                ...state,
                profileData: action.data
        }
        case TYPE.GET_SEARCH_DATA:
            return {
                ...state,
                autoSuggestionData: action.data
            }
        case TYPE.UPDATE_PROFILE_DATA:
            return {
                ...state,
                profileResponds: action.data
            }
        case TYPE.RES_LOGIN_OTP:
            return {
                ...state,
                userLoginOtpResponse: data
            }
        case TYPE.RES_RESET_PASSWORD:
            return {
                ...state,
                userLoginOtpResponse: data
            }
        default: return state;
    }
};
