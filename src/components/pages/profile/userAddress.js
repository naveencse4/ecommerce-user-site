import React, { Component } from 'react';
import './address.scss';
import { bindActionCreators } from 'redux';
import Select from 'react-select';
import { connect } from 'react-redux';
import service from '../../../redux/actions/index';
import Cookies from 'js-cookie';
import { Modal } from 'react-bootstrap';
import Locations from '../../common/Locations';

class UserAddress extends Component {

    constructor(props) {
        super(props);
        const { data } = this.props;
        const locationsData = data.data ? data.data : [];
        let inputEditData = this.props.inputEditData
        const filteredLocation = locationsData.filter(loc => loc.name === inputEditData.localArea);
        this.state = {
            input: {},
            errors: {},
            addType: this.props.inputEditData.friendlyName ? this.props.inputEditData.friendlyName : "Home",
            addressTypes: ["Home", "Work", "Other"],
            selectedOption: {value: filteredLocation[0] ? filteredLocation[0].id : Cookies.get('zoneValue'), label: filteredLocation[0] ? filteredLocation[0].name : Cookies.get('zone') },
            isEditAddress: true,
            isCancel: false,
            locationPopUp: false,
            onlyPopup : true,
        };
    }

    componentDidMount() {
        let input = {};

        let inputEditData = this.props.inputEditData
        
        if (Object.keys(inputEditData).length !== 0) {
            input["addressLine1"] = inputEditData.addressLine1;
            input["addressLine2"] = inputEditData.addressLine2;
            input["localArea"] = inputEditData.localArea;
            input["postal"] = inputEditData.postal;
            input["friendlyName"] = inputEditData.friendlyName;
            input["friendlyName1"] = inputEditData.friendlyName1;
            input["addressLine3"] = inputEditData.addressLine3;

            this.setState({
                input: input,
                isEditAddress: false,
            });
        }
    }

    handleChange = (event) => {
        let input = this.state.input;
        input[event.target.name] = event.target.value;

        this.setState({
            input
        });
    }

    handleAddressTypeChange = (event) => {
        let input = this.state.input;
        input["friendlyName1"] = event.target.value;
        input["friendlyName"] = event.target.value;
        this.setState({
            input
        });
    }

    handleAddressType = (e, address) => {
        this.setState({ addType: address });
    }

