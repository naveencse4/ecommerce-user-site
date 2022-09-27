import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import Select from 'react-select';
import './Location.scss';
import service from '../../redux/actions/index';

class Locations extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locationModal: true,
            selectedOption: "",
            errorMessage: false,
            selectedzone: "",
        };
    }

    componentDidMount() {
        this.props.state && this.props.state.onlyPopup ? this.setState({locationModal : true}) : this.setState({locationModal : false})
     //   this.props.state && this.props.state.onlyPopup ? this.setupLocationPopup() : ""
        const zone = service.getCookieData('zone');
        if (zone && zone !== '') {
            this.setState({
                selectedzone: zone,
                selectedOption: { 
                    value: service.getCookieData('zoneValue'), 
                    label: zone
                },                
            }, () => {
                this.setupLocationPopup();
            });
        } else {
            this.setState({
                locationModal: true
            })
        }        
    }

    componentDidUpdate(prevProps) {
        if (this.props.locationData !== prevProps.locationData) {
            this.setState({
                selectedzone: service.getCookieData('zone'),
            })
            if(service.getCookieData('zone')){
                this.setState({
                    selectedOption: { value: service.getCookieData('zoneValue'), label: service.getCookieData('zone') },
                })
            }
        }
        if (this.props.data !== prevProps.data) {
            this.setupLocationPopup();
        }
    }

    setupLocationPopup = () => {
        const { data } = this.props;
        const { selectedOption } = this.state;
        const locationsData = data.data ? data.data : [];
        if (locationsData.length > 0) {
            const filteredZone = locationsData.filter(zone => zone.name === selectedOption.label);
            const cZone = service.getCookieData('zoneValue');
            const cStore = service.getCookieData('store');
            if (filteredZone.length > 0) {
                const nZone = filteredZone[0].id;
                const nStore = filteredZone[0].store.id;
                if (cZone !== nZone || cStore !== nStore) {
                    service.setCookieData('zone', '');
                    service.setCookieData('zoneValue', '');
                    service.setCookieData('store', '');                    
                    this.setState({ locationModal: true, selectedzone: '' });
                }
            } else {
                service.setCookieData('zone', '');
                    service.setCookieData('zoneValue', '');
                    service.setCookieData('store', '');
                this.setState({ 
                    locationModal: true,
                    selectedOption: "",
                    selectedzone: '',
                });
            }
        }
    }

    continueBtn = () => {
        const { selectedOption } = this.state;
        if (selectedOption) {
            const { data } = this.props;
            const locationsData = data.data;
            const filteredZone = locationsData.filter(zone => zone.name === selectedOption.label);
            service.setCookieData('store', filteredZone[0].store.id);
            service.setCookieData('zone', filteredZone[0].name);
            this.props.setSelectedZone(filteredZone);
            this.props.emptyHomeData();
            this.props.emptyCategoryData();
            service.setCookieData('zoneValue', selectedOption.value);
            this.setState({ locationModal: false, selectedzone: filteredZone[0].name });
            // this.setState({ locationModal: false, selectedzone: service.getCookieData('zone') }, () => {
            //     console.log(this.state.selectedZone)
            // });
            this.props.changeZone && this.props.changeZone(false)
        } else {
            this.setState({ errorMessage: true });
        }
    };

    locationModalOpen = () => {
        this.setState({ locationModal: true });
    }

    locationModalClose = () => {
        this.setState({ locationModal: this.state.selectedzone ? false : true });
        this.props.changeZone && this.props.changeZone(false)
        const zone = service.getCookieData('zone');
        if (zone && zone !== '') {
            this.setState({
                selectedzone: zone,
                selectedOption: {
                    value: service.getCookieData('zoneValue'),
                    label: zone
                },   
            });
        }
    }

    handleChange = selectedOption => {
        this.setState({ selectedOption: selectedOption, errorMessage: false });
    };

    render() {
        const { locationModal, selectedOption, errorMessage, selectedzone } = this.state;
        const { data } = this.props;
        const locationsData = data.data ? data.data : [];
        const Options = locationsData.map(location => {
            return { value: location.id, label: location.name }
        });

        return (
            <React.Fragment>
                {this.props.state && !this.props.state.onlyPopup ? <span onClick={this.locationModalOpen}>
                    <span className="location-icon crsr-pntr">
                        <img src="/public/images/location-icon.svg" className="icon" />
                    </span>
                    <span className="location-name crsr-pntr">
                        {selectedzone ? service.getCookieData('zone') : "Select Location"}
                    </span>
                    <span className="icon down-arrow-location crsr-pntr">
                        <img src="/public/images/arrow-down-sign-to-navigate.svg" />
                    </span>
                </span>
                    : ""
                }
                {/* <span className="location-name crsr-pntr" onClick={this.locationModalOpen}>
                    {selectedzone ? selectedzone : "Select Location"}
                </span> */}
                {locationModal ? 
                <Modal id="myModal" show={locationModal} onHide={this.locationModalClose} className="modal">
                    <Modal.Body className="modal-content">
                        <div className="location-drop-down-row1">
                            <h5>
                                <span>
                                    <img src="/public/images/green-location-icon.svg" />
                                </span>
                                <span className="location-title">Locations</span>
                            </h5>
                            {selectedzone ? 
                            <span className="close" onClick={this.locationModalClose}> × </span>
                            : ""}
                        </div>
                        <div className="select-loc-text">Select your delivery location</div>
                        <Select
                            value={selectedOption}
                            onChange={this.handleChange}
                            options={Options}
                            name="locationDropdown"
                            className={errorMessage ? "variant-drp location-error" :"variant-drp" }
                            placeholder="Select your delivery location"
                            
                        />
                        <div className="" />
                        <button onClick={this.continueBtn} className="continue-btn" >Continue</button>
                    </Modal.Body>
                </Modal>
                : null}
            </React.Fragment>
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
		setSelectedZone: service.setSelectedZone,
        emptyCategoryData: service.emptyCategoryData,
        emptyHomeData: service.emptyHomeData,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Locations);
