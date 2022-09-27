import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import { routes } from '../../../universal/routes';
import ProfileNav from '../profile/profileNav';
import './Orders.scss';
import './OrdersList.scss';
import '../profile/profile.scss';
import service from '../../../redux/actions/index';
import Spinner from '../../common/Spinner';
import { matchPath, Link } from 'react-router-dom';
import {  HOME_IMG_PREFIX } from '../../../env'
class Order extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // orderData: this.props.location.data.orderData
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
        if (!this.props.orderData[this.props.match.params.slug]) {
            this.props.getOrderData(this.props.match);
        }
        window.scrollTo(0, 0);
        // <section id="order_details_page"><Spinner isFullPage={true} /></section>;
    }
    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.props.getOrderData(this.props.match);
        }
    }
    renderOderStatus = () => {
        const { orderData } = this.props;
        switch (orderData.status) {
            case 'PLACED':
                return <img src={HOME_IMG_PREFIX + "order_tracking/placed.png"} alt="order-confirmed" />;
            case 'PACKED':
                return <img src={HOME_IMG_PREFIX + "order_tracking/packed.png"} alt="order-confirmed" />;
            case 'PICKED':
                return <img src={HOME_IMG_PREFIX + "order_tracking/picked.png"} alt="order-confirmed" />;
            case 'DELIVERED':
                return <img src={HOME_IMG_PREFIX + "order_tracking/delivered.png"} alt="order-confirmed" />;
            // case 'PARTIALLY':
            //     return "some time Delivered";
            // case 'CANCEL':
            //     return <span className="o-status">
            //         <img src="/public/images/order-cancel.svg" alt="order-cancel" />
            //         Cancelled
            //     </span>;
            default:
                return null;
        }
    }

    render() {

        const { orderData } = this.props;
        if (orderData && Object.keys(orderData).length === 0)
            return <section id="order_details_page"><Spinner isFullPage={true} /></section>;
        const singleOrderObj = orderData.orderDetails;
        const filterGroceries = Object.values(singleOrderObj).filter(item => item.isVeg === false);
        const filterVeg = Object.values(singleOrderObj).filter(item => item.isVeg === true);
        const totalGroceries = filterGroceries.reduce((sum, item) => sum + parseInt(item.quantity * item.offerPricePerUnit), 0);
        const totalVeg = filterVeg.reduce((sum, item) => sum + parseInt(item.quantity * item.offerPricePerUnit), 0);
        const totalOrderValue = totalGroceries + totalVeg;
        var createdAtDate = new Date(orderData.createdAt);
        var vegdate = new Date(orderData.expectedDelivery.vegDeliveryDate);
        var groceryDate = new Date(orderData.expectedDelivery.date);

        function dateTOAMORPM(currentDateTime) {
            var d = new Date(currentDateTime);
            var tdate = new Date(d);
            var hrs = tdate.getHours();
            var mnts = tdate.getMinutes();
            var AMPM = hrs >= 12 ? 'PM' : 'AM';
            hrs = hrs % 12;
            hrs = hrs ? hrs : 12;
            mnts = mnts < 10 ? '0' + mnts : mnts;
            var result = hrs + ':' + mnts + ' ' + AMPM;
            return result;
        }

        function dateString(myDate) {
            var today = new Date(myDate);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            let monthName = monthNames[today.getMonth()];
            var dateStr = (today.getDate() + " " + monthName + " " + today.getFullYear());
            return dateStr;
        }
        return (
            <React.Fragment>
                <Helmet>
                    <title>My Orders | HeyBandi</title>
                </Helmet>
                <div id="order_details_page">
                    <div className="profile-container container">
                        <div className="row">
                        <ProfileNav itemToActive="" />
                            <div className="col-lg-7">
                                <section id="paymentSuccess" className="myorders-container">
                                    {this.props.location.search.length > 0 &&
                                        <div className="order-placed-banner">
                                            <img src="/public/images/checked.svg" />
                                            <div className="o-banner-txt">Order Placed Succesfully</div>
                                            <span>Order number : HB#{orderData.displayOrderId}. Thank you for Shopping</span>
                                        </div>
                                    }
                                    <div className="order-details full-border">
                                        <div className="order-date-n-repeat flex">
                                            <span className="order-date">
                                                Order No: HB#{orderData.displayOrderId}
                                                <br />
                                                <small>Placed On : {dateString(createdAtDate) + ", at " + dateTOAMORPM(createdAtDate)}</small>
                                            </span>
                                            {orderData.pdfPath ?
                                                <div className="download-invoice">
                                                    <a href={orderData.pdfPath} target="_blank" download>
                                                        <img src="/public/images/Invoice@2x.png" />
                                                        Download Invoice</a>
                                                </div>
                                                :
                                                ""
                                            }
                                        </div>
                                        <div className="payment-otp">
                                            <span className="payment-n-amount">
                                                <img src="/public/images/ticked.svg" />
                                                &nbsp;
                                                {orderData.paymentStatus === "SUCCESS" ? "Payment Successful" : "Payment Pending"}
                                                <br />
                                                <small>
                                                    Amount : <b>Rs. {parseFloat(orderData.orderValue).toFixed(2)}</b> <span>{orderData.paymentType}</span>
                                                </small>
                                            </span>
                                            <span className="otp">
                                                (OTP -{orderData.otp})
                                            </span>
                                            <hr />
                                        </div>
                                        <div className="address flex b-bottom">
                                            <img src="/public/images/location-icon.svg" />
                                            <span>
                                                Delivery Address
                                                <br />
                                                <small>
                                                    {orderData.deliveryType === "SELF" ? "" :
                                                        <>
                                                            {orderData.userAddress !== null ?
                                                                <>
                                                                    {orderData.userAddress.addressLine1},
                                                                    {orderData.userAddress.addressLine2},
                                                                    {orderData.userAddress.addressLine3},
                                                                    {orderData.userAddress.localArea}
                                                                </>
                                                                :
                                                                ""
                                                            }
                                                        </>
                                                    }
                                                </small>
                                            </span>
                                            <hr />
                                        </div>
                                        {filterGroceries.length !== 0 && filterGroceries ?
                                            <div className="groceries">
                                                <h5>Product Details</h5>
                                                <div className="orderTable row py-3 b-bottom">
                                                    <div className="col-lg-6 col-8 ">
                                                        Product
                                                    </div>
                                                    <div className="col-lg-2 hide-mbl">
                                                        Price
                                                    </div>
                                                    <div className="col-lg-1 col-1">
                                                        Qty
                                                    </div>
                                                    <div className="col-lg-3 text-right col-3">
                                                        Subtotal
                                                    </div>
                                                </div>
                                                {
                                                    filterGroceries.map((item, index) => {
                                                        return (
                                                            <div className="productsTable b-bottom row py-3 flex f-ac">
                                                                <div className="flex f-ac col-lg-6 col-8 ">
                                                                    <span>
                                                                        <img src={item.productId.productMedia[0].prefix + item.productId.productMedia[0].childern[0].url} />
                                                                    </span>
                                                                    <span className="product-title fw-500">
                                                                        {item.productId.productFullTitle}
                                                                        <br />
                                                                        <span className="mbl-price disable-color">
                                                                            {parseFloat(item.productId.maxPrice).toFixed(2)}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className="disable-color col-lg-2 hide-mbl">
                                                                    {parseFloat(item.offerPricePerUnit).toFixed(2)}
                                                                </div>
                                                                <div className="disable-color col-lg-1 col-1">
                                                                    {item.quantity}
                                                                </div>
                                                                <div className="col-lg-3 col-3 text-right fw-500">
                                                                    {parseFloat(item.quantity * item.offerPricePerUnit).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <div className="productsTotal b-bottom row py-4 flex f-ac">
                                                    <div className="t-amount col-lg-6 col-6">
                                                        Total Amount
                                                    </div>
                                                    <div className="t-rupees col-lg-6 col-6 text-right">
                                                        Rs.  {parseFloat(totalGroceries).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="grocery-delivery">
                                                    <img src="/public/images/calender.svg" />
                                                    <span>
                                                        <small>Delivery Time</small>
                                                        <br />
                                                        {orderData.deliverySlot ? dateString(groceryDate) + " , " + orderData.deliverySlot.slot.startTime + " - " + orderData.deliverySlot.slot.endTime : dateString(groceryDate)}
                                                    </span>
                                                </div>
                                                
                                                {orderData.notes &&
                                                    <div className="delivery-instructions-display">
                                                        <span>Delivery Instructions : </span>
                                                        {orderData.notes}
                                                    </div>
                                                }
                                                <div className="order-status-img">
                                                    {this.renderOderStatus()}
                                                </div>
                                            </div>
                                            : ""}
                                        {/* DO NOT DELETE - VEG AND GROC DELIVERY DATES*/}
                                        {/* {filterVeg.length !== 0 && filterVeg ?
                                            <div className="groceries">
                                                <h5>Veggies Details</h5>
                                                <div className="orderTable row py-3 b-bottom">
                                                    <div className="col-lg-6 col-8">
                                                        Product
                                                    </div>
                                                    <div className="col-lg-2 hide-mbl">
                                                        Price
                                                    </div>
                                                    <div className="col-lg-1 col-1">
                                                        Qty
                                                    </div>
                                                    <div className="col-lg-3 col-3 text-right">
                                                        Subtotal
                                                    </div>
                                                </div>
                                                {
                                                    filterVeg.map((item, index) => {
                                                        return (
                                                            <div className="productsTable b-bottom row py-3 flex f-ac">
                                                                <div className="flex f-ac col-lg-6 col-8">
                                                                    <span>
                                                                        <img src={item.productId.productMedia[0].prefix + item.productId.productMedia[0].childern[0].url} />
                                                                    </span>
                                                                    <span>
                                                                        {item.productId.productFullTitle}
                                                                        <br />
                                                                        <span className="mbl-price disable-color">
                                                                            {parseFloat(item.productId.maxPrice).toFixed(2)}
                                                                        </span>
                                                                    </span>
                                                                </div>
                                                                <div className="disable-color col-lg-2 hide-mbl">
                                                                    {parseFloat(item.offerPricePerUnit).toFixed(2)}
                                                                </div>
                                                                <div className="disable-color col-lg-1 col-1">
                                                                    {item.quantity}
                                                                </div>
                                                                <div className="col-lg-3 col-3 text-right">
                                                                    {parseFloat(item.quantity * item.offerPricePerUnit).toFixed(2)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                                <div className="productsTotal b-bottom row py-4 flex f-ac">
                                                    <div className="t-amount col-lg-6 col-6">
                                                        Total Amount
                                                    </div>
                                                    <div className="t-rupees col-lg-6 col-6 text-right">
                                                        Rs. {parseFloat(totalVeg).toFixed(2)}
                                                    </div>
                                                </div>
                                                <div className="grocery-delivery">
                                                    <img src="/public/images/calender.svg" />
                                                    <span>
                                                        <small>Veggies Delivery Time</small>
                                                        <br />
                                                        {dateString(vegdate) + ", at " + dateTOAMORPM(vegdate)}
                                                    </span>
                                                </div>
                                                <div className="order-status-img">
                                                    {this.renderOderStatus()}
                                                </div>
                                            </div>
                                            : ""} */}
                                        <div className="overall-total flex justify-content-between b-bottom py-4 f-ac">
                                            <span className="overall-amount">
                                                Total Amount
                                            </span>
                                            <span className="overall-price">
                                                Rs. <b> {parseFloat(totalOrderValue).toFixed(2)} </b>
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div >
                    </div >
                </div>
            </React.Fragment >
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        orderData: state.orders.singleOrder
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        getOrderData: service.getSingleOrderData
    }, dispatch);
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Order);

