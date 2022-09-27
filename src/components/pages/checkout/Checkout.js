import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link, matchPath } from 'react-router-dom';
import service from '../../../redux/actions/index';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { routes } from '../../../universal/routes';
import OperationsBlock from '../../common/OperationsBlock';
import './Checkout.scss';
import './Checkout.css';
import { Modal } from 'react-bootstrap';
import { Collapse } from "react-bootstrap";
import UserAddress from '../profile/userAddress';
import Cookies from 'js-cookie';
import Spinner from '../../common/Spinner';
import { rzp_key } from '../../../env';
import StaticConstants, {getMinOrderValue} from "../../constants/StaticConstants";
import Locations from '../../common/Locations';
import { SPINNER_TIME } from '../../../components/constants/constants';
import PopUp from '../../common/PopUp';

class Checkout extends Component {

    constructor(props) {
        super(props);
        this.state = {
            payOnline: false,
            cashOnDelivary: false,
            userAddressModel: false,
            selectedAddress: '',
            inputEditData: {},
            slotDate: "",
            slotVegDate: "",
            deliveryType: "groceries",
            selectedOption: Cookies.get('zoneValue'),
            selectedSlot: "",
            accordionCart: false,
            accordionAdress: true,
            accordionPayment: true,
            addressOpen: true,
            paymentOpen: true,
            errorSelectedAddress: false,
            errorSlotDate: false,
            errorSelectedSlot: false,
            btnCount: 0,
            varientId: "",
            showPageSpinner: false,
            isCartLoading: true,
            isDeliveryInstructions : false,
            deliveryInstructions : "",
            showDelInstructionsError: false,
            orderFailedModal: false,
            noNewAddress: false,
            checkoutAddress: true,
            changeZone: false,
            onlyPopup: true,
            minOrderpopUp : false
        }

    }

    componentWillUnmount() {
        Checkout.s = 0
    }

    static loadData(req) {
        function getRouteData() {
            let matchingRoute = routes.find(route => {
                return matchPath(req.path, route);
            });
            return matchPath(req.path, matchingRoute);
        }
        return getRouteData();
    }

    componentDidMount() {
        if (this.props.nonServingDays!==undefined){
            // console.log(this.props.nonServingDays)
        }

        if (!service.getCookieData('token')) {
            this.props.history.push('/');
        }
        this.scrollAnimation('cart-prods');
        this.props.getAddressData();
        this.props.getProfileData();
        this.props.getNonServingDays();
        this.setState({ isCartLoading: this.props.cartCount >= 0 ? false : true });
        window.scrollTo(0, 0);
        // this.setState({ orderFailedModal: true })

        // if (this.props.cartData) {
        //     this.setState({isCartLoading: false})
        // }
        // only fetch data if it does not already exist
        //	if (!this.props.data) this.props.getData();

    }

    componentDidUpdate(prevProps) {
       
        if (this.props.cartCount !== prevProps.cartCount) {
            this.setState({ isCartLoading: this.props.cartCount >= 0 ? false : true })
        }
		if (this.props.selectedZone !== prevProps.selectedZone) {
            this.props.getCartData();
            // this.scrollAnimation('cart-prods');
            //window.scrollTo(0, 0);
            this.setState({ accordionCart: false, accordionAdress: true, accordionPayment: true, selectedAddress: "", slotDate: "", selectedSlot: "" });
            this.setState({showPageSpinner:true}, ()=>{
                setTimeout(()=>{
                    this.setState({showPageSpinner: false});
                }, 2000)
                
            });
            
		}
    }
    
	popUpState = (e) => {
		this.setState({ minOrderpopUp: e })
    }
    
    accordionCartShowHide = () => {
        this.setState({
            accordionCart: !this.state.accordionCart
        });
    };

    accordionAddressShowHide = () => {
        this.setState({
            accordionAdress: !this.state.accordionAdress
        });
    };

    openDeliveryInstructions = () => {
        this.setState({
            isDeliveryInstructions: true,
        })
    }

    accordionPaymentShowHide = () => {
        this.setState({
            accordionPayment: !this.state.accordionPayment
        });
    };

    openAddressHandler = () => {
        let minValue = getMinOrderValue()
        if (parseFloat(this.totalCartValue()).toFixed(2)<minValue){
          //  alert("Minimum order value must be "+minValue)
            this.popUpState(true);
            return
        }
        this.setState({
            addressOpen: false,
            accordionAdress: false,
            accordionCart: true,
        });
        this.scrollAnimation('usr-adres');
    };

