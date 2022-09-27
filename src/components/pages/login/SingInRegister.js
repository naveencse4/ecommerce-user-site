import React, { Component } from 'react';
import LoginForm from './loginForm';
import RegisterForm from "./registerForm";
import './SignIn.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import service from '../../../redux/actions/index';
import firebase from 'firebase';
import Firebase, { FirebaseContext } from "../../common/Firebase/index";
import 'firebase/auth';
import {Link} from "react-router-dom";
import Spinner from '../../common/Spinner';

class SingInRegister extends Component {
    render() {
        return (
            <FirebaseContext.Provider value={new Firebase()}>
                <SingInRegisterOne {...this.props} />
            </FirebaseContext.Provider>
        )
    }
}
class SingInRegisterOne extends React.Component {
    render() {
        return (
            <FirebaseContext.Consumer>
                {firebase => {
                    return <React.Fragment >
                        <SingInRegisterTwo firebase={firebase} {...this.props} />
                    </React.Fragment>
                }
                }
            </FirebaseContext.Consumer>
        )
    }
}
class SingInRegisterTwo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signupContent: true,
            signInWithOtp: false,
            signInWithPassword: true,
            input: {},
            loginInput: {},
            errors: {},
            time: {},
            seconds: 60,
            resendBtn: false,
            otpVal: "",
            otpFrom: false,
            enterOtp: false,
            mobileNo: "",
            editNumber: false,
            isUserRegistered: false,
            showSpinner: false,
            OtpVerifySpinner: false,
            signInSpinner: false,
            verifyMblSpinner: false,
            updatePasswordSpinner: false,
            isForgetPassword: false,
            passwordOtp: false,
            updatePassword: false,
            updatePasswordMbl: "",
            token: "",
            passwordUpdated: false,
            userPassword: "",
        };
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
        this.recaptchaWrapperRef = React.createRef();
    }

    handleChange = (event) => {
        let loginInput = this.state.loginInput;
        loginInput[event.target.name] = event.target.value;

        this.setState({
            loginInput
        });
    }
    handlePasswordChange = (e) => {
        this.setState({ userPassword: e.target.value })
    }
    mobileNumberChange = (e) => {
        this.setState({mobileNo : e.target.value})
    }
    updatePasswordMblChange = (e) => {
        this.setState({updatePasswordMbl : e.target.value})
    }
    signInOtp = (e, boolVal) => {
        console.log(this.state)
        this.setState({
            otpFrom: boolVal,
        });
    }


    handleBlurPhone = () => {
        let loginInput = this.state.loginInput;
        let mobileNo = this.state.mobileNo
        let errors = {};
        let isValid = true;
        
        if (typeof mobileNo !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(mobileNo)) {
                isValid = false;
                errors["user_phone"] = "Please enter only number.";
                this.setState({ showSpinner: false });
            } else if (mobileNo.length != 10) {
                isValid = false;
                errors["user_phone"] = "Please enter valid phone number.";
                this.setState({ showSpinner: false });
            }
        }
        if(mobileNo.length === 10) {
            const userData = {
                "mobileNumber": mobileNo
            }
            this.props.isUserExist(userData)
                .then(() => {
                    this.setState({ isUserRegistered: this.props.userExist}, () => {
                        this.setState({ showSpinner: false })
                    })
            })
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    handleBlurPassword = () => {
        let loginInput = this.state.loginInput;
        let errors = {};
        let isValid = true;
        
        if (typeof loginInput !== "undefined") {
            if (loginInput.length === 0) {
                isValid = false;
                errors["user_phone"] = "Please enter password";
            }
        }
    
        this.setState({
            errors: errors
        });

        return isValid;
    }

    setUpRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
            "recaptcha-container",
            {
                size: "invisible",
                callback: function (response) {
                    this.onSignInSubmit();
                },
                defaultCountry: "IN",
            }
        );
    };

    getOtp = () => {
            this.setState({ enterOtp: true });
            let _this = this
            if(this.state.mobileNo.length === 10) {
                const userData = {
                    "mobileNumber": this.state.mobileNo
                }
                this.props.isUserExist(userData)
                    .then(() => {
                        this.setState({ isUserRegistered: this.props.userExist}, () => {
                            this.setState({ showSpinner: false })
                            this.state.isUserRegistered ? this.setState({ signInWithPassword: true, signInWithOtp: false }) :
                            this.setState({ signInWithPassword:false, signInWithOtp : true });
                        })
                    })
                    //  this.setState({ signInWithPassword:false, signInWithOtp : true });
            }
            let phoneNumber = "+91" + this.state.mobileNo;
            try {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible',
                    'callback': function (response) {
                        _this.onSignInSubmit();
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
                    !_this.state.isUserRegistered ? _this.signInWithOtp(true) : _this.signInWithOtp(false);
                    _this.setState({ showSpinner: false });
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                window.recaptchaVerifier.reset();
            } catch (error) {
                console.log(error)
            }
    }

    handleLoginOtp = (event) => {
        event.preventDefault();
        console.log(this.state.isUserRegistered, this.props.isUserExist(this.state.mobileNo))
        if (this.validateLoginFrom()) {
            this.setState({ seconds: 60, resendBtn : false })
            this.startTimer()
            this.setState({ showSpinner: true });
            if(this.state.mobileNo.length === 10) {
                const userData = {
                    "mobileNumber": this.state.mobileNo
                }
                this.props.isUserExist(userData)
                    .then(() => {
                        this.setState({ isUserRegistered: this.props.userExist }, () => {
                            !this.state.isUserRegistered ? this.getOtp() : ""
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
        if (this.state.otpVal === "") {
            isValid = false;
            errors["otp_field"] = "Enter OTP";
            this.setState({verifyMblSpinner : false, errors: errors})
        }
        if (!!this.state.otpVal) {
            var code = this.state.otpVal;
            let _this = this
            confirmationResult.confirm(code).then(function (result) {
                _this.setState({isForgetPassword: false, updatePassword : true, token: result.user.Aa,verifyMblSpinner:false})
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

    handleLoginSumbit = (event) => {
        event.preventDefault();
        this.setState({signInSpinner : true})
        if (this.validateLoginFrom()) {
            let loginInput = {};
            loginInput["user_phone"] = "";
            loginInput["user_password"] = "";

            this.setState({ loginInput: loginInput });

            if (this.state.loginInput) {
                const userData = {
                    "mobileNumber": this.state.mobileNo,
                    // "password": this.state.loginInput.user_password
                    "password": this.state.userPassword
                }
                console.log(userData)
                if(this.state.mobileNo.length === 10) {
                    const mblNo = {
                        "mobileNumber": this.state.mobileNo
                    }
                    this.props.isUserExist(mblNo)
                        .then(() => {
                            this.setState({ isUserRegistered: this.props.userExist}, () => {
                                this.setState({ signInSpinner: false, OtpVerifySpinner :false })
                            })
                    })
                }

                this.props.postUserLogin(userData)
                    .then(res => {
                        service.setCookieData('token', res.token);
                        this.props.toggleLoginPopup(false);
                    }).then(res => {
                        window.location.reload();
                        this.setState({signInSpinner: false})
                        // this.loginError();
                    });
            }
        }
    }

    validateMblNo() {
        let mobileNo = this.state.updatePasswordMbl;
        let errors = {};
        let isValid = true;
        if (!mobileNo) {
            isValid = false;
            errors["validate_phone"] = "Please enter your phone number.";
            this.setState({ showSpinner: false, signInSpinner: false, verifyMblSpinner: false })
        }

        if (typeof mobileNo !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(mobileNo)) {
                isValid = false;
                errors["validate_phone"] = "Please enter only number.";
                this.setState({ showSpinner: false, signInSpinner : false, verifyMblSpinner: false })
            } else if (mobileNo.length != 10) {
                isValid = false;
                errors["validate_phone"] = "Please enter valid phone number.";
                this.setState({ showSpinner: false, signInSpinner: false, verifyMblSpinner: false })
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    loginError = () => {
        if (this.props.loginError) {
            window.location.reload()
        }
    }

    validateLoginFrom() {
        let mobileNo = this.state.mobileNo;
        let loginInput = this.state.loginInput
        let errors = {};
        let isValid = true;
        if (!mobileNo) {
            isValid = false;
            errors["user_phone"] = "Please enter your phone number.";
            this.setState({ showSpinner: false, signInSpinner: false })
        }

        if (typeof mobileNo !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(mobileNo)) {
                isValid = false;
                errors["user_phone"] = "Please enter only number.";
                this.setState({ showSpinner: false, signInSpinner : false })
            } else if (mobileNo.length != 10) {
                isValid = false;
                errors["user_phone"] = "Please enter valid phone number.";
                this.setState({ showSpinner: false, signInSpinner: false })
            }
        }

        if (this.state.otpFrom) {
            // if (!loginInput["user_password"]) {
            //     isValid = false;
            //     errors["user_password"] = "Please enter your password.";
            //     this.setState({signInSpinner : false})
            // }
            if (!this.state.userPassword) {
                isValid = false;
                errors["user_password"] = "Please enter your password.";
                this.setState({signInSpinner : false})
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    secondsToTime(secs) {
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
            "h": hours,
            "m": minutes,
            "s": seconds
        };
        return obj;
    }

    startTimer() {
        if (this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000);
        }
    }

    countDown() {
        // Remove one second, set state so a re-render happens.
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds,
        });

        // Check if we're at zero.
        if (seconds == 0) {
            // clearInterval(this.timer);
            this.setState({ resendBtn: true });
        }
    }

    createAccount = () => {
        this.setState({ signupContent: false, signInWithOtp: false });
    }

    accountSignIn = () => {
        this.setState({ signupContent: true });
    }

    signInWithOtp = (val) => {
        this.setState({ signInWithOtp: val });
    }

    resendOtp = () => {
        this.setState({ resendBtn: false, seconds: 60 , time: 0 })
        this.startTimer()
        this.setState({ });
        this.getOtp()
    }

    otpVal = (e) => {
        this.setState({ otpVal: e.target.value })
    }

    verifyOtp = (e) => {
        e.preventDefault();
        this.setState({OtpVerifySpinner : true})
        let errors = {};
        let isValid = true;
        if (this.state.otpVal === "") {
            isValid = false;
            errors["otp_field"] = "Enter OTP";
            this.setState({OtpVerifySpinner : false, errors: errors})
        }
        if (!!this.state.otpVal) {
            var code = this.state.otpVal;
            let _this = this
            confirmationResult.confirm(code).then(function (result) {
                const userData = {
                    "mobileNumber": _this.state.mobileNo,
                    "token": result.user.Aa
                }
                _this.props.loginWithOtp(userData)
                    .then(res => {
                        service.setCookieData('token', res.token);
                        _this.props.toggleLoginPopup(false);
                    }).then(res => {
                        window.location.reload()
                        _this.setState({OtpVerifySpinner : false})
                        // this.loginError();
                    });
                window.confirmationResult = null;

            }).catch(function (error) {
                console.log(error)
                isValid = false;
                errors["otp_field"] = "Enter Valid OTP";
                _this.setState({OtpVerifySpinner : false})
            }).then(() => {
                this.setState({
                    errors: errors
                });
            })

        }

        return isValid;
    }

    passwordBlurHandler = () => {
        let errors = {};
        let isValid = true;
        if (this.state.loginInput["new_password"] != this.state.loginInput["confirm_password"]) {
            isValid = false;
            errors["confirm_password"] = "Password's are not matching";
            this.setState({updatePasswordSpinner: false})
        }
        // if (!this.state.loginInput["new_password"]) {
        //     isValid = false;
        //     errors["new_password"] = "Please enter new password.";
        // }
        if (this.state.loginInput["new_password"].length === 0) {
            isValid = false;
            errors["new_password"] = "Please enter password";
            this.setState({updatePasswordSpinner: false})
        }
        this.setState({
            errors: errors
        });

        return isValid;
    }

    editNumber = () => {
        this.setState({ editNumber: true, signInWithOtp: false, signInWithPassword: true, })
    }

    forgetPassword = () => {
        this.setState({isForgetPassword:true, signInWithPassword: false})
    }

    passwordOtp = () => {
        if (this.validateMblNo()) {
            let _this = this
          //  this.setState({ passwordOtp: true });
            if(this.state.updatePasswordMbl.length === 10) {
                const userData = {
                    "mobileNumber": this.state.updatePasswordMbl
                }
                this.props.isUserExist(userData)
                    .then(() => {
                        this.setState({ isUserRegistered: this.props.userExist}, () => {
                            this.setState({ showSpinner: false })
                            !this.state.isUserRegistered ? this.setState({passwordOtp: true}) : this.setState({passwordOtp: false})
                        })
                })
            }
            let phoneNumber = "+91" + this.state.updatePasswordMbl;
            try {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    'size': 'invisible',
                    'callback': function (response) {
                        _this.onSignInSubmit();
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
                    _this.setState({ showSpinner: false });
                })
                    .catch(function (error) {
                        console.log(error);
                    });
                window.recaptchaVerifier.reset();
            } catch (error) {
                console.log(error)
            }
       }

    }

    updatePasswordHandler = (event) => {
        event.preventDefault();
        this.setState({updatePasswordSpinner: true})
        if (this.passwordBlurHandler()) {
            const userData = {
                "mobileNumber": this.state.updatePasswordMbl,
                "token": this.state.token,
                "newPassword": this.state.loginInput["new_password"]
            }
            this.props.resetPassword(userData)
                .then(res => {
                   // service.setCookieData('token', res.token);
                    this.setState({ updatePasswordSpinner: false, updatePassword: false, passwordUpdated: true });
                  //  this.props.toggleLoginPopup(false);
                  //  window.location.reload()
                })
        } 
    }
    passwordUpdateLogin = () => {
        this.setState({passwordUpdated: false, signInWithPassword: true})
    }
    closePopup = () => {
        this.props.toggleLoginPopup(false);
    }
    forgetPasswordSignin = (e) => {
        e.preventDefault()
        this.setState({isForgetPassword : false, signInWithPassword: true})
    }

     render() {
        const { user_phone,
            user_password,
            validate_phone,
            new_password,
            confirm_password,
            otpFrom,
            isUserRegistered,
            passwordOtp,
            updatePassword,
            signupContent,
            signInWithOtp,
            isForgetPassword,
            signInWithPassword,
            passwordUpdated
        } = this.state;
        const { loginError } = this.props;
        return (
            <React.Fragment>

                {/* Sign in model */}
                <div className="sign-in full-border">
                    {(signupContent ?
                        <span>
                            {(signInWithPassword ?
                                <span id="StageOne" className="stage1">
                                    <h2>Sign In</h2>
                                    <small>Please Sign In below account detail</small>
                                    {(otpFrom ?
                                        <form name="form" onSubmit={this.handleLoginSumbit} >
                                            {(loginError ? <span className="help-block">{loginError.responseInfo.returnMessage}</span> : "")}
                                            <div className="form-group">
                                                <span className="input-with-icon">
                                                    
                                                    <input
                                                        type="text"
                                                        className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_phone ? "input-error-border" : "form-input-class"))}
                                                        name="user_phone"
                                                        value={user_phone}
                                                        onChange={this.mobileNumberChange}
                                                        placeholder="Phone Number"
                                                        onBlur={this.handleBlurPhone}
                                                    />
                                                    <img src="/public/images/iphone.svg" />
                                                </span>
                                                <div className="help-block">
                                                    {(isUserRegistered ? "User is Not Registered" : this.state.errors.user_phone)}
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <span className="input-with-icon">
                                                    
                                                    <input
                                                        type="text"
                                                        className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_password ? "input-error-border" : "form-input-class password"))}
                                                        name="user_password"
                                                        value={this.state.userPassword}
                                                        // style={{ textSecurity: "disc", WebkitTextSecurity : "disc", MozTextSecurity : "disc"}}
                                                        onChange={this.handlePasswordChange}
                                                        placeholder="Your Password"
                                                        autoComplete = "off"
                                                    />
                                                   <img src="/public/images/Lock-icon.png" />
                                                </span>
                                                <div className="help-block">{this.state.errors.user_password}</div>
                                                <span className="forget-password" onClick={() => this.forgetPassword()}>Forget Password ? </span>
                                            </div>
                                            <div>
                                                {this.state.signInSpinner ? 
                                                    <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Sign In</button></span> :
                                                    <button type="submit">Sign In</button>
                                                }
                                            </div>
                                            <div className="sign_otp">
                                                <a type="submit" onClick={(e) => this.signInOtp(e, false)} >Sign In with OTP</a>
                                            </div>

                                        </form>
                                        :
                                        <form name="form" onSubmit={this.handleLoginOtp}>
                                            <div ref={ref => this.recaptchaWrapperRef = ref}>
                                                <div id="recaptcha-container"></div>
                                            </div>
                                            {(loginError ? <span className="help-block">{loginError.responseInfo.returnMessage}</span> : "")}
                                            <div className="form-group">
                                                <span className="input-with-icon">
                                                   
                                                    <input
                                                        type="text"
                                                        className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_phone ? "input-error-border" : "form-input-class"))}
                                                        name="user_phone"
                                                        // value={user_phone}
                                                        defaultValue={this.state.editNumber ? this.state.mobileNo : user_phone}
                                                        onChange={this.mobileNumberChange}
                                                        placeholder="Phone Number"
                                                        onBlur={this.handleBlurPhone}
                                                    />
                                                     <img src="/public/images/iphone.svg" />
                                                </span>

                                                <div className="help-block">
                                                    {(isUserRegistered ? "User is Not Registered" : this.state.errors.user_phone)}
                                                </div>
                                            </div>
                                                {this.state.showSpinner ?
                                                     <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Sign In with OTP</button></span>
                                                    :
                                                     <button type="submit">Sign In with OTP</button>
                                                }
                                            <div className="sign_otp">
                                                <a type="submit" onClick={(e) => this.signInOtp(e, true)}>Sign In with Password</a>
                                            </div>
                                        </form>
                                    )}
                                </span>
                                :
                                signInWithOtp ?
                                <span id="StageTwo" className="stage2">
                                    {/* {this.startTimer()} */}
                                    <div ref={ref => this.recaptchaWrapperRef = ref}>
                                        <div id="recaptcha-container"></div>
                                    </div>
                                    <h5>OTP Sent</h5>
                                    <span className="otp-enter">
                                        <input autoComplete='off' type="text" name="otp_field" placeholder="Enter OTP" onChange={(e) => this.otpVal(e)} />
                                        <span>
                                            <img src="/public/images/OTP.svg" /> </span>
                                    </span>
                                    <div className="help-block">{this.state.errors.otp_field }</div>
                                    <button className="edit-no-btn" onClick={() => this.editNumber()}>
                                        <span>
                                            <img src="/public/images/edit.svg" />
                                        </span>
                                        Edit Mobile Number
                                    </button>
                                    {this.state.resendBtn ? <span className="resend-otp" onClick={() => this.resendOtp()}>Resend OTP</span> :
                                        <time>Time Left :  {this.state.time.m} : {this.state.time.s}</time>}
                                    {this.state.OtpVerifySpinner ?
                                      <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Verify OTP</button></span>
                                    :
                                      <button onClick={this.verifyOtp}>Verify OTP</button>
                                    }
                                </span>
                                :
                                isForgetPassword ?
                                <>
                                    <h2>Update Password </h2>
                                    <small>Verify Mobile Number to update Password</small>
                                    <form name="form" onSubmit={this.handleVerifyNumber}>
                                        <div ref={ref => this.recaptchaWrapperRef = ref}>
                                            <div id="recaptcha-container"></div>
                                        </div>
                                        {(loginError ? <span className="help-block">{loginError.responseInfo.returnMessage}</span> : "")}
                                        <div className="form-group">
                                            <span className="input-with-icon">
                                                <input
                                                    type="text"
                                                    className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_phone ? "input-error-border" : "form-input-class"))}
                                                    name="validate_phone"
                                                    defaultValue={validate_phone}
                                                    onChange={this.updatePasswordMblChange}
                                                    placeholder="Phone Number"
                                                    onBlur={this.handleBlurPhone}
                                                />
                                                <img src="/public/images/iphone.svg" />
                                            </span>
                                            <div className="send-code" onClick={this.passwordOtp}>Send Code</div>
                                            <div className="help-block">
                                                {(isUserRegistered ? "User is Not Registered" : this.state.errors.validate_phone)}
                                            </div>
                                            {passwordOtp ?
                                                <>
                                                    <span className="otp-enter">
                                                        <input type="text" autoComplete='off' name="otp_field" placeholder="Enter OTP" className = "password-otp-field" onChange={(e) => this.otpVal(e)} />
                                                        <span><img src="/public/images/OTP.svg" /> </span>
                                                    </span>
                                                </> : ""}
                                    <div className="help-block">{this.state.errors.otp_field }</div>
                                        </div>
                                        <div>
                                            {this.state.verifyMblSpinner ?
                                                // <button type="submit"><LoadingOutlined className="loading-icon" />Verify Mobile Number</button>
                                                <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Verify Mobile Number</button></span>
                                                :
                                                <button type="submit">Verify Mobile Number</button>
                                            }
                                        </div>
                                        <div className="sign_otp">
                                            <a onClick={(e) => this.forgetPasswordSignin(e)}>Sign In with Password</a>
                                        </div>
                                    </form>
                                </>
                                :
                                updatePassword ?
                                <>
                                <h2>Update Password </h2>
                                <small>Enter New Password</small>
                                <form name="form" onSubmit={this.updatePasswordHandler}> 
                                    <div className="form-group">
                                        <span className="input-with-icon">
                                            <input
                                                type="password"
                                                className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_password ? "input-error-border" : "form-input-class"))}
                                                name="new_password"
                                                value={new_password}
                                                onChange={this.handleChange}
                                                placeholder="New Password"
                                            />
                                            <img src="/public/images/user.svg" />
                                        </span>
                                        <div className="help-block">{this.state.errors.new_password}</div>
                                    </div>
                                    <div className="form-group">
                                        <span className="input-with-icon">
                                            <input
                                                type="password"
                                                className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_password ? "input-error-border" : "form-input-class"))}
                                                name="confirm_password"
                                                value={confirm_password}
                                                onChange={this.handleChange}
                                                placeholder="Confirm Password"
                                                onBlur={this.passwordBlurHandler}
                                            />
                                            <img src="/public/images/user.svg" />
                                        </span>
                                        <div className="help-block">{this.state.errors.confirm_password}</div>
                                        {this.state.updatePasswordSpinner ?
                                                <span className="qty-indicator-spnr"><button className="loading-btn"><Spinner />Update Password</button></span>
                                                :
                                                <button type="submit" className="update-password-btn">Update Password</button>
                                            }
                                    </div>
                                </form>
                                </>
                                : 
                                passwordUpdated ?
                                <>
                                <div className="password-updated">Password Updated Succesfully. Please <span className="login-password" onClick={this.passwordUpdateLogin}>Login</span> with New Password</div>
                                </>
                                : ""
                            )}
                        </span>
                        :
                        <span id="createAccountForm">
                            <h2>Create Account</h2>
                            <small>Please Sign In below account detail</small>
                            <RegisterForm />
                        </span>
                    )}
                </div>
                <div className="sign-up">
                    {(signupContent ?
                        <span id="signupContent">
                            <h5>Don't have an account?</h5>
                            <button onClick={this.createAccount}> Create Account</button>
                        </span> :
                        <span id="signinContent">
                            <h5>Already an account holder?</h5>
                            <button onClick={this.accountSignIn} >Sign In</button>
                        </span>
                    )}
                    <br />
                    <small>
                        <Link to='/terms' onClick={() => this.closePopup()}>
                            * Terms &amp; Conditions
                        </Link>
                        <br />
                        Your privacy and security are important to us.For more information on how we use your data read our <Link to='/privacy' onClick={() => this.closePopup()}>Privacy</Link>

                    </small>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loginError: state.userLogin.loginError,
        userExist : state.userLogin.userResponse,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        postUserLogin: service.postUserLogin,
        loginWithOtp: service.loginWithOtp,
        resetPassword: service.resetPassword,
        toggleLoginPopup: service.toggleLoginPopup,
        isUserExist: service.isUserExist,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SingInRegister);
