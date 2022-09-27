import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Link, matchPath } from 'react-router-dom';
import { Helmet } from "react-helmet";
import { routes } from '../../../universal/routes';
import ProductCard from '../../common/ProductCard'
import './Home.css';
import StaticConstants from "../../constants/StaticConstants";
import { isMobile } from 'react-device-detect';
import { HOME_IMG_PREFIX } from '../../../env';
import Spinner from '../../common/Spinner';
import { SPINNER_TIME } from '../../../components/constants/constants';
export default class Home extends Component {
	constructor(props) {
        super(props);
        this.state = {
			curatedProducts: "",
			ordersBanner: "",
			deliveryBanner: "",
			valueforMnyBanner: "",
			showSpinner:false,
        }
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
		try{
			if (StaticConstants.loadHomePage===true){
				window.location.reload();
				StaticConstants.loadHomePage = false
			}
		}catch (e) {
			console.log(e)
		}

		if (!this.props.data) this.props.getData();
		// this.props.getData();
		window.scrollTo(0, 0);
		this.getVideos();
		isMobile ?
			this.setState({
				curatedProducts: HOME_IMG_PREFIX + "home_page/home_image5.jpg",
				ordersBanner: HOME_IMG_PREFIX + "home_page/home_image6.jpg",
				deliveryBanner: HOME_IMG_PREFIX + "home_page/home_image7.jpg",
				valueforMnyBanner: HOME_IMG_PREFIX + "home_page/home_image8.jpg",
			})
			:
			this.setState({
				curatedProducts: HOME_IMG_PREFIX + "home_page/home_image1.jpg",
				ordersBanner: HOME_IMG_PREFIX + "home_page/home_image2.jpg",
				deliveryBanner: HOME_IMG_PREFIX + "home_page/home_image3.jpg",
				valueforMnyBanner: HOME_IMG_PREFIX + "home_page/home_image4.jpg",
			})
	}

	componentDidUpdate(prevProps) {
		if (this.props.selectedZone !== prevProps.selectedZone) {
			this.props.getData(this.props.match);
			this.props.getCartData();
			this.setState({showSpinner:true}, ()=>{
				setTimeout(()=>{
					this.setState({showSpinner: false});
				}, SPINNER_TIME)
				
			});
			window.scrollTo(0, 0);
		}
	}

	getLevelBanners = (data) => {

		var newData = []

		var ind = 0
		for (let i =0;i<data.length;i++){
			var x = data[i]

			if (x.status==='ACTIVE'&&x.isPopup===false&&x.displayLevel==='LEVEL_1'){
				newData[ind] = x
				ind++
			}
		}
		if(StaticConstants.loadHomePage===true){
						//window.scrollTo(0, 0)
						StaticConstants.loadHomePage = false
		}
		return newData
	}

	// getPopUpBanner = (data) => {
	// 	var newData = []
	// 	var ind = 0
	// 	for (let i =0;i<data.length;i++){
	// 		var x = data[i]

	// 		if (x.status==='ACTIVE'&&x.isPopup===true){
	// 			newData[ind] = x
	// 			ind++
	// 		}
	// 	}
	// 	if(StaticConstants.loadHomePage===true){
	// 					//window.scrollTo(0, 0)
	// 					StaticConstants.loadHomePage = false
	// 		}
	// 	return newData
	// }
	


	createIframe = (v, id) => {
		var iframe = document.createElement("iframe");
		iframe.setAttribute(
			"src",
			"//www.youtube.com/embed/" +
				id +
				"?autoplay=1&color=white&autohide=2&modestbranding=1&border=0&wmode=opaque&enablejsapi=1&showinfo=0&rel=0"
		);
		iframe.setAttribute("frameborder", "0");
		iframe.setAttribute("class", "youtube-iframe");
		v.firstChild.replaceWith(iframe);
	}
 getVideos = () => {
	 var v = document.getElementsByClassName("youtube-player");
	 var _this = this
    for (var n = 0; n < v.length; n++) {
        var p = document.createElement("div");
        var id = v[n].getAttribute("data-id");

        var placeholder = v[n].hasAttribute("data-thumbnail")
            ? v[n].getAttribute("data-thumbnail")
            : "";

        if (placeholder.length) p.innerHTML = this.createCustomThumbail(placeholder);
        else p.innerHTML = this.createThumbail(id);

        v[n].appendChild(p);
        p.addEventListener("click", function () {
            var parent = this.parentNode;
            _this.createIframe(parent, parent.getAttribute("data-id"));
        });
    }
}