    openPaymentHandler = () => {
        let minValue = getMinOrderValue()
        if (parseFloat(this.totalCartValue()).toFixed(2)<minValue){
           // alert("Minimum order value must be "+minValue)
           this.popUpState(true);
           return
        }
        const {
            selectedAddress,
            slotDate,
            selectedSlot
        } = this.state;

        if (selectedAddress === "") {
            this.setState({
                errorSelectedAddress: true,
                noNewAddress : true
            });
            this.scrollAnimation('usr-adres');
        }
       
        if (slotDate === "") {
            this.setState({
                errorSlotDate: true,
            });
        }

        if (selectedSlot === "") {
            this.setState({
                errorSelectedSlot: true,
            });
        }

        if (selectedAddress !== "" && slotDate !== "" && selectedSlot !== "") {
            this.setState({
                paymentOpen: false,
                accordionPayment: false,
                accordionAdress: true,
                accordionCart: true,

            });
            this.scrollAnimation('payment-opts');
        }
    };

    scrollAnimation = (element) => {
        // var element = document.getElementById(element);
        // var headerOffset = 50;
        // var elementPosition = element.getBoundingClientRect().top;
        // var offsetPosition = elementPosition - headerOffset;

        // window.scrollTo({
        //     top: 50,
        //     behavior: "smooth"
        // });
        document.getElementById(element).scrollIntoView({behavior: "smooth"});
    }

    payOnline = () => {
        this.setState({
            cashOnDelivary: false,
            payOnline: true,
        })
    }

    cashOnDelivary = () => {
        this.setState({
            payOnline: false,
            cashOnDelivary: true,
        })
    }

    showAddressModel = () => {
        this.setState({ userAddressModel: true, inputEditData: "" });
        
    }

    closeAddressModel = () => {
        this.setState({ userAddressModel: false });
    }

    handleSelected = (e, value) => {
        this.setState({
            selectedAddress: value,
            errorSelectedAddress: false,
        })
    }

    handleSelectedSlot = (e, slot,filterSlots) => {

        var d = new Date()
        let mm = d.toLocaleString('default', { month: 'short' });
        let dd = String(d.getDate()).padStart(2, '0');

        if (Math.floor(slot.startHour)<=d.getHours()&&this.state.slotDate===(dd+" "+mm)) {
            alert("Slot not available")
            return
        }

        this.setState({
            selectedSlot: slot.id,
            errorSelectedSlot: false,
        })
    }

    // editAddressHandler = (address) => {
    //     this.setState({
    //         inputEditData: address,
    //         userAddressModel: true,
    //     });
    // };

    handleDeliverySlot = (e, slotDate, fulldate) => {
        this.setState({
            slotDate: slotDate,
            errorSlotDate: false,
            selectedSlot : '',
            fulldate: fulldate
        });
    }

    handleDeliveryVegSlot = (e, slotVegDate) => {
        this.setState({ slotVegDate: slotVegDate });
    }

    handleDeliveryType = (e, valueType) => {
        this.setState({ deliveryType: valueType });
    }

    totalCartValue = () => {
        return this.props.cartData.reduce((sum, item) => sum + parseInt(item.quantity * item.maxPrice), 0);
    }

