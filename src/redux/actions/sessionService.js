import Cookies from 'js-cookie';
import { COOKIE_MAX_AGE } from '../../components/constants/constants';
export class SessionService {
	
    setUserLoginInfo = (token) => {
        this.setCookieData('token', token);
    };

    setCookieData = (name, value) => {
        return Cookies.set(name, value, {expires: COOKIE_MAX_AGE});
    };

    getCookieData = (name) => {
        return Cookies.get(name);
    };

    deleteCookieData = (name)=>{
        return Cookies.remove(name);
    }

    getUserLoginInfo = () =>{
        return Cookies.get('token');
    }

    getUserStore = () =>{
        return Cookies.get('store');
    }

    isLogin = () => {
        return Cookies.get('token') ? true : false;
    }
}