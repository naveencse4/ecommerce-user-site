import { ProductService } from './productService';
import { CategoryService } from './categoryService';
import { HomePageService } from './homeService';
import { CartService } from './cartService';
import { CheckoutService } from './checkoutService';
import { UtilService } from './utilService';
import { UserLoginPage } from './userLogin';
import { SessionService } from './sessionService'
import { OrdersService } from './ordersService';

class AllServices {
    constructor () {
        this.catService = new CategoryService();
        this.productService = new ProductService();
        this.homeService = new HomePageService();
        this.cartService = new CartService();
        this.checkoutService = new CheckoutService();
        this.utilService = new UtilService();
        this.userLoginPage = new UserLoginPage();
        this.sessionService = new SessionService();
        this.ordersService = new OrdersService();
    }

    getUserCommonData = (storeId) => {
        return this.utilService.getUserCommonData(storeId);
    }

    getProductPageData = (slug, storeId) => {
        return this.productService.getProductPageData(slug, storeId);
    }

    getCategoryPageData = (slug, storeId) => {
        return this.catService.getCategoryPageData(slug, storeId);
    }

    getHomeData = (re, storeId) => {
        return this.homeService.getHomeData(re, storeId);
    }

    getHomeDataSSR = (re, storeId) => {
        return this.homeService.getHomeDataSSR(re, storeId);
    }
    
    getProductPageDataSSR = (slug, storeId) => {
        return this.productService.getProductPageDataSSR(slug, storeId);
    }

    getSingleOrderData =(slug, storeId)=>{
        return this.ordersService.getSingleOrderData(slug, storeId);
    }

    getSingleOrderDataSSR =(slug, storeId)=>{
        return this.ordersService.getSingleOrderDataSSR(slug, storeId);
    }

    getCategoryPageDataSSR = (slug, storeId) => {
        return this.catService.getCategoryPageDataSSR(slug, storeId);
    }

    getOrdersListData = (status, offset, limit, storeId) => {
        return this.ordersService.getOrdersListData(status, offset, limit, storeId);
    }

    updateCart = (variant) => {
        if (this.isLogin()) {
            return this.cartService.updateCart(variant);
        } else {
            return this.userLoginPage.toggleLoginPopup(true);
        }
    }

    getCartData = () => {
        if (this.isLogin()) {
            return this.cartService.getCartData();
        } else{
            return {
                    type: "",
                    data: {}
            };
        }
    }

    getAddressData = () => {
        if (this.isLogin()) {
            return this.userLoginPage.getAddressData();
        } else{
            return {
                    type: "",
                    data: {}
            };
        }
    }

    getProfileData = () =>{
        if (this.isLogin()) {
            return this.userLoginPage.getProfileData();
        } else{
            return {
                    type: "",
                    data: {}
            };
        }
    }
    checkList = () => {
        return this.userLoginPage.checkList();
    }
    updateProfileData = (profileData, id) =>{
        return this.userLoginPage.updateProfileData(profileData, id);
    }

    checkoutCart = (storeId) => {
        if (this.isLogin()) {
           return this.checkoutService.checkoutCart(storeId);
        } else {
            return this.userLoginPage.toggleLoginPopup(true);
        }
    }

    setSelectedZone = (zone) => {
        return this.utilService.setSelectedZone(zone);
    }

    getNonServingDays = () => {
        return this.utilService.getNonServingDays()
    }

    notifyProductAvailability = (variant) => {
        if (this.isLogin()) {
            return this.utilService.notifyAvailability(variant)
        } else {
            return this.userLoginPage.toggleLoginPopup(true);
        }
    }

    userPlaceOrder = (orderDetails) =>{
        return this.checkoutService.userPlaceOrder(orderDetails);
    }

    afterPayment = (paymentDetails) =>{
        return this.checkoutService.afterPayment(paymentDetails);
    }

    postRegistrationData = (userData) => {
        return this.userLoginPage.postRegistrationData(userData);
    }

    postUserAdderess = (userAddress) =>{
        return this.userLoginPage.postUserAdderess(userAddress);
    }

    updateUserAdderess = (userAddress, id) =>{
        return this.userLoginPage.updateUserAdderess(userAddress, id);
    }

    postUserLogin = (userData) => {
        return this.userLoginPage.postUserLogin(userData);
    }

    setUserLoginInfo = (userData) => {
        return this.sessionService.setUserLoginInfo(userData);
    }

    getUserLoginInfo = (userData) => {
        return this.sessionService.getUserLoginInfo(userData);
    }

    isLogin = () => {
        return this.sessionService.isLogin();
    }

    setCookieData = (name, value) => {
        return this.sessionService.setCookieData(name, value);
    }

    getCookieData = (name) => {
        return this.sessionService.getCookieData(name);
    }

    deleteCookieData = (name) => {
        return this.sessionService.deleteCookieData(name);
    }

    toggleLoginPopup = (data) => {
        return this.userLoginPage.toggleLoginPopup(data);
    }

    isUserExist = (userData) => {
        return this.userLoginPage.isUserExist(userData);
    }

    getSearchData = (queryData) =>{
        return this.userLoginPage.getSearchData(queryData);
    }

    loginWithOtp = (userData) => {
        return this.userLoginPage.loginWithOtp(userData)
    }

    resetPassword = (userData) => {
        return this.userLoginPage.resetPassword(userData)
    }

    emptyHomeData = () => {
        return this.homeService.emptyHomeData();
    }

    emptyCategoryData = () => {
        return this.catService.emptyCategoryData();
    }
    
    emptyProductPage = () => {
        return this.productService.emptyProductPage();
    }

}

const service = new AllServices();
export default service;
