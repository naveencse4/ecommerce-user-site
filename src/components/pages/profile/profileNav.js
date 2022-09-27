import React, { Component } from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import service from '../../../redux/actions/index';

class ProfileNav extends Component {
    state = {
        profileClicked: false,
        ordersClicked: false,
        logoutClicked: false
    }

    logoutPage = (e) => {
        // console.log(this.props.itemToActive)
        var answer = window.confirm("Log out?");
        if (answer) {
            service.deleteCookieData('token');
            this.props.history.push('/');
        }
        else {
          e.preventDefault()
          alert.dismiss()
            //return false
            //some code
        }
    }

    componentDidMount = () => {
        if (location.pathname === "/profile") {
            this.profileClicked()
        }
        if (location.pathname === "/orders") {
            this.ordersClicked()
        }
    }
    profileClicked = () => {
        this.setState({profileClicked : true, ordersClicked: false,
            logoutClicked: false})
    }
    ordersClicked = () => {
        this.setState({profileClicked : false, ordersClicked: true,
            logoutClicked: false})
    }
    logoutClicked = () => {
        this.setState({profileClicked : false, ordersClicked: false,
            logoutClicked: false})
    }
    render() {
        const { itemToActive } = this.props;
        return (
            <Fragment>
                <div className="side-options account-options col-lg-2" >
                    <ul id="scrollFixed" className="full-border">
                        {/* <Link to={{ pathname: "/dashboard" }} >
                            <li className={itemToActive.pathname === "/dashboard" ? "item-active" : ""}>  <span>
                                <img src="/public/images/Dashboard.svg" />
                            </span>
                                Dashboard</li>
                        </Link> */}
                        {/* <Link to={{ pathname: "/profile" }} >
                            <li className={itemToActive.pathname === "/profile" ? "item-active" : ""} >
                                <span>
                                    <img src="/public/images/user.svg" />
                                </span>  Profile  </li>
                        </Link> */}
                         <Link to={{ pathname: "/profile" }} onClick={this.profileClicked}>
                            <li className={this.state.profileClicked ? "item-active" : ""} >
                                <span>
                                    <img src="/public/images/user.svg" />
                                </span>  Profile  </li>
                        </Link>
                        <Link to={{ pathname: "/orders" }} onClick={this.ordersClicked}>
                            <li className={this.state.ordersClicked ? "item-active" : ""}>
                                <span>
                                    <img src="/public/images/Orders-transparent.svg" />
                                </span>  My Orders  </li></Link>
                        {/* <Link to={{ pathname: "/affiliates" }}
                        >
                            <li className={itemToActive.pathname === "/affiliates" ? "item-active" : ""}>
                                <span>
                                    <img src="/public/images/Affliate.svg" />
                                </span> Affiliates </li>
                        </Link> */}
                        <Link to="#" onClick={this.logoutPage}>
                            <li id="LogOut" className={this.state.logoutClicked ? "logout-clicked" : ""}>
                                <span>
                                    <img src="/public/images/Logout.svg" />
                                </span>
                                Logout
                            </li>
                        </Link>
                    </ul>
                </div>
            </Fragment>
        );
    }
}

export default ProfileNav;
