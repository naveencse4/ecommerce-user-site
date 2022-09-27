import React, { Component } from 'react';
import { Fragment } from 'react';
import ProfileNav from './profileNav';
import './profile.scss';

class DashBoard extends Component {
    render() {
        const { location } = this.props;
        const itemToActive = location;
        return (
            <Fragment>
                <div id="profile-page">
                    <div className="profile-container container" >
                        <div className="row">
                            <ProfileNav itemToActive={itemToActive} />
                            <div className="col-lg-6">
                                <section id="dashBoardContainer" className="dashboard-container full-border">
                                    <h2>Overview</h2>
                                    <div className="user-details">
                                        Hi! &nbsp; Jhone Doe
                                        <small>+91 9876543210
                                            <span>jhondoe@gmail.com</span>
                                        </small>
                                    </div>
                                    <hr />
                                    <div className="d-orders-block d-block full-border">
                                        <b>My Orders</b>
                                        <hr />
                                        <div className="d-order-details">
                                            <div className="d-t-orders">Total Orders : 16</div>
                                            <div className="r-purchase">4 Recent Purchases</div>
                                            <div className="r-p-items flex justify-content-between">
                                                <span className="details flex justify-content-between">
                                                    <span>4 Items</span>
                                                    <span className="inprogress">Inprogress</span>
                                                    <span>Rs.2550</span>
                                                </span>
                                                <span className="view-all pointer">
                                                    All Orders &gt;&gt;
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-affiliate-block d-block full-border">
                                        <b>Affliates</b>
                                        <hr />
                                        <div className="row g-3">
                                            <div className="col-lg-3 col-4">
                                                <div className="d-aff full-border text-center rounded py-4 grey-bg h-100">
                                                    <img src="/public/images/user2.svg" />
                                                    <h4>Total Users</h4>
                                                    <b>20</b>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-4">
                                                <div className="d-aff full-border text-center rounded py-4 grey-bg h-100">
                                                    <img src="/public/images/shipping.svg" />
                                                    <h4>Total Users</h4>
                                                    <b>20</b>
                                                </div>
                                            </div>
                                            <div className="col-lg-3 col-4">
                                                <div className="d-aff full-border text-center rounded py-4 grey-bg h-100">
                                                    <img src="/public/images/earnings.svg" />
                                                    <h4>Total Users</h4>
                                                    <b>20</b>
                                                </div>
                                            </div>
                                            <div className="aff-dtls col-lg-3 col-12 pointer">
                                                Affliates &amp; details &gt;&gt;
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div></div>
            </Fragment>
        );
    }
}

export default DashBoard;