 createCustomThumbail = (url) => {
    return (
        '<img class="youtube-thumbnail" src="' +
        url +
        '" alt="Youtube Preview" /><div class="youtube-play-btn"></div>'
    );
}

createThumbail = (id) => {
    return (
        '<img class="youtube-thumbnail" src="//i.ytimg.com/vi_webp/' +
        id +
        '/maxresdefault.webp" alt="Youtube Preview"><div class="youtube-play-btn"></div>'
    );
}


	render() {
		const { data, cart } = this.props;
		const { showSpinner } = this.state;
		return (
			<React.Fragment>
				<Helmet>
					<title>HeyBandi | Fresh & Pure</title>
				</Helmet>
				{showSpinner ? <section className="home-page-container"><Spinner isFullPage={true} /> </section>:
					<>
						<section className="slider-sec">
							<div className="container">
								<Carousel nextIcon="" nextLabel="" prevIcon="" prevLabel="" interval={null}>
									{data && this.getLevelBanners(data.responseBody.responseData.banners.data).map((slider, k) => {
										
										const filteredCategory = this.props.categories.filter(cat => cat.id === slider.itemId);
										return (
											<Carousel.Item key={k}>
												{slider.mediaType === "VIDEO" ?
													<>	
														<div class="youtube-container">
															<div class="youtube-player" data-id={slider.media[0].videoId} data-thumbnail={slider.media[0].prefix + slider.media[0].childern[0].url}></div>
														</div>
													</>
													:
													<Link to={slider.itemType === "Category" && filteredCategory.length > 0 ? '/category/' + filteredCategory[0].slug : ""}>
													<img
														className="d-block w-100"
														src={slider.media[0].prefix + slider.media[0].childern[0].url}
														alt={slider.title}
													/>
													 </Link>
												}
											</Carousel.Item>
										);
									})}
								</Carousel>
								{/* {data && this.getPopUpBanner(data.responseBody.responseData.banners.data).map( (slider,k) => {
							return (
									
								)
							})} */}
							</div>
						</section>
						<section className="features-sec">
							<div className="container">
								<div className="row features-row">
									<div className="features col-lg-3 col-6">
										<div className="feature-box">
											<img src={this.state.curatedProducts} />
											{/* <img src={IMG_One} /> */}
										</div>
									</div>
									<div className="features col-lg-3 col-6">
										<div className="feature-box">
											<img src={this.state.ordersBanner} />
											{/* <img src={IMG_Two} /> */}
										</div>
									</div>
									<div className="features col-lg-3 col-6">
										<div className="feature-box">
											<img src={this.state.deliveryBanner} />
											{/* <img src={IMG_Three} /> */}
										</div>
									</div>
									<div className="features col-lg-3 col-6">
										<div className="feature-box">
											<img src={this.state.valueforMnyBanner} />
											{/* <img src={IMG_Four} /> */}
										</div>
									</div>
								</div>
							</div>
						</section>
						<section className="bg-color">
							<section className="category-sec">
								<div className="container">
									<div className="category-header f-ac flex">
										<h3 className="category-heading l-grey fw-700">Shop by Category</h3>
										{/* <span className="cat-line"></span>
											<div className="cat-arrows">
												<img className="img-fluid" src="/public/images/arrow left.svg" />
												<img className="img-fluid" src="/public/images/arrow right.svg" />
											</div> */}
									</div>
									<div className="categories row gx-2">
										{this.props.categories.map(category => {
											return (
												<div className="cat-img col-xl-2 col-lg-2 col-md-2 col-4">
													<Link to={'/category/' + category.slug}>
														<img
															src={category.media[0].prefix + category.media[0].childern[0].url}
															srcSet={`${category.media[0].prefix + category.media[0].childern[0].imgUrl600} 980w, ${category.media[0].prefix + category.media[0].childern[0].imgUrl600} 1280w`}
															alt={category.title}
															className="full-border"
														/>
													</Link>
												</div>
											)
										})}
									</div>
								</div>
							</section>
							<section className="Products-sec">
								<div className="container">
									{data && data.responseBody.responseData.homePageProducts.map((tag, i) => {
										return (<React.Fragment>
											<div className="row tag-sec">
												<div className="col-md-12">
													<h3 className="fw-700">{tag.title}</h3>
												</div>
											</div>
											<div className="product-row row">
												{tag.masterProducts.map((product, i) => {
													return (
														i < 4 && <div className="col-lg-3 col-md-3 col-6" index={i}>
															<ProductCard
																prodInfo={product}
																index={i}
																updateCart={this.props.updateCart}
																cartData={cart.cartData}
															/></div>
													);
												})}
											</div>
										</React.Fragment>);
									})}
								</div>
							</section>
						</section>
					</>
				}
			</React.Fragment>
		);
	}
}

Home.propTypes = {
	data: PropTypes.shape({
		text: PropTypes.string
	}),
	getData: PropTypes.func.isRequired,
};

Home.defaultProps = {
	data: null
};
