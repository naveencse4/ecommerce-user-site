import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import service from '../../../redux/actions/index';
import ProfileNav from './profileNav';
import UserAddress from './userAddress';
import './profile.scss';
import Spinner from '../../common/Spinner';



class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userAddressModel: false,
            userProfileModel: false,
            inputEditData: {},
            input: {},
            errors: {},
            checkoutAddress: false
        }
    }

    componentDidMount() {

        if (!service.getCookieData('token')) {
            this.props.history.push('/');
        }
            this.props.getProfileData();
            this.props.getAddressData();
            window.scrollTo(0, 0);
        
    }

    handleChange = (event) => {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        if (!input["fullName"]) {
            isValid = false;
            errors["fullName"] = "Please enter your full name.";
        }

        if (!input["email"]) {
            isValid = false;
            errors["email"] = "Please enter your email address.";
        }



        this.setState({
            errors: errors
        });

        return isValid;
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

    handleBlurFullName = () => {
        let errors = {};
        let isValid = true;

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

            this.setState({ input: input });

            if (this.state.input) {

                const userProfileData = {
                    "name": this.state.input.fullName,
                    "email": this.state.input.email,
                }

                this.props.updateProfileData(userProfileData)
                    .then(res => {
                        this.setState({ userProfileModel: false });
                         window.location.reload();
                       // this.props.getProfileData()
                    })
            }
        }
    }

    showAddressModel = () => {
        this.setState({ inputEditData: "", userAddressModel: true });
    }

    closeAddressModel = () => {
        this.setState({ userAddressModel: false });
    }

    showProfileModel = () => {
        this.setState({ userProfileModel: true });
    }

    closeProfileModel = () => {
        this.setState({ userProfileModel: false });
    }

    editAddressHandler = (address) => {
        this.setState({
            userAddressModel: true,
            inputEditData: address
        });
    };

    editProfileHandler = (profileInfo) => {
        let input = {};
        const { profileData } = this.props;
        input["fullName"] = profileData ? profileData.name : "";
        input["email"] = profileData ? profileData.email : "";

        this.setState({
            userProfileModel: true,
            inputEditData: profileInfo,
            input: input,
        });
    };

    profileEditCancel = (e) => {
        e.preventDefault()
        this.closeProfileModel()
    }
    render() {
        const { userAddressModel, userProfileModel, inputEditData } = this.state;
        const { location, profileData } = this.props;
        const itemToActive = location;

        return (
            <Fragment>
                <div id="profile-page">
                    <div className="profile-container container" >
                        <div className="row">
                            <ProfileNav itemToActive={itemToActive} />
                            <div className="col-lg-6 profile-block-container">

                                <section id="profileBlock" className="profile-block full-border">
                                    <h2>Your Profile
                                        <img src="/public/images/edit-green.svg"
                                            onClick={() => this.editProfileHandler(profileData ? profileData : "")}
                                            className="pointer" />
                                    </h2>
                                    {profileData ?
                                        <div className="u-dtls">
                                            <div className="user-details flex">
                                                <span className="u-dtls-heading">Name</span>
                                                <span>{profileData.name}</span>
                                            </div>
                                            <div className="user-details flex">
                                                <span className="u-dtls-heading">Email</span>
                                                <span>{profileData.email}</span>
                                            </div>
                                            <div className="user-details flex">
                                                <span className="u-dtls-heading">Mobile No</span>
                                                <span>{profileData.mobileNumber}</span>
                                            </div>
                                        </div>
                                        : <span className="qty-indicator-spnr-p">
                                            <Spinner isPageLoad={true} />
                                        </span>
                                    }

                                    <h2 className="adrs-heading">Address Book</h2>
                                    {this.props.addressData.data !== undefined ?
                                        <>
                                            {this.props.addressData.data.map((address, index) => {
                                                return <>
                                                    <address className="flex">
                                                        {/* <img src="/public/images/home.svg" /> */}
                                                        <img src={address.friendlyName === "Work" ? "/public/images/briefcase.svg" :
                                                                  address.friendlyName === "Home" ? "/public/images/home.svg" :
                                                                  "/public/images/other-address.svg" 
                                                                } alt = "AddressType" />
                                                        <div className="adrs1">
                                                            <div className="adrs-type">{address.friendlyName}</div>
                                                            <small> {address.addressLine1}, {address.addressLine2}, {address.addressLine3}, {address.localArea}</small>
                                                        </div>
                                                        <div className="adrs-icons flex">
                                                            <img src="/public/images/edit-green.svg" className="pointer" onClick={() => this.editAddressHandler(address)} />
                                                            {/* <img src="/public/images/delete-orange.svg" className="pointer" /> */}
                                                        </div>
                                                    </address>
                                                    <hr />
                                                </>
                                            })}
                                        </>
                                        : <span className="qty-indicator-spnr-p">
                                            <Spinner isPageLoad={true} />
                                        </span>
                                    }

                                    <button onClick={this.showAddressModel}>Add New Address</button>
                                </section>
                            </div>
                        </div>
                    </div >

                    {/* <Modal id="signInModal"
                        show={userAddressModel}
                        onHide={this.closeAddressModel}
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                    >
                        <Modal.Body>
                            <UserAddress inputEditData={inputEditData} closeAddressModel={this.closeAddressModel} userAddressModel={userAddressModel} />
                        </Modal.Body>
                    </Modal> */}

                    {userAddressModel ? <UserAddress inputEditData={inputEditData} closeAddressModel={this.closeAddressModel} userAddressModel={userAddressModel} checkoutAddress={this.state.checkoutAddress} /> : ""}
                </div>
                <Modal id="profileModal"
                    show={userProfileModel}
                    onHide={this.closeProfileModel}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Body>
                        <h2 className="edit-heading">Edit your profile</h2>
                        <form name="form" onSubmit={this.handleSubmit}>
                            {/*  */}
                            <div className="form-group">
                                <span className="input-with-icon">
                                    <label>Name </label>
                                    <input
                                        type="text"
                                        className={"form-control " + (this.state.errors.fullName ? "input-error-border" : "form-input-login")}
                                        name="fullName"
                                        value={this.state.input.fullName}
                                        onChange={this.handleChange}
                                        onBlur={this.handleBlurFullName}
                                    />
                                </span>
                                <div className="help-block">{this.state.errors.fullName}</div>
                            </div>

                            <div className="form-group">
                                <span className="input-with-icon">
                                    <label>Email </label>
                                    <input
                                        type="text"
                                        className={"form-control " + (this.state.errors.email ? "input-error-border" : "form-input-login")}
                                        name="email"
                                        value={this.state.input.email}
                                        onChange={this.handleChange}
                                        onBlur={this.handleBlurEmail}
                                    />
                                </span>
                                <div className="help-block">{this.state.errors.email}</div>
                            </div>
                            <div className="edit-prfl-btns">
                                <button className="save" type="submit">Save</button>
                                <button className="cancel" onClick={(e) => this.profileEditCancel(e)}>Cancel</button>
                            </div>
                        </form>
                    </Modal.Body>
                </Modal>
            </Fragment>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        addressData: state.userLogin.addressData,
        profileData: state.userLogin.profileData
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateProfileData: service.updateProfileData,
        getProfileData: service.getProfileData,
        getAddressData: service.getAddressData
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);