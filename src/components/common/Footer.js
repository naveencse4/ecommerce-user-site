import React, { Component } from 'react';
import { Link, withRouter  } from 'react-router-dom';
import './Footer.css';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Modal } from 'react-bootstrap';
import SearchAutocomplete from './SearchAutocomplete';
import service from '../../redux/actions/index';

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mblSearchModal: false,
            homeClicked: false,
            shopClicked: false,
            profileClicked: false,
            searchClicked: false,
        }
    }
    componentDidMount = () => {
        if (location.pathname === "/") {
            this.setState({homeClicked: true, profileClicked: false, shopClicked: false})
        }
        if (location.pathname === "/profile") {
            this.setState({profileClicked : true, shopClicked : false, homeClicked: false})
        }
        if (location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) === "/category/") {
            this.setState({shopClicked : true, homeClicked: false, profileClicked: false,})
        }
        if (service.getCookieData('token')) {
            this.props.checkList()
            .then(() => {
                if (this.props.checkListData.forceupdate) {
                    window.location.reload();
                } else {
                    service.setCookieData('token', this.props.checkListData.newToken);
                }
            })
        }
    }

    componentDidUpdate(prevProps) {
		if (this.props !== prevProps) {
			if (location.pathname === "/") {
                this.setState({homeClicked: true, profileClicked: false, shopClicked: false})
            }
            if (location.pathname === "/profile") {
                this.setState({profileClicked : true, shopClicked : false, homeClicked: false})
            }
            if (location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) === "/category/") {
                this.setState({shopClicked : true, homeClicked: false, profileClicked: false,})
            }
		}
		
	}

    openCart = () => {
        document.getElementById("cartSidenav").style.width = "310px";
        this.setState({homeClicked : false, shopClicked : false ,profileClicked : false,searchClicked: false})
        
	}
    searchOpen = () => {
        this.setState({searchClicked: true, profileClicked : false, shopClicked : false, homeClicked:false, mblSearchModal : true})
    }
    closeSearchModal = () => {
        this.setState({ mblSearchModal: false, searchClicked: false })
        if (location.pathname === "/") {
            this.setState({homeClicked: true})
        }
        if (location.pathname === "/profile") {
            this.setState({profileClicked : true})
        }
        if (location.pathname.substring(0, location.pathname.lastIndexOf("/") + 1) === "/category/") {
            this.setState({shopClicked : true})
        }
    }
    signInModalOpen = () => {
		this.props.toggleLoginPopup(true);
    }
    homeClicked = () => {
        this.setState({homeClicked : true, shopClicked : false ,profileClicked : false,searchClicked: false})
    }
    shopClicked = () => {
        this.setState({shopClicked : true, homeClicked:false,profileClicked : false,searchClicked: false})
    }
    profileClicked = () => {
        this.setState({profileClicked : true, shopClicked : false, homeClicked:false})
    }
    render() {
        const isLoginSuccess = service.getCookieData('token');
        return (
            <React.Fragment>
                {isLoginSuccess ?
                <div className="mbl-f-menu">
                    <Link to="/" onClick={this.homeClicked}>
                        <img src="/public/images/shop-transparent.svg" alt="shop" className={this.state.homeClicked ? "active-opt-img" : "opt-img"} />
                       <a className={this.state.homeClicked ? "active-opt-text" : "opt-text"}> Home </a>
                    </Link>
                    <Link to="/category/vegetables" onClick={this.shopClicked}>
                        <img src="/public/images/orders-transparent.svg" alt="orders"  className={this.state.shopClicked ? "active-opt-img" : "opt-img"} />
                        <a className={this.state.shopClicked ? "active-opt-text" : "opt-text"}> Shop </a>
                    </Link>
                    <Link to="/profile" onClick={this.profileClicked}>
                        <img src="/public/images/profile-transparent.svg" alt="user" className={this.state.profileClicked ? "active-opt-img" : "opt-img"} />
                        <a className={this.state.profileClicked ? "active-opt-text" : "opt-text"}>Profile</a>
                    </Link>
                    <Link to="#" onClick={this.searchOpen}>
                        <img src="/public/images/search-icon.svg" alt="search" className={this.state.searchClicked ? "active-opt-img" : "opt-img"}  />
                        <a className={this.state.searchClicked ? "active-opt-text" : "opt-text"}>Search</a>
                    </Link>
                    <Link to="#">
                        <span className="m-f-cart" onClick={this.openCart}>
                            <img src="/public/images/cart-icon.svg" alt="cart" />
                            <i>{this.props.cartData.length}</i>
                        </span>
                        Cart
                    </Link>
                </div>
                :
                <div className="mbl-f-menu">
                    <Link to="/" onClick={this.homeClicked}>
                        <img src="/public/images/home-transparent.svg" alt="Home" className={this.state.homeClicked ? "active-opt-img" : "opt-img"}/>
                        Home
                    </Link>
                    <Link to="/category/vegetables" onClick={this.shopClicked}>
                            <img src="/public/images/shop-transparent.svg" alt="shop" className={this.state.shopClicked ? "active-opt-img" : "opt-img"}/>
                        Shop
                    </Link>                    
                    <Link to="#" onClick={this.signInModalOpen}>
                        <img src="/public/images/user-icon.svg" alt="login" className="opt-img" />
                        Login
                    </Link>
                    <Link to="#" onClick={this.searchOpen}>
                        <img src="/public/images/search-icon.svg" alt="search" className={this.state.searchClicked ? "active-opt-img" : "opt-img"}  />
                        Search
                    </Link>
                </div>
                }
                <footer className="hide-mbl">
                    <div className="container">
                        <div className="row">
                            <a className="b-logo col-lg-2 col-md-2">
                                {/* <img src="https://images.heybandi.com/web_images/hb-new-logo.svg" alt="HeyBandi Logo" /> */}
                                <img src="/public/images/hb-logo-white.svg" alt="HeyBandi Logo"/>
                            </a>
                            <div className="f-menu col-lg-8 col-md-8">
                                <h6>Useful Links</h6>
                                <ul>
                                    <li><Link to='/'>Home</Link></li>
                                    <li><Link to='/about' >About</Link></li>
                                    <li><Link to='/refund'>Refund</Link></li>
                                    <li><Link to='/terms'>Terms</Link></li>
                                    <li><Link to='/privacy'>Privacy</Link></li>
                                    {/* <li><Link to='' onClick={
                                        ()=> window.open("https://play.google.com/store/apps/details?id=com.heybandi.user", '_blank')
                                    }>Download Now</Link></li> */}
                                </ul>
                            </div>
                            <div className="col-lg-2">
                                <div className="download-block float-right">
                                    <h6>Download App</h6>
                                    <Link to=''><img onClick={
                                        ()=> window.open("https://play.google.com/store/apps/details?id=com.heybandi.user", '_blank')
                                    } src="/public/images/download-app-andriod.svg" alt="Download Andriod App" /></Link>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="copyrights col-lg-6 col-12">
                                <p>Copyright &copy; 2022 - Heybandi</p>
                            </div>
                            <div className="t-menu col-lg-6 col-12">
                                <ul className="float-right">
                                    <li><Link to='/privacy' >Privacy Policy</Link></li>
                                    <li><Link to='/terms'>Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </footer>
                <Modal className="mbl-search-modal"
					show={this.state.mblSearchModal}
					onHide={this.closeSearchModal}
					// size="lg"
					// aria-labelledby="contained-modal-title-vcenter"
					// centered
				>
					<Modal.Body>
                        <SearchAutocomplete closeSearchModal={this.closeSearchModal} autoFocusEnable={true} />
					</Modal.Body>
				</Modal>
            </React.Fragment>
        );
    }  
}
const mapStateToProps = (state, ownProps) => {
    return {
        checkListData: state.userLogin.checkList,
        cartData: state.cart.cartData,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        toggleLoginPopup: service.toggleLoginPopup,
        checkList: service.checkList,
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, 
    mapDispatchToProps
)(Footer));
