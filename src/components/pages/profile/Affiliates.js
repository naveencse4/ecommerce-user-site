import React, { Component } from 'react';
import { Fragment } from 'react';
import ProfileNav from './profileNav';
import './profile.scss';

class Affiliates extends Component {
    render() {
        const { location } = this.props;
        const itemToActive = location;
        return (
            <Fragment>
                <div id="profile-page">
                    <div className="profile-container container" >
                        <div className="row">
                            <ProfileNav itemToActive={itemToActive}/>
                            <div className="col-lg-6">
                                <section id="affiliateContainer" className="affiliate-container full-border">
                                    <h2>Affliate Dashboard</h2>
                                    <div className="row g-3 px-4 py-3">
                                        <div className="col-lg-4 col-6 afflicate-cnt">
                                            <div className="full-border text-center py-5 rounded grey-bg h-100">
                                                <img src="/public/images/user2.svg" />
                                                <h4>Total Users</h4>
                                                <b>20</b>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-6 afflicate-cnt">
                                            <div className="full-border text-center py-5 rounded grey-bg h-100">
                                                <img src="/public/images/shipping.svg" />
                                                <h4>Total Users</h4>
                                                <b>20</b>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-6 afflicate-cnt">
                                            <div className="full-border text-center py-5 rounded grey-bg h-100">
                                                <img src="/public/images/earnings.svg" />
                                                <h4>Total Users</h4>
                                                <b>20</b>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-6 afflicate-cnt">
                                            <div className="full-border text-center py-5 rounded grey-bg h-100">
                                                <img src="/public/images/money.svg" />
                                                <h4>Total Users</h4>
                                                <b>20</b>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-6 afflicate-cnt">
                                            <div className="full-border text-center py-5 rounded grey-bg h-100">
                                                <img src="/public/images/pay.svg" />
                                                <h4>Total Users</h4>
                                                <b>20</b>
                                            </div>
                                        </div>
                                        <div className="call-n-contact-btns flex">
                                            <button className="flex">
                                                <img src="/public/images/telephone.svg" />
                                                <span>
                                                    CONTACT US
                                                </span>
                                            </button>
                                            <button className="flex">
                                                <img src="/public/images/clock.svg" />
                                                <span>
                                                    EMAIL
                                                </span>
                                            </button>
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

export default Affiliates;