    handleChangeZone = selectedOption => {
        this.setState({selectedOption: selectedOption, errorMessage: false})
    };

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.validate()) {
            this.props.closeAddressModel();
            let input = {};
            input["addressLine1"] = "";
            input["addressLine2"] = "";
            input["localArea"] = "";
            input["postal"] = "";
            input["friendlyName1"] = "";
            input["addressLine3"] = "";
            input["friendlyName"] = ""

            this.setState({ input: input });

            if (this.state.input) {
                const friendlyName = this.state.input.friendlyName1 !== undefined ? this.state.input.friendlyName1 : this.state.addType;
              //  const friendlyName = this.state.input.friendlyName !== undefined ? this.state.input.friendlyName : this.state.addType;
                const userAddress = {
                    "friendlyName": friendlyName,
                    "geom": [0.0, 0.0],
                    "addressLine1": this.state.input.addressLine1,
                    "addressLine2": this.state.input.addressLine2,
                    "addressLine3": this.state.input.addressLine3,
                    "localArea" : this.state.selectedOption.label,
                    "city": "Hyderabad",
                    "state": "Telangana",
                    "postal": this.state.input.postal,
                }

                if (this.state.isEditAddress) {
                    this.props.postUserAdderess(userAddress)
                        .then(res => {
                            this.props.getAddressData();
                           // window.location.reload();
                        })
                } else {
                    this.props.updateUserAdderess(userAddress, this.props.inputEditData.id)
                        .then(res => {
                           // window.location.reload();
                           this.props.getAddressData();
                        })
                }

            }
        }
    }


    validate() {
        let input = this.state.input;
        let errors = {};
        let isValid = true;

        // if (!input["friendlyName"]) {
        //     isValid = false;
        //     errors["friendlyName"] = "Please enter your friendly name.";
        // }

        if (!input["addressLine1"]) {
            isValid = false;
            errors["addressLine1"] = "Please enter your House address.";
        }

        if (!input["addressLine2"]) {
            isValid = false;
            errors["addressLine2"] = "Please enter your Street address.";
        }

        // if (!input["localArea"]) {
        //     isValid = false;
        //     errors["localArea"] = "Please Select your Area.";
        // }


        if (!input["postal"]) {
            isValid = false;
            errors["postal"] = "Please enter your postal code";
        }
        this.setState({
            errors: errors
        });
        return isValid;
    }

    close = (e) => {
        e.preventDefault();
        this.props.closeAddressModel();
       // console.log(this.props.changeZone(true))
        this.props.changeZone(false)
    }

    zoneChange = () => {
        this.props.closeAddressModel();
        this.props.changeZone(true)
    }

    render() {
        const { addressTypes, addType, selectedOption } = this.state;
        const { data, inputEditData } = this.props;
        const locationsData = data.data ? data.data : [];

        const Options = locationsData.map(location => {
            return { value: location.id, label: location.name }
        });

        return (
            <Modal id="signInModal"
            show={this.props.userAddressModel}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Body>
             <React.Fragment>
                 <div id="AddAdrsBlck" className="add-adrs-container pop-up">
                     <div className="add-adrs-pop-up pop-up-content">
                         <h2>Add Your Address
                             <br />
                             <small>Please enter below detail</small>
                         </h2>
                         <form name="form" onSubmit={this.handleSubmit}>
                             {/*  */}
                             <div className="form-group">
                                 <input
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="House No"
                                    name="addressLine1"
                                    value={this.state.input.addressLine1}
                                />
                                <div className="help-block">{this.state.errors.addressLine1}</div>
                            </div>
                            <div className="form-group">
                                <input
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Street Address"
                                    name="addressLine2"
                                    value={this.state.input.addressLine2}
                                />
                                <div className="help-block">{this.state.errors.addressLine2}</div>
                            </div>
                            <div className="form-group">
                                <Select
                                    value={selectedOption}
                                  //  value = {this.state.input.localArea}
                                    onChange={this.handleChangeZone}
                                    options={Options}
                                    className="variant-drp"
                                    placeholder="Select your delivery locationnnnn"
                                    isDisabled={this.props.checkoutAddress ? true : false}
                                />
                                {this.props.checkoutAddress ? <div className="change-local-zone" onClick={this.zoneChange}>Change Local area</div> : ""}
                                {/* <div className="help-block">{this.state.errors.localArea}</div> */}
                            </div>
                                {/* {this.state.locationPopUp ? <Locations state={this.state}/> : ""} */}
                            <div className="form-group">
                                <input
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Postal Code"
                                    name="postal"
                                    value={this.state.input.postal}
                                />
                                <div className="help-block">{this.state.errors.postal}</div>
                            </div>
                            <div className="form-group">
                                <input
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Landmark (Optional)"
                                    name="addressLine3"
                                    value={this.state.addressLine3}
                                />
                            </div>
                            <div className="adrs-types-btn flex">

                                {addressTypes.map((address, index) => {
                                    return <span className="add-select-btn-cls"
                                        onChange={this.handleChange}
                                        key={index}
                                      //  className={addType === address ? "address-type-selected" : "adrs-types-btn-all"}
                                        className={addType === address ? "address-type-selected" :
                                        addType !== "Home" && addType !== "Work" && address !== "Home" && address !== "Work" ? "address-type-selected" :
                                        "adrs-types-btn-all"}
                                        onClick={(e) => this.handleAddressType(e, address)}
                                    >
                                        <img src={address === "Other" ? "/public/images/other-address.svg" :
                                            address === "Home" ? "/public/images/home.svg" :
                                                "/public/images/briefcase.svg"
                                        }
                                            alt = "AddressType" />
                                        {address}
                                    </span>
                                })}

                            </div>
                            
                            {(addType !== "Home" && addType !== "Work") ?
                                <div className="form-group">
                                    <input
                                        onChange={this.handleAddressTypeChange}
                                        type="text"
                                        placeholder="Address type"
                                        autoComplete="off"
                                        name="friendlyName"
                                       value={this.props.inputEditData.friendlyName !== "Home" && this.props.inputEditData.friendlyName !== "Work" ? this.state.input.friendlyName : "Other"}
                                      //  value={this.props.inputEditData.friendlyName ? this.state.input.friendlyName : ''}
                                    />
                                </div>
                                :
                                <div className="form-group">
                                    <input
                                        value={addType}
                                        type="hidden"
                                        placeholder="Address type"
                                        name="friendlyName"
                                        autoComplete="off"
                                    />
                                </div>

                            }
                            <div className="edit-prfl-btns">
                                <button className="save">Save</button>
                                <button className="cancel" onClick={(e) => this.close(e)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </React.Fragment >
            </Modal.Body>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        data: state.util.zones,
        selectedZone: state.util.selectedZone,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        postUserAdderess: service.postUserAdderess,
        updateUserAdderess: service.updateUserAdderess,
        getAddressData: service.getAddressData
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserAddress);
