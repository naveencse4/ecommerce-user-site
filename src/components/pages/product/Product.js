import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { matchPath } from 'react-router-dom';
import { routes } from '../../../universal/routes';
import { METRIC_TYPES, STOCK_LEFT, MAX_LIMIT } from '../../constants/constants';
import SelectBox from '../../common/SelectDropdown';
import RenderHtml from '../../common/RenderHtml';
import Spinner from '../../common/Spinner';
import NotFound from '../not-found';
import OperationsBlock from '../../common/OperationsBlock';
import { getFilteredVariants } from "../../constants/StaticConstants";
import './Product.scss';

export default class Product extends Component {
	constructor(props) {
		super(props);
		const { data, match } = this.props;
		const ProdData = data[match.params.slug];
		let prodInfo = {};
		let varientsInfo = [];
		if (ProdData) {
			prodInfo = ProdData.responseBody.responseData;
			varientsInfo = getFilteredVariants(prodInfo.productVarients).map(variant => {
				return Object.assign(variant, { quantity: 1 });
			});
		}
		
		this.state = {
			selectedVariant: varientsInfo.length > 0 ? varientsInfo[0]:[],
			varients: varientsInfo,
			product: prodInfo,
			isSelected: false,
			showDecSpinner: false,
            showIncSpinner: false,
			showDelSpinner: false,
			product: {}, 
			image: "",
			maxQtyError: false,
		};
	}
	static loadData(req) {
		function getRouteData() {
			let matchingRoute = routes.find(route => {
				return matchPath(req.path, route);
			});
			return matchPath(req.path, matchingRoute);
		}
		return getRouteData();
	}

	componentDidMount() {
		if (!this.props.data[this.props.match.params.slug]) {
			this.props.getData(this.props.match);
		}
		this.updateInitialState();
		window.scrollTo(0, 0);
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.props.getData(this.props.match);
		}
		if (this.props.selectedZone !== prevProps.selectedZone) {
			this.props.getData(this.props.match);
			this.props.getCartData();
		}
		if (this.props !== prevProps) {
            this.updateInitialState();
		}
	}

	updateInitialState = () => {
        const { data, match } = this.props;
		const ProdData = data[match.params.slug];
		if (ProdData) {
			const product = ProdData.responseBody.responseData;
			const varients = getFilteredVariants(product.productVarients).map(variant => {
				return Object.assign(variant, { quantity: 1 });
			});
			const selectedVariant = this.state.isSelected ? this.state.selectedVariant : varients[0];
			selectedVariant.quantity = 1;
			this.setState({
				showDecSpinner: false,
				showIncSpinner: false, 
				showDelSpinner: false, 
				product , 
				varients: varients,
				selectedVariant: selectedVariant
			});
		}
    }

    onVariantSelection = (variant) => {
        const currentState = { ...this.state };
        currentState.selectedVariant = variant;
        currentState.isSelected = true;
		this.setState(currentState)
    }

	metricChange = (metric) => {
		const v = METRIC_TYPES.filter(met => { return met.value === metric; });
		return v.length > 0 ? v[0].label : metric;
	}

	imageOnClick = (image) => {
		this.setState({ image: image })
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
		const { data, cart, match } = this.props;
		const ProdData = data[match.params.slug];
		
		if (!ProdData) 
			return <section className="prdct-sngl-pg-cntr container"><Spinner isFullPage={true} /></section>;

		const product = ProdData.responseBody.responseData;
		if (!product.productVarients || product.productVarients.length < 1) {
			return <NotFound />;
		}
		
        const selectedVariant = this.state.selectedVariant;
		let inCart = [];
		if (cart) {
			inCart = cart.cartData.filter(variant => {
				return variant.varientId === selectedVariant.id
			});
		}
		let stImage = this.state.image;
		if (stImage === '') {
			stImage = product.masterProductMedia[0];
		}
		
		return (
			<React.Fragment>
				<Helmet>
					<title>{product.productName} | HeyBandi</title>
					<meta name="description" content={product.productName} />
				</Helmet>
				
				<section className="prdct-sngl-pg-cntr container">
					<div className="row gx-4">
						<div className="img-block col-lg-6">
							<ul className="thumbnails">
								{product.masterProductMedia.map((image, i) => {
									return <li className="thumbnail-img" key={i}>
										<img src={image.prefix + image.childern[0].imgUrl200} onClick={() => this.imageOnClick(image)}/>
									</li>
								})}
							</ul>
							<span className="main-img">
								<img id="currentImg" src={stImage.prefix + stImage.childern[0].url}
									alt={product.title} />
							</span>
						</div>
						<div className="info col-lg-6 col-12">
							<div className="mbl-mv-up">
								<div className="scrollfixed">
									<h1 className="sngl-pg-prd-title">{selectedVariant.productFullTitle}</h1>
									<div className="metric-scroll-fixed">
										<SelectBox varaints={product.productVarients} selectedVariant={selectedVariant} />
									</div>
									<button className="metric-scroll-fixed">ADD<span className="add-cart-icon">
										<img src="/public/images/Shopping-cart-transparent.svg" />
									</span>
									</button>
								</div>
								<div className={selectedVariant.availabilityCount > 0 ? "availability": "not-available" }>Available :<span> {selectedVariant.availabilityCount > 0 ? "In Stock" : "Out of Stock"} </span></div>
								<div className="rupess">Rs. {selectedVariant.specialOfferPrice}</div>
							</div>
							
								<OperationsBlock
									{...this.props}
									selectedVariant={selectedVariant}
									updateQuantity={this.updateQuantity}
									readOnly={false}
									onVariantSelection={this.onVariantSelection}
								/>
								
							{inCart.length > 0 && inCart[0].quantity >= MAX_LIMIT ? <div className="max-limit">Max limit is {MAX_LIMIT}</div>: "" }

							{selectedVariant.availabilityCount < STOCK_LEFT && selectedVariant.availabilityCount > 0 &&
								<i className="stock-left">Only {selectedVariant.availabilityCount} products left in stock!</i>
							}

							<ul className="pack-size"> Pack Sizes
								{product.productVarients.map((prodVar, j) => {
									return (
										<li onClick={(e) => this.onVariantSelection(prodVar)}
											className={prodVar.availabilityCount <= 0 ? "disable" : selectedVariant.id === prodVar.id && selectedVariant.availabilityCount > 0 ? "sngl-pg-metric selected-metric" : selectedVariant.id === prodVar.id && selectedVariant.availabilityCount <= 0  ? "sngl-pg-metric disable" : "sngl-pg-metric"} key={j} >	
												{prodVar.metricValue} {this.metricChange(prodVar.metricType)} - Rs.{prodVar.specialOfferPrice}/- 
										</li>
									)
								})}
							</ul>
							<hr />
							<h6 className="prod-dtls">
								Product Details
							</h6>
							<div className="prod-desc">
								<RenderHtml html={product.description} />
							</div>
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

Product.propTypes = {
	data: PropTypes.shape({
		text: PropTypes.object
	}),
	getData: PropTypes.func.isRequired,
	getCartData: PropTypes.func.isRequired,
};

Product.defaultProps = {
	data: null
};


