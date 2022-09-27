import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import './Location.scss';
import './PopUp.css';
import  {getMinOrderValue} from "../constants/StaticConstants";
class PopUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            popUpModal: true,
        };
    }
  
    modalClose = () => {
        this.setState({ popUpModal: false })
        this.props.popUpState(false)
    }
    render() {
        var minValue = getMinOrderValue()
        return (
            <React.Fragment>
               
                    <Modal id="myModal" show={this.state.popUpModal} onHide={this.modalClose} className="modal">
                        <Modal.Body className="modal-content">
                            <span className="close" onClick={this.modalClose}> 
                                <img src="/public/images/close.svg" />
                             </span>
                            {this.props.minOrderpopUp && this.props.minOrderpopUp ?
                                <div className="min-order-popup">
                                    <img src="/public/images/min-order.svg" />
                                    <div className="min-text">Minimum Order Value</div>
                                    <span className="min-rs">Rs. {minValue}</span>
                                </div>
                            : ""}
                        </Modal.Body>
                    </Modal>
                  
               
            </React.Fragment>
        );
    }
}


export default connect(null, null)(PopUp);
