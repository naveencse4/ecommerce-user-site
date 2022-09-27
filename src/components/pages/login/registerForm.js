import React, { Component } from 'react';
import './SignIn.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import service from '../../../redux/actions/index';
import Spinner from '../../common/Spinner';

class RegisterForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: {},
            errors: {},
            otpField: false,
            validOtp: false,
            mblNo: "",
            otpVal: "",
            createSpinner: false,
            verifyMblSpinner:false,
            isUserRegistered: false,
            registrationForm: false,
            token: "",
            RegisterFirstStep: true
        };
        this.recaptchaWrapperRef = React.createRef();
    }
    
    mblNoChange = (e) => {
        this.setState({mblNo : e.target.value})
    }
    handleChange = (event) => {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleBlurEmail = () => {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (typeof input["email"] !== "undefined") {

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(input["email"])) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleBlurFullName =() =>{
        let errors = {};
        let isValid = true;

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleBlurPassword =() =>{
        let errors = {};
        let isValid = true;

        this.setState({
            errors: errors
        });

        return isValid;
    }
    handleOtpBlur = () => {
        let errors = {};
        let isValid = true;
        if (this.state.otpVal.length != 6) {
            isValid = false;
            errors["otp_field"] = "Enter Valid OTP";
            this.setState({ verifyMblSpinner: false})
        }
        this.setState({
            errors: errors
        });

        return isValid;

    }
    handleBlurconfirmPassword =  () => {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (typeof input["password"] !== "undefined" && typeof input["confirmPassword"] !== "undefined") {

            if (input["password"] != input["confirmPassword"]) {
                isValid = false;
                errors["password"] = "Passwords don't match.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleBlurPhone = () => {
        let input = this.state.input;
        let mobileNo = this.state.mblNo;
        let errors = {};
        let isValid = true;

        if (typeof mobileNo !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(mobileNo)) {
              //  this.props.isUserExist(true);
                isValid = false;
                errors["validate_phone"] = "Please enter only number.";
            } else if (mobileNo.length != 10) {
               // this.props.isUserExist(true);
                isValid = false;
                errors["validate_phone"] = "Please enter valid phone number.";
            }
        }
       
        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        if (this.validate()) {
            let input = {};
            input["fullName"] = "";
            input["email"] = "";
            input["phoneNumber"] = "";
            input["password"] = "";
            input["confirmPassword"] = "";
            this.setState({ input: input });
            if (this.state.input) {
                const userData = {
                    "name": this.state.input.fullName,
                    "mobileNumber": this.state.mblNo,
                    "email": this.state.input.email,
                    "password": this.state.input.password,
                    "platform" : "web",
                    "regSource":"WEB"
                }
                this.props.postRegistrationData(userData)
                .then(response => {
                    const token = response.responseBody.responseData.token;
                    service.setCookieData('token', token);
                    this.props.toggleLoginPopup(false);
                }).then(res => {
                    window.location.reload()
                });
            }
        }
    }

    otpVal = (e) => {
        this.setState({ otpVal: e.target.value })
    }

    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["fullName"]) {
            isValid = false;
            errors["fullName"] = "Please enter your full name.";
        }

        // if (!input["phoneNumber"]) {
        //     isValid = false;
        //     errors["phoneNumber"] = "Please enter your phone number.";
        // }

        if (!input["password"]) {
            isValid = false;
            errors["password"] = "Please enter your password.";
        }


        if (!input["confirmPassword"]) {
            isValid = false;
            errors["confirmPassword"] = "Please enter your confirm password.";
        }

        if (!input["email"]) {
            isValid = false;
            errors["email"] = "Please enter your email.";
        }
        
        if (typeof input["email"] !== "undefined") {

            var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
            if (!pattern.test(input["email"])) {
                isValid = false;
                errors["email"] = "Please enter valid email address.";
            }
        }

        if (typeof input["password"] !== "undefined" && typeof input["confirmPassword"] !== "undefined") {

            if (input["password"] != input["confirmPassword"]) {
                isValid = false;
                errors["password"] = "Passwords don't match.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    validateMblNo() {
        let mobileNo = this.state.mblNo;
        let errors = {};
        let isValid = true;
        if (!mobileNo) {
            isValid = false;
            errors["validate_phone"] = "Please enter your phone number.";
            this.setState({ showSpinner: false })
        }

        if (typeof mobileNo !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
           
            if (!pattern.test(mobileNo)) {
                isValid = false;
                errors["validate_phone"] = "Please enter only number.";
                this.setState({ showSpinner: false})
            } else if (mobileNo.length != 10) {
                isValid = false;
                errors["validate_phone"] = "Please enter valid phone number.";
                this.setState({ verifyMblSpinner: false})
            }
            // if(mobileNo.length === 10) {
            //     const userData = {
            //         "mobileNumber": mobileNo
            //     }
            //     this.props.isUserExist(userData)
            //         .then(() => {
            //             this.setState({ isUserRegistered: this.props.userExist}, () => {
            //                 if (this.state.isUserRegistered === false) {
            //                     isValid = false;
            //                     errors["validate_phone"] = "User Already Exists";
            //                     this.setState({verifyMblSpinner: false, otpField:false})
            //                 } else {
            //                     isValid = true
            //                     this.setState({ otpField: true })
            //                 }
            //             })
            //     })
            // }
    
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    registerationOtp = () => {
        let mobileNo = this.state.mblNo;
        let errors = {};
        let isValid = true;
        if (this.validateMblNo()) {
            let _this = this
            let phoneNumber = "+91" + this.state.mblNo;
             if(mobileNo.length === 10) {
                const userData = {
                    "mobileNumber": mobileNo
                }
                this.props.isUserExist(userData)
                    .then(() => {
                        this.setState({ isUserRegistered: this.props.userExist}, () => {
                            if (this.state.isUserRegistered === false) {
                                isValid = false;
                                errors["validate_phone"] = "User Already Exists";
                                this.setState({verifyMblSpinner: false, otpField:false})
                            } else {
                                isValid = true
                                this.setState({ otpField: true })
                                try {
                                    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                                        'size': 'invisible',
                                        'callback': function (response) {
                                            // _this.onSignInSubmit();
                                        },
                                        'defaultCountry': "IN",
                                    });
                                    if (this.applicationVerifier && this.recaptchaWrapperRef) {
                                        this.applicationVerifier.clear()
                                        this.recaptchaWrapperRef.innerHTML = `<div id="recaptcha-container"></div>`
                                    }
                                    this.applicationVerifier = new firebase.auth.RecaptchaVerifier(
                                        'recaptcha-container',
                                        { size: 'invisible' }
                                    );
                                    firebase.auth().signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier).then(function (confirmationResult) {
                                        window.confirmationResult = confirmationResult;
                                        _this.setState({ verifyMblSpinner: false });
                                    })
                                        .catch(function (error) {
                                            console.log(error);
                                        });
                                    window.recaptchaVerifier.reset();
                                } catch (error) {
                                    console.log(error)
                                }
                            }
                            this.setState({
                                errors: errors
                            });
                        })
                })
            }
           
        }
    }

    handleVerifyNumber = (event) => {
        
        event.preventDefault();
        this.setState({verifyMblSpinner : true})
        let errors = {};
        let isValid = true;
        if (this.state.otpVal.length === 0) {
            isValid = false;
            errors["otp_field"] = "Enter OTP";
            this.setState ({verifyMblSpinner : false})
        }
        if (!!this.state.otpVal) {
            var code = this.state.otpVal;
            let _this = this
            confirmationResult.confirm(code).then(function (result) {
                _this.setState({verifyMblSpinner: false, RegisterFirstStep: false, registrationForm : true, token: result.user.Aa})
                window.confirmationResult = null;

            }).catch(function (error) {
                isValid = false;
                errors["otp_field"] = "Enter Valid OTP";
                _this.setState({verifyMblSpinner : false})
            }).then(() => {
                this.setState({
                    errors: errors
                });
             })

        }

        return isValid;
    }


    render() {
        const { userExist } = this.props;
        const { isUserRegistered, validate_phone} = this.state
        return (
            <React.Fragment>
                {/* Sign in model */}
            
                            {this.state.RegisterFirstStep ?
                             <form name="form" onSubmit={this.handleVerifyNumber}>
                                        <div ref={ref => this.recaptchaWrapperRef = ref}>
                                            <div id="recaptcha-container"></div>
                                        </div>
                                        <div className="form-group">
                                            <span className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className={"form-control " + "form-input-class"}
                                                    name="validate_phone"
                                                    defaultValue={validate_phone}
                                                    onChange={this.mblNoChange}
                                                    placeholder="Phone Number"
                                                    onBlur={this.handleBlurPhone}
                                                    autoComplete='off'
                                                />
                                                <img src="/public/images/iphone.svg" />
                                            </span>
                                            <div className="send-code" onClick={this.registerationOtp}>Send Code</div>
                                            <div className="help-block">
                                                {this.state.errors.validate_phone}
                                            </div>
                                            {this.state.otpField ?
                                                <>
                                                 <div className="form-group">
                                                    <span className="otp-enter">
                                                        <input 
                                                        type="text" 
                                                        autoComplete='off'
                                                        name="otp_field" 
                                                        placeholder="Enter OTP" 
                                                        className = "password-otp-field"
                                                       // className={"form-control " + "form-input-class"}
                                                        onBlur={this.handleOtpBlur}
                                                        onChange={(e) => this.otpVal(e)} />
                                                        <span><img src="/public/images/OTP.svg" /> </span>
                                                    </span>
                                                    </div>
                                                    <div className="help-block">{this.state.errors.otp_field }</div>
                                                     <div>
                                            {this.state.verifyMblSpinner ?
                                                <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Verify Mobile Number</button></span>
                                                :
                                                <button type="submit">Verify Mobile Number</button>
                                            }
                                        </div>
                                                </> : ""}
                                        {/* <div className="help-block">{this.state.errors.otp_field }</div> */}
                                        </div>
                                        {/* <div>
                                            {this.state.verifyMblSpinner ?
                                                <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Verify Mobile Number</button></span>
                                                :
                                                <button type="submit">Verify Mobile Number</button>
                                            }
                                        </div> */}
                            </form>
                             : ""
                            }
                            { this.state.registrationForm ? <>
                                <form name="form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <span className="input-with-icon">
                                        <input
                                            type="text"
                                            className={"form-control " + (this.state.errors.fullName ? "input-error-border" : "form-input-login")}
                                            placeholder="Full Name"
                                            name="fullName"
                                            value={this.state.fullName}
                                            onChange={this.handleChange}
                                            onBlur={this.handleBlurFullName}
                                            autoComplete='off'
                                        />
                                        <img src="/public/images/user.svg" />
                                    </span>
                                    <div className="help-block">{this.state.errors.fullName}</div>
                                </div>
                                <div className="form-group">
                                    <span className="input-with-icon">
                                        <input
                                            type="text"
                                            className={"form-control " + (this.state.errors.email ? "input-error-border" : "form-input-login")}
                                            name="email"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                            onBlur={this.handleBlurEmail}
                                            placeholder="Email"
                                            autoComplete='off'
                                        />
                                        <img src="/public/images/email.svg" />
                                    </span>
                                    <div className="help-block">{this.state.errors.email}</div>
                                </div>
                                <div className="form-group">
                                    <span className="input-with-icon">
                                        <input
                                            type="password"
                                            className={"form-control " + (this.state.errors.password ? "input-error-border" : "form-input-login")}
                                            name="password"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            placeholder="Your Password"
                                            onBlur={this.handleBlurPassword}
                                        />
                                        <img src="/public/images/Lock-icon.png" />
                                    </span>
                                    <div className="help-block">{this.state.errors.password}</div>
                                </div>
                                <div className="form-group">
                                    <span className="input-with-icon">
                                        <input
                                            type="password"
                                            className={"form-control " + (this.state.errors.confirmPassword ? "input-error-border" : "form-input-login")}
                                            name="confirmPassword"
                                            value={this.state.confirmPassword}
                                            onChange={this.handleChange}
                                            placeholder="Confirm Password"
                                            onBlur={this.handleBlurconfirmPassword}
                                        />
                                        <img src="/public/images/Lock-icon.png" />
                                    </span>
                                    <div className="help-block">{this.state.errors.confirmPassword}</div>
                                </div>
                                <button type="submit">Create</button>
                                </form>
                                </>
                            :
                            ""
                        }
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userExist : state.userLogin.userResponse,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        postRegistrationData: service.postRegistrationData,
        toggleLoginPopup: service.toggleLoginPopup,
        isUserExist: service.isUserExist,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);