    getSystemInfo = () => {
        //############## browser detection and version ##############
		var module = {
			options: [],
			header: [navigator.platform, navigator.userAgent, navigator.appVersion, navigator.vendor, window.opera],
			dataos: [
				{ name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
				{ name: 'Windows', value: 'Win', version: 'NT' },
				{ name: 'iPhone', value: 'iPhone', version: 'OS' },
				{ name: 'iPad', value: 'iPad', version: 'OS' },
				{ name: 'Kindle', value: 'Silk', version: 'Silk' },
				{ name: 'Android', value: 'Android', version: 'Android' },
				{ name: 'PlayBook', value: 'PlayBook', version: 'OS' },
				{ name: 'BlackBerry', value: 'BlackBerry', version: '/' },
				{ name: 'Macintosh', value: 'Mac', version: 'OS X' },
				{ name: 'Linux', value: 'Linux', version: 'rv' },
				{ name: 'Palm', value: 'Palm', version: 'PalmOS' }
			],
			databrowser: [
				{ name: 'Chrome', value: 'Chrome', version: 'Chrome' },
				{ name: 'Firefox', value: 'Firefox', version: 'Firefox' },
				{ name: 'Safari', value: 'Safari', version: 'Version' },
				{ name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
				{ name: 'Opera', value: 'Opera', version: 'Opera' },
				{ name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
				{ name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' }
			],
			init: function () {
				var agent = this.header.join(' '),
					os = this.matchItem(agent, this.dataos),
					browser = this.matchItem(agent, this.databrowser);
				
				return { os: os, browser: browser };
			},
			matchItem: function (string, data) {
				var i = 0,
					j = 0,
					html = '',
					regex,
					regexv,
					match,
					matches,
					version;
				
				for (i = 0; i < data.length; i += 1) {
					regex = new RegExp(data[i].value, 'i');
					match = regex.test(string);
					if (match) {
						regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
						matches = string.match(regexv);
						version = '';
						if (matches) { if (matches[1]) { matches = matches[1]; } }
						if (matches) {
							matches = matches.split(/[._]+/);
							for (j = 0; j < matches.length; j += 1) {
								if (j === 0) {
									version += matches[j] + '.';
								} else {
									version += matches[j];
								}
							}
						} else {
							version = '0';
						}
						return {
							name: data[i].name,
							version: parseFloat(version)
						};
					}
				}
				return { name: 'unknown', version: 0 };
			}
		};
		
		var e = module.init();
		return {
            'os.name': e.os.name,
            'os.version': e.os.version,
            'browser.name': e.browser.name,
            'browser.version': e.browser.version,
            'navigator.userAgent': navigator.userAgent,
            'navigator.appVersion': navigator.appVersion,
            'navigator.platform': navigator.platform,
            'navigator.vendor': navigator.vendor,
        }
		//############## browser detection and version ##############
    }

    placeOrderHandler = () => {
        let minValue = getMinOrderValue()
        if (parseFloat(this.totalCartValue()).toFixed(2)<minValue){
           // alert("Minimum order value must be "+minValue)
            this.popUpState(true);
            return
        }
        const {
            selectedSlot,
            slotVegDate,
            slotDate,
            selectedAddress,
            cashOnDelivary,
            payOnline,
            fulldate,
            deliveryInstructions
        } = this.state;

        var today = new Date();
        const invoiceValue = this.totalCartValue();
        const groceriesDeliveryDate = slotDate !== "" ? slotDate + " " + today.getFullYear() : null;
        const VegDeliveryDate = slotVegDate !== "" ? slotVegDate + " " + today.getFullYear() : null;

        const orderDetails = {
            "deliverySlot": selectedSlot,
            "promoCode": "",
            "orderType": "PREORDER",
            "deliveryType": "DELIVERY",
            // "deliveryDate": groceriesDeliveryDate,
            "expectedDelivery": {
                "date": fulldate,
                "vegDeliveryDate": VegDeliveryDate,
            },
            "deliveryPreference": null,
            "userAddress": selectedAddress,
            "paymentType": payOnline ? "TRANSFER" : "COD",
            "generalDiscount": 0,
            "promocodeDiscount": 0,
            "invoiceValue": invoiceValue,
            "userPaidAmount": invoiceValue,
            "store": Cookies.get('store'),
            "notes" : deliveryInstructions,
            "deviceInfo":this.getSystemInfo(),
        }

        const _this = this;
        // this.setState({ showPageSpinner: true });
        if (selectedAddress === "") {
            this.setState({
                errorSelectedAddress: true,
                noNewAddress : true
            });
            this.setState({
                addressOpen: false,
                accordionAdress: false,
                accordionCart: true,
                paymentOpen: true,
                accordionPayment: true,
            });
            this.scrollAnimation('usr-adres');
        }
       
        if (slotDate === "") {
            this.setState({
                errorSlotDate: true,
            });
            this.scrollAnimation('usr-adres');
        }

        if (selectedSlot === "") {
            this.setState({
                errorSelectedSlot: true,
            });
            this.scrollAnimation('usr-adres');
        }

        if (selectedAddress !== "" && slotDate !== "" && selectedSlot !== "") {
            try {
                this.setState({ showPageSpinner: true });
                this.props.userPlaceOrder(orderDetails)
                    .then(res => {

                        this.setState({ showPageSpinner: false });
                        const data = res.responseBody.responseData;
                        if (!payOnline) {
                            //alert ("order placed successfully");
                            StaticConstants.loadHomePage = true;
                            this.props.history.push('/order/' + data.id + '?status=codsuccess');
                            this.props.emptyHomeData()
                            this.props.emptyCategoryData()
                            //  this.props.emptyProductPage()
                        }
                        if (payOnline) {
                            var options = {
                                "key": rzp_key,
                                "amount": data.orderValue * 100,
                                "currency": "INR",
                                "name": "Heybandi",
                                "description": "Purchase",
                                "image": "https://images.heybandi.com/web_images/logo.png",
                                "order_id": data.razorpayInfo.razorId,
                                "prefill": {
                                    "name": this.props.profile.name,
                                    "email": this.props.profile.email,
                                    "contact": this.props.profile.mobileNumber
                                },
                                "notes": {
                                    "address": "HT Agri services, Manikonda, Hyderabad"
                                },
                                "theme": {
                                    "color": "#3399cc"
                                },
                                "handler": function (response) {
                                    _this.setState({ showPageSpinner: true });
                                    _this.props.afterPayment({ paymentId: response.razorpay_payment_id })
                                        .then(res => {
                                            _this.setState({ showPageSpinner: false });
                                            StaticConstants.loadHomePage = true
                                            _this.props.history.push('/order/' + data.id + '?status=paymentsuccess');
                                            _this.props.emptyHomeData();
                                            _this.props.emptyCategoryData();
                                            // _this.props.emptyProductPage()
                                        })
                                        .catch(function (error) {
                                            alert("Payment failed, Please try again.");
                                            _this.setState({ showPageSpinner: false });
                                        });
                                
                                }
                            };
                            var rzp = new Razorpay(options);
                            rzp.on('payment.failed', function (response) {
                                _this.setState({ showPageSpinner: false, orderFailedModal: true });
                                // _this.props.afterPayment({paymentId: response.error.metadata.payment_id})
                                //     .then(res => {
                                //          alert ("Payment Failed");
                                //     })
                                //     .catch(function (error) {
                                //         alert ("Payment failed, Please try again.");
                                //         _this.setState({showPageSpinner: false});
                                //     });
                            });
                            rzp.open();
                        }
                    }).catch(function (error) {
                        console.log('error 1', error);
                        alert("We are not able to place your order. Please contact Heybandi @ +91 91544 17418");
                        _this.setState({ showPageSpinner: false });
                    });
            } catch (e) {
                console.log('error 2', e);
                alert("We are not able to place your order. Please contact Heybandi @ +91 91544 17418");
                _this.setState({ showPageSpinner: false });
            }
        }

    }
    changeZone = (e) => {
        this.setState({changeZone : e})
    }
    render() {
        const { cartData } = this.props;
        const {
            cashOnDelivary,
            payOnline, userAddressModel,
            selectedAddress,
            inputEditData,
            slotDate,
            fulldate,
            selectedOption,
            selectedSlot,
            errorSelectedAddress,
            errorSlotDate,
            errorSelectedSlot,
        } = this.state;
        var errorState = false
        var addressExists = false;
        const { data } = this.props;
        const locationsData = data.data ? data.data : [];
        const filterSlots = locationsData.filter(item => item.id === selectedOption);
        const days = 6;
       
        const now = new Date();
        let loopDay = now;
        let myArr = [];
        var month1 = [];
        month1[0] = "01";
        month1[1] = "02";
        month1[2] = "03";
        month1[3] = "04";
        month1[4] = "05";
        month1[5] = "06";
        month1[6] = "07";
        month1[7] = "08";
        month1[8] = "09";
        month1[9] = "10";
        month1[10] = "11";
        month1[11] = "12";

        while(myArr.length < days) {
            loopDay.setDate(loopDay.getDate() + 1);
            let today = new Date(loopDay + 1);

            let days12 = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
            let dayName = days12[today.getDay()];
            let dd = today.getDate().toString().padStart(2, '0');
            let mm = today.toLocaleString('en-us', { month: 'short' });
            var monthNumber = month1[today.getMonth()];
            let dateResult = { "dateValue": dd, "monthValue": mm, "dayValue": dayName, fulldate: today };
            var cmp = ""+ today.getFullYear()+"-"+monthNumber+"-"+dd+"T00:00:00.000Z"
            var s = StaticConstants.nonServingDaysData
            var p = 0
            if (s!==null&&s.length>0){
                for (let i=0;i<s.length;i++){
                    if (cmp===s[i].notServingDate){
                        p=1;
                        break;
                    }
                }
            }
            if ( p===1 ){
                continue;
            }
            myArr.push(dateResult);

        }
        var toTop = (key, value) => (a, b) => (b[key] === value) - (a[key] === value);
        this.props.cartData.sort(toTop('availabilityCount', 0));

        return (
            <React.Fragment>
                <Helmet>
                    <title>User Checkout | HeyBandi</title>
                </Helmet>
                {this.state.showPageSpinner && <section id="accordionSection"><Spinner isFullPage={true} /></section>}
                {/* {this.state.showPageSpinner && <Spinner isFullPage={true} />} */}
                <section id="accordionSection" >
                    <div className="cart-container container" id="cart-prods">
                        <div className="cart mb-5 pointer cart-products">
                            <div className="accordion-cart" >
                                <div
                                    className="accordion-cart-button"
                                    data-target="#collapseExample1"
                                    aria-expanded="false"
                                    aria-controls="collapseExample1"
                                >
                                    <div className="cart-heading"   onClick={this.accordionCartShowHide}>
                                        <span  className="s-no">1</span>
                                        Cart ( {cartData ? cartData.length : "No"} Items )
                                    </div>
                                    <div className="delivery-instructions" onClick={() => this.openDeliveryInstructions()}>
                                        <span  className="plus-icon"> + </span>
                                        Add Delivery Instructions
                                    </div>
                                </div>

                                <Collapse in={!this.state.accordionCart}>
                                    <div >
                                        <div className="row">
                                        <div className="col-lg-10 col-9 products-heading">
                                                Products
                                            </div>
                                            <div className="col-lg-2 col-2 text-right">
                                                Subtotal
                                            </div>
                                            <div className="col-lg-10 col-9">
                                                <Modal show={this.state.isDeliveryInstructions} className="modal delivery-instructions-modal">
                                                    <div className="form-group">
                                                        <label>Add Instructions</label>
                                                        <span className="close"  onClick={() => this.setState({
                                                                isDeliveryInstructions: false,
                                                            })}> x </span>
                                                        <textarea
                                                            onChange={e => this.setDeliveryInstructions(e)}
                                                            type="text"
                                                            className="form-control"
                                                            value={this.state.deliveryInstructions ? this.state.deliveryInstructions : "" }
                                                         ></textarea>
                                                        {
                                                            this.state.showDelInstructionsError ? <label style={{color:'red'}}>Enter something</label> : null
                                                        }
                                                    </div>
                                                    <div className="form-group">
                                                        <button onClick={() => this.saveDeliveryInstructions()} type="button" className="addrs-save-btn">
                                                            Save
                                                        </button>
                                                        <button
                                                            className="addrs-cancel-btn"
                                                            onClick={() => this.setState({
                                                                deliveryInstructions: " "
                                                            })}
                                                            type="button">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </Modal>
                                            </div>
                                        </div>
                                        <hr />
                                        {this.props.cartData ?
                                            <>
                                                {this.props.cartData.map((item, index) => {
                                                    return <> 
                                                        <div className={item.quantity > item.availabilityCount ? "products-in-cart-info flex pb-3 row prod-out-of-stock" : "products-in-cart-info flex pb-3 row"}>
                                                            <div className="prod-name-cart col-lg-10 col-10">
                                                                <div className="img-n-title">
                                                                <img src={item.productMedia[0].prefix + item.productMedia[0].childern[0].url} className="prod-cart-img" />
                                                                <div className="prod-name-view">
                                                                    {item.productFullTitle}
                                                                </div>
                                                                </div>
                                                                <span className="prod-cat-row2 flex mt-2">
                                                                    <span className="prod-cart-rupee">Rs.
                                                                        {parseFloat(item.maxPrice).toFixed(2)}
                                                                    </span>
                                                                    <OperationsBlock
                                                                        {...this.props}
                                                                        source='CART'
                                                                        selectedVariant={item}
                                                                        updateQuantity={this.updateQuantity}
                                                                        onVariantSelection={this.onVariantSelection}
                                                                    />
                                                                </span>
                                                                {/* {item.quantity === item.availabilityCount ?
											                            <>
											                                <div className="stock-err-msg">Max qty Added</div>
											                            </>
											                            : */}
											                            {item.quantity > item.availabilityCount ?
											                                <>
											                                    {errorState = true}
											                                    <div className="stock-err-msg">Available Only {item.availabilityCount} </div>
											                                </>
											                            : 
											                            ""
										                        }
                                                            </div>
                                                            
                                                            <div className="col-lg-2 col-1 prod-price align-items-end justify-content-end flex">
                                                                <span className="prod-qty-min-price">
                                                                    Rs. {parseFloat(item.quantity * item.maxPrice).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </>
                                                })}
                                            </>
                                            : ""
                                        }
                                        {this.props.cartData && this.props.cartData.length > 0 ?
                                            <div className="proceed-next flex justify-content-between">
                                                {errorState ?
                                                    <button className="address-btn address-btn-error" onClick={this.openAddressHandler} >
                                                        Address &amp; Schedule
                                                        <span>
                                                            <img src="/public/images/next.svg" />
                                                        </span>
                                                    </button>
                                                    :
                                                    <button className="address-btn" onClick={this.openAddressHandler} >
                                                    Address &amp; Schedule
                                                    <span>
                                                        <img src="/public/images/next.svg" />
                                                    </span>
                                                    </button> 
                                                }
                                                <div className="price">Total Payable Amount <span>Rs.
                                                    <b>
                                                        {parseFloat(this.totalCartValue()).toFixed(2)}
                                                    </b>
                                                </span>
                                                </div>
                                            </div>
                                            :
                                            <>
                                            {this.state.isCartLoading ?
                                            <span className="qty-indicator-spnr-p">
                                                <Spinner isPageLoad={true} />
                                            </span>
                                        :<div className="error-address center">No Products added to cart </div>
                                         }
                                        </>
                                            }
                                       
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                    <div className="cart-container container" id="usr-adres">
                        <div className="cart mb-5 pointer cart-products">
                            <div className="accordion-cart" >
                                <button
                                    className="accordion-cart-button"
                                    onClick={this.accordionAddressShowHide}
                                    data-target="#collapseExample2"
                                    aria-expanded="false"
                                    aria-controls="collapseExample2"
                                    disabled={this.state.addressOpen}
                                >
                                    <div className="cart-heading" >
                                        <span className="s-no">2</span>
                                        Address &amp; Schedule Order
                                    </div>
                                </button>
                                <Collapse in={!this.state.accordionAdress}>
                                    <div>
                                        <hr />
                                        <div className="accordion-body">
                                            {this.props.addressData.data !== undefined ?
                                                <>
                                                    {this.state.errorSelectedAddress ? <div className="error-address center">Add delivery address to place order *</div> : ""}
                                                    {this.props.addressData.data.map((address, index) => {
                                                        return <>
                                                            {service.getCookieData('zone') === address.localArea ?
                                                                <>
                                                                {addressExists=true}
                                                                <div onClick={(e) => this.handleSelected(e, address.id)} className={"address-type full-border position-relative flex px-3 pt-4 pb-2 mb-3 " +
                                                                    (!errorSelectedAddress ? (selectedAddress === address.id ? " selected" : "") : "errors-checkout")}>
                                                                    <span className="adrs-type">
                                                                        {/* <img src="/public/images/home.svg" className="address-type-icon" /> */}
                                                                        <img src={address.friendlyName === "Work" ? "/public/images/briefcase.svg" :
                                                                                address.friendlyName === "Home" ? "/public/images/home.svg" :
                                                                                "/public/images/other-address.svg" 
                                                                                } className="address-type-icon" alt = "AddressType" />
                                                                    </span>
                                                                    <span className="adrs-dtls">
                                                                        <span className="line-1">
                                                                            {address.friendlyName}
                                                                        </span>
                                                                        <br />
                                                                        <span className="line-2">
                                                                            {address.addressLine1}, {address.addressLine2}, {address.addressLine3}, {address.localArea}
                                                                        </span>
                                                                    </span>
                                                                    <span className="text-right del-options">
                                                                        {/* <img src="/public/images/edit.svg" className="edit-icon" onClick={() => this.editAddressHandler(address)} /> */}
                                                                        <br />
                                                                        <label htmlFor="homeDel">
                                                                            <span>
                                                                                <input
                                                                                    name="delivary"
                                                                                    type="radio"
                                                                                    id="homeDel"
                                                                                    value={address.id}
                                                                                    checked={selectedAddress === address.id}

                                                                                />
                                                                            </span>
                                                                            {/* <input type="radio" id="homeDel" name="delivery" /> */}
                                                                            <div className="circle" />
                                                                            <span className="delivery-here">Delivery Here</span>
                                                                        </label>
                                                                    </span>
                                                                </div>
                                                             </>   
                                                            :
                                                            ""
                                                            }
                                                        </>
                                                       
                                                    })}
                                                </>
                                                : ""}
                                            {addressExists ? <>
                                                <div className="add-address text-right" onClick={this.showAddressModel} >
                                                    <span>
                                                        <img src="/public/images/add.svg" />
                                                    </span>
                                                    Add New Delivery Address
                                                </div>
                                            </>
                                             :
                                             <>
                                              <button className="add-new-adrs-btn" onClick={this.showAddressModel}>
                                                       Add a Delivery Address
                                              </button>
                                            {/* {this.state.noNewAddress ? <div className="error-address center">Add delivery address to place order *</div> : ""} */}
                                             </>   
                                               
                                            }
                                            <hr />
                                            <span className="flex del-type">
                                                {/* <div
                                                    className={"groceries-del flex full-border  " + (deliveryType === "groceries" ? "selected" : "")}
                                                    onClick={(e) => this.handleDeliveryType(e, "groceries")}
                                                >
                                                    <span className="calender-icon">
                                                        <img src="/public/images/calender.svg" />
                                                    </span>
                                                    <span className="del-selection flex">
                                                        Groceries
                                                        <br />
                                                        <small>Delivery Date and Time</small>
                                                    </span>
                                                </div> */}
                                                {/* <div className="groceries-del">
                                                    <div
                                                        onClick={(e) => this.handleDeliveryType(e, "veggies")}
                                                        className={"flex full-border " + (deliveryType === "veggies" ? "selected" : "")}
                                                    >
                                                        <span className="calender-icon">
                                                            <img src="/public/images/calender.svg" />
                                                        </span>
                                                        <span className="del-selection flex">
                                                            Veggies
                                                            <br />
                                                            <small>Delivery Date and Time</small>
                                                        </span>
                                                    </div>
                                                    <div className="del-days-info">
                                                        We are delivering Fresh Vegetables &amp; Fruits On every Wednesday and Saturday.
                                                    </div>
                                                </div> */}
                                            </span>
                                            <br />
                                            <div className="slot-selection">
                                                <h4>Select Your Delivery Slot</h4>
                                                <p className={!errorSlotDate ? "error-del-slot" : "error-address"}>Select Your Delivery Slot Date*</p>
                                                <div className="weeks flex mt-4">
                                                    {myArr.map((date, index) => {
                                                        return <>
                                                            {/* {(deliveryType === "veggies") ?
                                                                ((date.dayValue === "WED" || date.dayValue === "SAT") ?
                                                                    <span
                                                                        key={index}
                                                                        className={slotVegDate === date.dateValue + " " + date.monthValue ? "selected-bottom-border" : ""}
                                                                        onClick={(e) => this.handleDeliveryVegSlot(e, date.dateValue + " " + date.monthValue)}
                                                                    >
                                                                        {date.dayValue}<br />
                                                                        <span className="del-date">
                                                                            {date.monthValue} {date.dateValue}
                                                                        </span>
                                                                    </span>
                                                                    : "") : */}
                                                            <span
                                                                key={index}
                                                                className={slotDate === date.dateValue + " " + date.monthValue ? "selected-bottom-border" : ""}
                                                                onClick={(e) => this.handleDeliverySlot(e, date.dateValue + " " + date.monthValue, date.fulldate)}
                                                            >
                                                                {date.dayValue}<br />
                                                                <span className="del-date">
                                                                    {date.monthValue} {date.dateValue}
                                                                </span>
                                                            </span>
                                                            {/* } */}
                                                        </>
                                                    })}
                                                </div>
                                               
                                                { filterSlots[0] !== undefined && filterSlots[0].store.slots !== undefined && slotDate!=='' ?
                                                    <>
                                                        {this.getSortedSlots(filterSlots[0].store.slots, fulldate).length > 0 ? this.getSortedSlots(filterSlots[0].store.slots, fulldate).map((slot, index) => {
                                                            return <div className="slot-time" key={index}
                                                                onClick={(e) => this.handleSelectedSlot(e, slot, filterSlots[0].store.slots)}>
                                                                <span><img src="/public/images/clock.svg" /></span>
                                                                <span className={!errorSelectedSlot ? "" : "error-address"}>{slot.startTime} - {slot.endTime}</span>
                                                                <span className="slot-check">
                                                                    <input
                                                                        type="radio"
                                                                        id="slot1"
                                                                        name="deliverySlot"
                                                                        value={slot.id}
                                                                        checked={selectedSlot === slot.id}
                                                                    />
                                                                </span>
                                                            </div>
                                                        })
                                                        : <div className="no-slots">No Slots available for Selected Date</div>
                                                        }
                                                            
                                                            
                                                            <p className={!errorSelectedSlot ? "error-del-slot" : "error-address"}>Select your delivery slot time *</p>
                                                        </>
                                                        : ""
                                                }
                                                <button className="address-btn" onClick={this.openPaymentHandler}>
                                                    Payment
                                                    <span>
                                                        <img src="/public/images/next.svg" />
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                    <div className="cart-container container" id="payment-opts">
                        <div className="cart mb-5 pointer cart-products">
                            <div className="accordion-cart" >
                                <button
                                    className="accordion-cart-button"
                                    onClick={this.accordionPaymentShowHide}
                                    data-target="#collapseExample3"
                                    aria-expanded="false"
                                    aria-controls="collapseExample3"
                                    disabled={this.state.paymentOpen}
                                >
                                    <div className="cart-heading" >
                                        <span className="s-no">3</span>
                                        Payment
                                    </div>
                                </button>
                                <Collapse in={!this.state.accordionPayment}>
                                    <div>
                                        <hr />
                                        <div className="accordion-body payment-body">
                                            <div className="flex mb-4">
                                                <span onClick={this.payOnline} className={"payment-type full-border flex f-ac " + (payOnline ? "selected" : "")} >
                                                    <img src="/public/images/credit-card (1).svg" />
                                                    Pay Online
                                                </span>
                                                <span onClick={this.cashOnDelivary} className={"payment-type full-border flex f-ac " + (cashOnDelivary ? "selected" : "")} >
                                                    <img src="/public/images/cash-on-delivery.svg" />
                                                    Cash On Delivery
                                                </span>
                                            </div>
                                            <hr />
                                            <div className="price">Total Payable Amount <span>Rs. <b> {parseFloat(this.totalCartValue()).toFixed(2)}</b></span></div>
                                            <br />
                                            <p>
                                                Your personal data will be used to process your order,
                                                support your experience throughout this website,
                                                and for other purposes described in our <span><Link to='/privacy'>Privacy Policy.</Link></span>
                                            </p>
                                            <button
                                                className="address-btn"
                                                onClick={this.placeOrderHandler}
                                            >
                                                {this.state.payOnline ? "Proceed to Pay" :
                                                    "Place Order"}
                                            </button>
                                        </div>
                                    </div>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                </section>
                {/* address model */}
                
                <Modal show={this.state.orderFailedModal} className="modal order-failed-modal">
                    <div className="order-failed">
                        <div className="order-failed-text">Payment Failed. Order is not Placed. Please try again</div>
                        <div className="order-failed-btns">
                            <button  onClick={() => this.setState({
                                orderFailedModal : false,
                                })}
                                type="button" className="retry-payment-btn">
                                Retry
                            </button>
                            <button
                                className="retry-payment-cancel"
                                onClick={() => this.setState({
                                orderFailedModal : false,
                                })} type="button">
                                Cancel
                            </button>
                        </div>
                    </div>                               
                                                
                </Modal>
                
                {userAddressModel ?
                    <UserAddress
                        inputEditData={inputEditData}
                        closeAddressModel={this.closeAddressModel}
                        userAddressModel={userAddressModel}
                        checkoutAddress={this.state.checkoutAddress}
                        changeZone = {this.changeZone}
                    />
                    : ""
                }
                {this.state.changeZone ? <Locations state={this.state} changeZone={this.changeZone} /> : ""}
                {this.state.minOrderpopUp ? <PopUp popUpState={this.popUpState} minOrderpopUp={this.state.minOrderpopUp} /> : ""}
            </React.Fragment>
        );
    }


    static s = 0

    getSortedSlots = (slots, fulldate ) => {
        if (Checkout.s===0){
            Checkout.s =1
            slots.sort((a, b) => ((Math.floor(a.startHour)) > (Math.floor(b.startHour))) ? 1 : -1)
        }
        const today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        const currentTime = today.getHours();       
        const date2 = new Date(fulldate);
        const date1 = new Date(mm + '/' + dd + '/' + yyyy);
        const diffTime = Math.abs(date2 - date1);
        const diffDays = diffTime / (1000 * 60 * 60 * 24); 
        if (diffDays < 1) {
            const data = slots.filter( slot => {
                return  slot.startHour > currentTime;
            });
            return data;
        }
        if (diffDays == 1) {
            const data = slots.filter( slot => {
                let startHour = slot.startHour;
                if (startHour <= 0 ) {
                    startHour = 24 + startHour;
                    return startHour > currentTime;
                }
                return startHour;                
            });
            return data;
        } 
        return slots;
    }

    setDeliveryInstructions = (e) =>{
        this.setState({
            deliveryInstructions : e.target.value
        });
    }


    saveDeliveryInstructions = () => {
        if (this.state.deliveryInstructions.length===0){
            this.setState({
                showDelInstructionsError: true,
                isDeliveryInstructions : true
            })
            return
        }
        this.setState({
            showDelInstructionsError : false,
            isDeliveryInstructions : false
        })
    }
}

Checkout.propTypes = {
    data: PropTypes.shape({
        text: PropTypes.string
    }),
    getData: PropTypes.func.isRequired
};

Checkout.defaultProps = {
    data: null
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateCart: service.updateCart,
        getAddressData: service.getAddressData,
        getProfileData: service.getProfileData,
        getNonServingDays: service.getNonServingDays,
        emptyCategoryData: service.emptyCategoryData,
        emptyHomeData: service.emptyHomeData,
        emptyProductPage: service.emptyProductPage
    }, dispatch);
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartData: state.cart.cartData,
        cartCount: state.cart.count,
        selectedZone: state.util.selectedZone,
        location: state.util.location,
        addressData: state.userLogin.addressData,
        data: state.util.zones,
        profile: state.userLogin.profileData,
        nonServingDays: state.util.nonServingDays,
        zones: state.util.zones
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);
