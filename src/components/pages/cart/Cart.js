import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Fragment } from 'react';
import { Route } from 'react-router-dom'
import service from '../../../redux/actions/index';
import { connect } from 'react-redux';
import OperationsBlock from '../../common/OperationsBlock';
import './Cart.scss';
import { Link } from 'react-router-dom';
import StaticConstants, {getMinOrderValue} from "../../constants/StaticConstants";
import { getFilteredVariants } from "../../constants/StaticConstants";
import PopUp from '../../common/PopUp';
import Locations from '../../common/Locations';
class Cart extends Component {
	constructor(props) {
		super(props);
		
        this.state = {
            btnCount: 0,
			varientId: "",
			maxQtyError: false,
			minOrderpopUp : false
        };
    }

	componentDidMount() {
		// only fetch data if it does not already exist
		// if (!this.props.data) this.props.getData();	
		// this.props.getAddressData()
	}
		

	// componentDidUpdate(prevProps) {
	// 	if (this.props.location !== prevProps.location) {
	// 		this.props.getData(this.props.match);
	// 	}
	// 	if (this.props.selectedZone !== prevProps.selectedZone) {
	// 		this.props.getData(this.props.match);
    //     }
	// }
	openCart = () => {
		document.getElementById("cartSidenav").style.width = "310px";
	}

	cartClose = () => {
		document.getElementById("cartSidenav").style.width = "0px";
	}

	popUpState = (e) => {
		this.setState({ minOrderpopUp: e })
	}
	// updateQuantity = (e) => {
    //     const currentState = { ...this.state.selectedVariant };
    //     e.target.value >= MAX_LIMIT ? this.setState({maxQtyError : true}) : this.setState({maxQtyError : false})
    //     currentState.quantity = e.target.value >= MAX_LIMIT ? MAX_LIMIT : e.target.value;
    //     this.setState({ selectedVariant: currentState }, () => {
    //         this.onVariantSelection(this.state.selectedVariant);
    //     });
    // }
	render() {
		const { cartData } = this.props;
		const totalPrice = this.props.cartData.reduce((sum, item) =>
			sum + parseInt(item.quantity * item.maxPrice), 0);
		var errorState = false
		var toTop = (key, value) => (a, b) => (b[key] === value) - (a[key] === value);
        this.props.cartData.sort(toTop('availabilityCount', 0));
		return (
			<React.Fragment>
				<div className="fixed-cart-count hide-mbl">
					<div className="f-cart-heading">
						<span>
							<img src="/public/images/shopping-basket-white.svg" />
						</span>
						{cartData ? cartData.length : "No"} Items
					</div>

					{/*<span onClick={() => {*/}
					{/*	this.props.cartData.length >0 ? this.cartClose() : null*/}
					{/*}}>*/}
					<button onClick={() => {
						cartData.length >0 ? this.openCart() : null}}> Rs.
						{parseFloat(totalPrice).toFixed(2)}
					</button>
				</div>

				<Link to='#' onClick={()=> window.open("https://api.whatsapp.com/send?phone=+919154417418&text=%20Hi%20Heybandi,%20I%20would%20like%20to%20create%20my%20own%20list%20for%20bulk/party%20order", '_blank')}>
					<div className="fixed-whats-app-icon">
					<img src="/public/images/whatsapp.png" />
				    </div>
				</Link>
				
				<div id="cartSidenav" className="catsidenav">
					<div className="cart-top">
						<span className="c-items">
							<img src="/public/images/shopping-basket.svg" />
							{this.props.cartData.length} Items
							<span onClick={this.cartClose}>
								<img src="/public/images/green-close.svg" />
							</span>
						</span>
					</div>
					<section>
						{this.props.cartData !== "" && this.props.cartData !== undefined ?
							<Fragment>
								{this.props.cartData.map((item, index) => {
									return <div className={item.quantity > item.availabilityCount ? "card-error" : "cart-product-card"} key={index} >
										<img src={item.productMedia[0].prefix + item.productMedia[0].childern[0].url} className="cart-prod-img" />
										<h5>{item.productFullTitle}</h5>
										<span>Rs.
											{parseFloat(item.maxPrice).toFixed(2)}
										</span>
										<OperationsBlock
											{...this.props}
											source='CART'
											selectedVariant={item}
											updateQuantity={this.updateQuantity}
											onVariantSelection={this.onVariantSelection}
										/>
										{/* {item.quantity === item.availabilityCount ?
											<>
											<div className="stock-err-msg">Max qty Added</div>
											</>
											: */}
											{item.quantity > item.availabilityCount ?
											<>
											{errorState = true}
											<div className="stock-err-msg">Available Only {item.availabilityCount}</div>
											</>
											: 
											""
										}
									</div>
									 
								})}
							</Fragment>
							: ""	
						}
						{this.props.cartData.length == 0 ? <div className="no-prods-error-msg"> No Items in Cart</div> : ""}
					
					</section>
					<div className="cart-bottom-fixed">
						<div className="total">
							Total
							<span className="cart-total-price"><span className="rupee-text">Rs.</span>
								{parseFloat(totalPrice).toFixed(2)}
							</span>
						</div>
						<Route render={({ history }) => (
							<button
								type='button'
								className={errorState|| this.props.cartData.length == 0 ? "checkout-btn-disable": "p-checkout"}
								onClick={() => {
									this.proceedForCheckout(cartData,history,totalPrice)
								}}
							>
								Proceed to Checkout
							</button>
						)} />
					</div>
				</div>
				{this.state.minOrderpopUp ? <PopUp popUpState={this.popUpState} minOrderpopUp={this.state.minOrderpopUp} /> : ""}
			</React.Fragment>
		);
	}

	proceedForCheckout  (cartData,history,totalPrice)  {
		var minValue = getMinOrderValue()
		if (totalPrice<minValue){
		//	alert("Minimum order value must be "+minValue)	
			this.popUpState(true);
			return 
		}
		this.cartClose();
		if (cartData.length>0){
			history.push('/checkout')
		}else {		}
	}
}

Cart.propTypes = {
	data: PropTypes.shape({
		text: PropTypes.string
	}),
	getData: PropTypes.func.isRequired
};

Cart.defaultProps = {
	data: null
};

const mapStateToProps = (state, ownProps) => {
	return {
		cartData: state.cart.cartData,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		updateCart: service.updateCart,
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Cart);

