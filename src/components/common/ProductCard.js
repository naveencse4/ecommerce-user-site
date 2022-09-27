
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SelectBox from './SelectDropdown';
import OperationsBlock from './OperationsBlock';
import { STOCK_LEFT, MAX_LIMIT } from '../constants/constants';
import './ProductCard.scss';
import {getFilteredVariants} from "../constants/StaticConstants";

export default class ProductCard extends Component {
    constructor(props) {
        super(props);
        const prodInfo = this.props.prodInfo;
        const varientsInfo = getFilteredVariants(prodInfo.productVarients).map(variant => {
            return Object.assign(variant, { quantity: 1 });
        });
        
        this.state = {
            product: prodInfo,
            varients: varientsInfo,
            selectedVariant: varientsInfo[0],
            isSelected: false,
            btnCount: 0,
            showIncSpinner: false,
            maxQtyError: false,
        };

    }

    componentDidMount() {
        this.updateInitialState();
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.updateInitialState();
        }
    }

    updateInitialState = () => {
        const product = this.props.prodInfo;
        const varients = getFilteredVariants(product.productVarients).map(variant => {
            return Object.assign(variant, { quantity: 1 });
        });
        const selectedVariant = this.state.isSelected ? this.state.selectedVariant : varients[0];
        selectedVariant.quantity = 1;
        this.setState({
            product,
            varients,
            isSelected: false,
            showDecSpinner: false,
            showIncSpinner: false,
			selectedVariant: selectedVariant
        });
    }

    onVariantSelection = (variant) => {
        const currentState = { ...this.state };
        currentState.selectedVariant = variant;
        currentState.isSelected = true;
        this.setState(currentState);
    }

    updateQuantity = (e) => {
        const currentState = { ...this.state.selectedVariant };
        e.target.value >= MAX_LIMIT ? this.setState({maxQtyError : true}) : this.setState({maxQtyError : false})
        currentState.quantity = e.target.value >= MAX_LIMIT ? MAX_LIMIT : e.target.value;
        this.setState({ selectedVariant: currentState }, () => {
            this.onVariantSelection(this.state.selectedVariant);
        });
    }

    render() {
        const product = this.state.product;
        const varients = this.state.varients;
        const selectedVariant = this.state.selectedVariant;
        let inCart = [];
        if (this.props.cartData) {
            inCart = this.props.cartData.filter(variant => {
                return variant.varientId === this.state.selectedVariant.id
            });
        }
        return (
            <div className="reg-product">
                <div className="product-card">
                    <Link to={'/product/' + product.slug} className="product-img center">
                        <div>
                        <img src={product.masterProductMedia[0].prefix + product.masterProductMedia[0].childern[0].imgUrl200}
                            alt={product.title} />
                        </div>
                        <h2 className="fw-500">{product.productName}</h2>
                    </Link>
                    <SelectBox
                        varaints={varients}
                        selectedVariant={selectedVariant}
                        onVariantSelection={this.onVariantSelection}
                        cartData={this.props.cartData}
                        product={product}
                        {...this.props}
                        updateQuantity={this.updateQuantity}
                        readOnly = {true}
                        state={this.state}
                    />
                        <OperationsBlock
                            {...this.props}
                            selectedVariant={selectedVariant}
                            updateQuantity={this.updateQuantity}
                            readOnly={true}
                            state={this.state}
                            onVariantSelection={this.onVariantSelection}
                        />
                    
                    {inCart.length > 0 && inCart[0].quantity >= MAX_LIMIT ? <div className="stock-left">Max limit is {MAX_LIMIT}</div>: "" }
                    {selectedVariant.availabilityCount < 1 &&
                        <React.Fragment>
                            <Link to={'/product/' + product.slug}>
                                <div className="out-of-stock">
                                    <span>Stock Out</span>
                                </div>
                            </Link>
                            {/* <div className="notify" onClick={() => this.notifyMe()}>Notify Me</div> */}
                            </React.Fragment>

                    }
                    {selectedVariant.availabilityCount < STOCK_LEFT && selectedVariant.availabilityCount > 0 && !this.state.maxQtyError &&
                        <i className="stock-left">Only {selectedVariant.availabilityCount} products left in stock!</i>
                    }
                </div>
            </div>
        );
    }
}
