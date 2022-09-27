import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import StickyBox from "react-sticky-box";
import { matchPath, Link } from 'react-router-dom';
import { routes } from '../../../universal/routes';
import ProductCard from '../../common/ProductCard'
import Spinner from '../../common/Spinner';
import NotFound from '../not-found';
import {isMobile} from 'react-device-detect';
import './Category.css';
import { SPINNER_TIME } from '../../../components/constants/constants';

export default class Category extends Component {
	state = {
		categories: {},
		showSpinner:false,
		// mblDevice : isMobile
		mblDevice : false
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
		window.scrollTo(0, 0);
		isMobile ? this.setState({ mblDevice: true }) : this.setState({ mblDevice: false })
		// console.log(this.props.match.params.slug)
	}
	
	componentDidUpdate(prevProps) {
		if (this.props.location !== prevProps.location) {
			this.props.getData(this.props.match)
			window.scrollTo(0, 0);
			this.setState({showSpinner:true}, ()=>{
				setTimeout(()=>{
					this.setState({showSpinner: false});
				}, SPINNER_TIME)
			});
		}
		if (this.props.selectedZone !== prevProps.selectedZone) {
			this.props.getData(this.props.match);
			this.setState({showSpinner:true}, ()=>{
				setTimeout(()=>{
					this.setState({showSpinner: false});
				}, SPINNER_TIME)
				
			});
			this.props.getCartData();			
		}
	}
	render() {
		const { data, cart, match } = this.props;
		const { showSpinner } = this.state;
		const CatData = data[match.params.slug];
		if (CatData && CatData.responseInfo.returnCode === '404') return <NotFound />;
		return (
			<React.Fragment>
				{CatData &&
				<Helmet>
					<title>{CatData.responseBody.responseData.catInfo.metaTitle} | HeyBandi</title>
					<meta name="description" content={CatData.responseBody.responseData.catInfo.metaDescription} />
				</Helmet>
				}
				<section className="product-sec">
					<div className="container">
						<div className="flxcls">
							<StickyBox
								offsetTop={70}
								offsetBottom={10}
								className="fix-wid row"
							>
								<div className="cat-block col-12">
									<div className="cats">
										<h5 className="mbl-hide cat-heading">Categories</h5>
										<hr className="mbl-hide" />
										<div className="cat-list">
											{this.props.categories.map(category => {
												 const filteredCategory = this.props.categories.filter(cat => cat.slug === this.props.location.pathname.split('/')[2]);
												return (
													<Link to={'/category/' + category.slug} id={category.id} className={this.state.mblDevice && filteredCategory[0].id === category.id ? "mbl-active-cat" : ""} >
														{this.state.mblDevice ?
															<img src={filteredCategory[0].id === category.id ? category.media[0].prefix + category.media[1].childern[0].imgUrl600 : category.media[0].prefix + category.media[2].childern[0].imgUrl600} />
															:
															<>
															<img src={category.media[3] && category.media[0].prefix + category.media[3].childern[0].imgUrl600} />
															<h3 className={ filteredCategory[0].id === category.id ? "active-cat" : ""}>{category.title}</h3>
															</>
														}
														{/* <img src={category.media[0].prefix + category.media[1].childern[0].imgUrl100}
																srcSet={`${category.media[3] && category.media[0].prefix + category.media[3].childern[0].imgUrl100} 1280w, ${filteredCategory[0].id === category.id ? category.media[0].prefix + category.media[1].childern[0].imgUrl100 : category.media[0].prefix + category.media[2].childern[0].imgUrl100} 980w`}
														/>
														<h3 className={ filteredCategory[0].id === category.id ? "active-cat" : ""}>{this.state.mblDevice ? "" :category.title}</h3> */}
													</Link>
												)
											})
											}
										</div>
									</div>
								</div>
							</StickyBox>

							<div className="products-row">
								{CatData && !showSpinner ?
								<div className="prd-row row">
									{CatData.responseBody.responseData.products.data.map((product, i) => {
										return (
											<div className="col-lg-4 col-md-4 col-6" index={i}>
												<ProductCard 
													index={i}
													prodInfo={product}
													updateCart={this.props.updateCart}
													cartData={cart.cartData}
												/>
											</div>
										)
									})}
								</div>
								:
									<Spinner isBlockLevel={true} />
								}
								{CatData && !showSpinner && CatData.responseBody.responseData.products.data.length == 0 ? <div className="no-prod-error-msg">No Products Found </div> : ""}
							</div>
						
						</div>
					</div>
				</section>
			</React.Fragment>
		);
	}
}

Category.propTypes = {
	data: PropTypes.shape({
		text: PropTypes.string
	}),
	getData: PropTypes.func.isRequired
};

Category.defaultProps = {
	data: null
};
