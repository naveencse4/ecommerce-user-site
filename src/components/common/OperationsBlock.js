import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import service from '../../redux/actions/index';
import { MAX_LIMIT } from '../constants/constants';
import Spinner from './Spinner';
import './OperationsBlock.css';

class OperationsBlock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDecSpinner: false,
            showIncSpinner: false,
            showDelSpinner: false,
        }
    }
    formRef = React.createRef();
    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                showDecSpinner: false,
                showIncSpinner: false,
                showDelSpinner: false,
            });
        }
    }

    updateQuantity = (e) => {
        this.props.updateQuantity(e);
    }
    updateQuantityIncHandler = () => {
        this.setState({ showIncSpinner: true }, () => {
            this.props.updateCart(this.prepareObj(1));
        });

        // if(quantity !== MAX_LIMIT){
        //     this.setState({ 
        //         showIncSpinner: true
        //     }, () => {
        //         this.props.updateQuantityIncHandler(e, quantity);
        //     });
        // }
    };

    updateQuantityDecHandler = () => {
        this.setState({ showDecSpinner: true }, () => {
            this.props.updateCart(this.prepareObj(-1));
        });
    }

    addToCart = () => {
        if (service.isLogin())
            this.setState({ showIncSpinner: true });
        this.props.updateCart(this.prepareObj(this.props.selectedVariant.quantity));
    }

    deleteCartVariant = () => {
        console.log(this.props.selectedVariant)
        this.setState({inputSpinner : true})
        const obj = { id: this.props.source === 'CART' ? this.props.selectedVariant.varientId : this.props.selectedVariant.id, quantity: 0 };
        this.setState({ showDelSpinner: true }, () => {
            if (this.props.state && this.props.state.maxQtyError) {
                this.props.state.maxQtyError = !this.props.state.maxQtyError;
            }
            this.props.selectedVariant.quantity = 1;
            this.props.updateCart(obj);
            
        });
    }

    prepareObj = (quantity) => {
        return { id: this.props.source === 'CART' ? this.props.selectedVariant.varientId : this.props.selectedVariant.id, quantity };
    }

    render() {
        const { cartData, source } = this.props;
        const selectedVariant = this.props.selectedVariant;
        let inCart = [];
        if (cartData) {
            inCart = cartData.filter(variant => {
                if (source && source === 'CART')
                    return variant.varientId === selectedVariant.varientId;
                else
                    return variant.varientId === selectedVariant.id;
            });
        }
        return (
            <React.Fragment>
                {(inCart.length > 0 && inCart[0].quantity) || source && source === 'CART' ?
                    <div className="qty-n-add">
                        <div className="qty-added flex">
                            {this.state.showDecSpinner ?
                                <span className="qty-indicator-spnr"><Spinner /></span>
                                : <img
                                    src="/public/images/remove.svg"
                                    className="qty-indicator pointer"
                                    onClick={this.updateQuantityDecHandler}
                                />
                            }
                            <span className="qty-number-added flex f-ac">{inCart[0].quantity > MAX_LIMIT ? MAX_LIMIT : inCart[0].quantity}<span>in Cart</span></span>
                            {this.state.showIncSpinner ?
                                <span className="qty-indicator-spnr"><Spinner /></span>
                                :
                                <img
                                    src="/public/images/plus.svg"
                                    className={inCart.length > 0 && inCart[0].quantity >= MAX_LIMIT || inCart.length > 0 && inCart[0].quantity >= selectedVariant.availabilityCount ? "qty-indicator disable-pointer" : "qty-indicator pointer"}
                                    onClick={this.updateQuantityIncHandler}
                                />
                            }
                        </div>
                        {this.state.showDelSpinner ?
                            <span className="del-btn-spnr"><Spinner /></span>
                            :
                            <img src="/public/images/delete.svg" onClick={this.deleteCartVariant} className="del-icon pointer" />
                        }
                    </div>
                    :
                    <div className="qty-n-add">
                        <span className="qty">
                            <span className="qty-heading">Qty</span>
                            <input type="text" name="quantity"
                                value={inCart.length > 0 && inCart[0].quantity ? inCart[0].quantity
                                    : selectedVariant.quantity
                                }
                                className="qty-number" onChange={this.updateQuantity} />
                        </span>
                        {this.state.showIncSpinner ?
                            <button className="add-btn-spnr"><Spinner /></button>
                            :
                            this.props.selectedVariant.availabilityCount > 0 ?
                            <button className="add-btn" onClick={this.addToCart}>ADD<span className="add-cart-icon">
                                <img src="/public/images/Shopping-cart-transparent.svg" />
                            </span>
                            </button> 
                            :  ""
                            // <button className="out-of-stock-btn">Out Of Stock</button>
                        }
                        <div className="max-qty-error">{this.props.state && this.props.state.maxQtyError ? "Max qty is" + " " +MAX_LIMIT : ""}</div>
                    </div>
                }
            </React.Fragment>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        cartData: state.cart.cartData,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        updateCart: service.updateCart
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OperationsBlock);


// export default OperationsBlock;
