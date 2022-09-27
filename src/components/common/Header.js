import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import './Header.css';
import './App.scss';
import '../pages/login/SignIn.scss';
import Locations from './Locations';
import { Modal } from 'react-bootstrap';
import SingInRegister from '../pages/login/SingInRegister';
import Cart from '../pages/cart/index';
import service from '../../redux/actions/index';
import SearchAutocomplete from './SearchAutocomplete';

class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			signInModal: false,
			showMblMenu: false,
			isLocationModal: false,
			onlyPopup: false
		};
	}
	componentDidMount() {
		if (!this.props.data) this.props.getUserCommonData();
		// api call - token
	}

	componentDidUpdate = (prevProps) => {
		if (this.props.showLoginPopup !== prevProps.showLoginPopup) {
			this.setState({
				signInModal: this.props.showLoginPopup,
			})
		}
	}
	signInModalOpen = () => {
		this.props.toggleLoginPopup(true);
	}

	signInModalClose = () => {
		this.props.toggleLoginPopup(false);
	}
	closeMblMenu = () => {
		this.setState({showMblMenu: false});
	}
	openMblMenu = () => {
		this.setState({showMblMenu: true});
	}
	locationModal = () => {
		this.setState({ isLocationModal: true }, () => {
			console.log(this.state.isLocationModal)
		})
	}
	render() {
		const { signInModal } = this.state;
		const isLoginSuccess =  service.getCookieData('token');
		return (
			<React.Fragment>
				<header className="header-sec">
					<div className="container ">
						<div className="row">
							<div className="col-md-2 col-6">
								<Link to="/">
								<img src="https://images.heybandi.com/web_images/hb-new-logo.svg" className="logo" alt="HeyBandi Logo" />
									{/* <img src="/public/images/Logo.svg" className="logo" alt="HeyBandi Logo" /> */}
								</Link>
								{/* <div className="mobile-header-icons">
									{this.state.showMblMenu ?
									<img src="/public/images/menu-close.svg" onClick={this.closeMblMenu} />
									:
									<img src="/public/images/All Catagories.svg" onClick={this.openMblMenu} /> }

									<img src="/public/images/Notification.svg" />
								</div> */}
							</div>
							<div className="col-xl-6 col-lg-6 col-md-6 col-6">
								<div className="row middle-block">
									<div className="col-md-4 col-12 location">
											{/* <span className="location-icon crsr-pntr">
												<img src="/public/images/location-icon.svg" className="icon" />
											</span>
											{service.getCookieData('zone')}
											<span className="icon down-arrow-location crsr-pntr">
												<img src="/public/images/arrow-down-sign-to-navigate.svg" />
											</span> */}
										<Locations state={this.state}/>
										
									</div>
									{this.state.isLocationModal ? <Locations /> : ""}
									<div className="col-md-8 col-2 search-sec hide-mbl">
										<SearchAutocomplete />
									</div>
								</div>
							</div>
							<div className="col-md-4 hide-mbl">
								<div className="options">
									<span>
										<img src="/public/images/support-icon.svg" className="icon" alt="call" />
										+91 91544 17418
									</span>
									{!isLoginSuccess ?
										<button className="sign-in-btn" onClick={this.signInModalOpen}>
											<span>
												<img src="/public/images/user-icon.svg" />
											</span>Sign in
										</button> : <Link
											to={{
												pathname: "/profile"
											}} >
											<button className="sign-in-btn">
												<span>
													<img src="/public/images/user-icon.svg" />
												</span>
												My Account
											</button>
										</Link>
									}
								</div>
							</div>
						</div>
					</div>
				</header>
				<Cart />
				<div className="header-fixed-sec" />
				<section className="menu-sec hide-mbl">
					<div className="container">
						<div className="row">
							{/* <div className="cat-menu col-md-2">
								<span className="cat-menu-icon">
									<img src="/public/images/All Catagories.svg" />
								</span>
								All Categories
							</div>
							<div className="main-menu col-lg-8">
								<ul>
									<li><Link to="/">Home</Link></li>
									<li><Link to='/about'>About Us</Link></li>
									<li><Link to='/contact'>Contact Us</Link></li>
									<li><Link to='/checkout'>Checkout</Link></li>
									<li><Link to='/orders'>Orders</Link></li>
								</ul>
							</div>
							<div className="icons-block col-md-2">
								<span className="icon cart">
									<img src="/public/images/cart-icon.svg" />
									<i>3</i>
								</span>
								<span className="icon">
									<img src="/public/images/bell.svg" />
									<i>2</i>
								</span>
							</div> */}
							&nbsp;
						</div>
					</div>
				</section>

				{/* Sign in model */}
				<Modal id="signInModal"
					show={signInModal}
					onHide={this.signInModalClose}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Body>
						<div className="sign-in-content">
							<span className="close" onClick={this.signInModalClose}>
								<img src="/public/images/close.svg" />
							</span>
							<SingInRegister />
						</div>
					</Modal.Body>
				</Modal>
			</React.Fragment>
		);
	}
}

Header.propTypes = {
	selectedZone: PropTypes.shape({
		text: PropTypes.string
	}),
	getUserCommonData: PropTypes.func.isRequired
};

Header.defaultProps = {
	selectedZone: null,
	showLoginPopup: null,
};

const mapStateToProps = (state, ownProps) => {
	return {
		zones: state.util.zones,
		showLoginPopup: state.userLogin.showLoginPopup
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		toggleLoginPopup: service.toggleLoginPopup,
		getUserCommonData: service.getUserCommonData,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
