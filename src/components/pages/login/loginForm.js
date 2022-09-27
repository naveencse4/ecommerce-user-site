import React, { Component } from 'react';
import './SignIn.scss';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import service from '../../../redux/actions/index';
import firebase from "../../common/Firebase/firebase";

class LoginForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            input: {},
            errors: {},
            otpFrom: false,
            enterOtp : false
        };
    }

    handleChange = (event) => {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    signInOtp = (e, boolVal) => {
        this.setState({
            otpFrom: boolVal,
        });
    }

    handleBlurPhone = () => {

        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (typeof input["user_phone"] !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(input["user_phone"])) {
                isValid = false;
                errors["user_phone"] = "Please enter only number.";
            } else if (input["user_phone"].length != 10) {
                isValid = false;
                errors["user_phone"] = "Please enter valid phone number.";
            }
        }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    setOtpSent = () => {
        this.props.signInWithOtp(true);
    }

    setUpRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: function (response) {
                this.onSignInSubmit();
                this.showOtp
            },
            defaultCountry: "IN",
          }
        );   
    };
    
    handleLoginOtp = (event) => {
        event.preventDefault(); 
        if (this.validateLoginFrom()) {
            let input = {};
            input["user_phone"] = "";
            this.setState({ input: input });
            this.setState({ enterOtp: true });
            let _this = this
            this.setUpRecaptcha();
            let phoneNumber = "+91" + this.state.input.user_phone;
            let appVerifier = window.recaptchaVerifier;
            firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier).then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                _this.props.signInWithOtp(true); 
              })
              .catch(function (error) {
                console.log(error);
              });
        } 
    }

    handleLoginSumbit = (event) => {
        event.preventDefault();

        if (this.validateLoginFrom()) {
            let input = {};
            input["user_phone"] = "";
            input["user_password"] = "";

            this.setState({ input: input });

            if (this.state.input) {
                const userData = {
                    "mobileNumber": this.state.input.user_phone,
                    "password": this.state.input.user_password
                }

                this.props.postUserLogin(userData)
                    .then(res => {
                        service.setCookieData('token', res.token);
                        this.props.toggleLoginPopup(false);
                    }).then(res=>{
                        window.location.reload()
                        // this.loginError();
                    });
            }
        }
    }

    loginError = () => {
        if (this.props.loginError) {
            window.location.reload()
        }
    }

    validateLoginFrom() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["user_phone"]) {
            isValid = false;
            errors["user_phone"] = "Please enter your phone number.";
        }

        if (typeof input["user_phone"] !== "undefined") {
            var pattern = new RegExp(/^[0-9\b]+$/);
            if (!pattern.test(input["user_phone"])) {
                isValid = false;
                errors["user_phone"] = "Please enter only number.";
            } else if (input["user_phone"].length != 10) {
                isValid = false;
                errors["user_phone"] = "Please enter valid phone number.";
            }
        }

       if(this.state.otpFrom){
            if (!input["user_password"]) {
                isValid = false;
                errors["user_password"] = "Please enter your password.";
            }
       }

        this.setState({
            errors: errors
        });

        return isValid;
    }

    render() {
        const { user_phone, user_password, otpFrom, enterOtp } = this.state;
        const { loginError } = this.props;
        return (
            <React.Fragment>
            {(otpFrom ?
                <form name="form" onSubmit={this.handleLoginSumbit}>
                    {(loginError ? <span className="help-block">{loginError.responseInfo.returnMessage}</span> : "")}
                    <div className="form-group">
                        <span className="input-with-icon">
                            <input
                                type="text"
                                className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_phone ? "input-error-border" : "form-input-class"))}
                                name="user_phone"
                                value={user_phone}
                                onChange={this.handleChange}
                                placeholder="Phone Number"
                                onBlur={this.handleBlurPhone}
                            />
                            <img src="/public/images/iphone.svg" />
                        </span>
                        <div className="help-block">{this.state.errors.user_phone}</div>
                    </div>
                    <div className="form-group">
                        <span className="input-with-icon">
                            <input
                                type="password"
                                className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_password ? "input-error-border" : "form-input-class"))}
                                name="user_password"
                                value={user_password}
                                onChange={this.handleChange}
                                placeholder="Your Password"
                            />
                            <img src="/public/images/user.svg" />
                        </span>
                        <div className="help-block">{this.state.errors.user_password}</div>
                    </div>
                    <div>
                        <button type="submit">Sign In</button>
                    </div>
                    <div className="sign_otp">
                        <a type="submit" onClick={(e) => this.signInOtp(e, false)} >Sign In with OTP</a>
                    </div>

                </form>
                :
                <form name="form" onSubmit={this.handleLoginOtp}>
                    <div id="recaptcha-container"></div>
                    {(loginError ? <span className="help-block">{loginError.responseInfo.returnMessage}</span> : "")}
                    <div className="form-group">
                            <span className="input-with-icon">
                                <input
                                    type="text"
                                    className={"form-control " + (loginError ? "input-error-border" : (this.state.errors.user_phone ? "input-error-border" : "form-input-class"))}
                                    name="user_phone"
                                    value={user_phone}
                                    onChange={this.handleChange}
                                    placeholder="Phone Number"
                                    onBlur={this.handleBlurPhone}
                                />
                                <img src="/public/images/iphone.svg" />
                            </span>
                        <div className="help-block">{this.state.errors.user_phone}</div>
                    </div>
                    <div>
                        <button type="submit">Sign In with OTP</button>
                    </div>
                    <div className="sign_otp">
                        <a type="submit" onClick={(e) => this.signInOtp(e, true)}>Sign In with out OTP</a>
                    </div>
                </form>
             )}


            </React.Fragment>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        loginError: state.userLogin.loginError,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        postUserLogin: service.postUserLogin,
        toggleLoginPopup: service.toggleLoginPopup,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
