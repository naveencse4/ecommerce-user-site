import React, { Component } from 'react';
import { matchPath, Link } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import Spinner from '../../common/Spinner';

class OrderList extends Component {
    state = {
        mblDevice : false
    }
    componentDidMount()  {
        isMobile ? this.setState({mblDevice : true}) : this.setState({mblDevice : false})
    }
    renderOdersList = () => {
        const { orderData } = this.props;
        switch (orderData.status) {
            case 'PLACED':
                return <span className="o-status-delivered">
                    <img src="/public/images/shipping-and-delivery.svg" alt="shipping-and-delivery" />
                    Order Confirmed
                </span>;
            case 'PACKED':
                return <span className="o-status-inProgress">
                    <img src="/public/images/delivery-truck.svg" alt="Order Packed" />
                    Order Packed
                </span>;
            case 'PICKED':
                return <span className="o-status-delivered">
                    <img src="/public/images/delivery-truck.svg" alt="Out-delivery" />
                    Out for Delivery
                </span>;
            case 'DELIVERED':
                return <span className="o-status-delivered">
                    <img src="/public/images/delivered.svg" alt="delivered" />
                    Delivered
                </span>;
            case 'PARTIALLY':
                return "some ime Delivered";
            case 'CANCEL':
                return <span className="o-status-canceled">
                    <img src="/public/images/order-cancel.svg" alt="order-cancel" />
                    Cancelled
                </span>;
            default:
                return null;
        }

    }

    render() {

        const { orderData } = this.props;
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
                <div className="order-list-view full-border">
                    <div className="o-id-n-date flex j-sb">
                        <span className="flex">
                            <span className="o-id-no">Order No: <b>HB#{orderData.displayOrderId}</b></span>
                            <span className="o-otp">(OTP - {orderData.otp})</span>
                        </span>
                        <span className="o-date flex">
                            <span>Placed On: </span>
                            <span className="created-date"> {dateString(createdAtDate) + ", at " + dateTOAMORPM(createdAtDate)}</span>
                        </span>
                    </div>
                    <br />
                    {/* <span className="o-payment-status">
                        <img src="/public/images/ticked.svg" />&nbsp;
                        {orderData.paymentStatus === "SUCCESS" ? "Payment Successful" : "Cash On Delivery"}
                    </span> */}
                    <span className="o-payment-status">
                        {orderData.paymentStatus === "SUCCESS" ?
                            <>
                        <img src="/public/images/ticked.svg" /> &nbsp;
                        Payment Successful 
                        </>
                            :
                            <>
                            <img src="/public/images/Cash on Delivery@2x.png" className="cod-img"/> &nbsp; 
                            Cash On Delivery
                            </>
                            }
                    </span>
                    <div className="amount-n-status flex j-sb">
                        <span className="o-amount f-ac mbl-flx-col">
                            <span className="amount-h">Amount:
                                <span className="amount-rs">Rs.{parseFloat(orderData.orderValue).toFixed(2)}</span>
                            </span>
                            {this.state.mblDevice ? <br /> : ""}
                            {/* <span className="amount-type">{orderData.paymentType === "TRANSFER" ? "Paid Online" : ""}</span> */}
                        </span>
                        {this.renderOdersList()}
                    </div>
                    {orderData.pdfPath ?
                        <div className="download-invoice">
                            <a href={orderData.pdfPath} target="_blank" download>
                                <img src="/public/images/Invoice@2x.png" />
                                    Download Invoice</a>
                        </div>
                        :
                        ""
                    }
                    <div className="o-delivery flex j-sb">
                        <div className="o-d-dates flex j-sb">
                            {orderData.expectedDelivery.date ?
                                <div className="grocery-delivery">
                                    <img src="/public/images/calender.svg" />
                                    <span>
                                        <small>Delivery Time</small>
                                        <br />
                                        {orderData.deliverySlot ? dateString(groceryDate) + " , " + orderData.deliverySlot.slot.startTime + " - " + orderData.deliverySlot.slot.endTime : dateString(groceryDate)}
                                    </span>
                                </div> : ""}
                            {/* {orderData.expectedDelivery.vegDeliveryDate ?
                                <>
                                    <div className="b-left" />
                                    <div className="grocery-delivery">
                                        <img src="/public/images/calender.svg" />
                                        <span>
                                            <small>Vegetables Delivery Time</small>
                                            <br />
                                            {orderData.deliverySlot ? dateString(vegdate) + " , " + orderData.deliverySlot.slot.startTime + " - " + orderData.deliverySlot.slot.endTime : dateString(vegdate)}
                                        </span>
                                    </div>
                                </> : ""} */}
                        </div>
                        {/*<div className="o-repeat-btn flex f-ac">*/}
                        {/*    <button className="repeat">*/}
                        {/*        <span>*/}
                        {/*            <img src="/public/images/repeat.svg" />*/}
                        {/*        </span>*/}
                        {/*        Repeat Order*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                    </div>
                    <div className="o-address flex j-sb f-ac">
                        <div className="o-address-dtls flex">
                            {orderData.deliveryType === "SELF" ? "" :
                                <>
                                    <img src="/public/images/location-icon.svg" />
                                    {orderData.userAddress !== null ?
                                        <div className="address">
                                            {orderData.userAddress.addressLine1}, {orderData.userAddress.addressLine2}, {orderData.userAddress.addressLine3}, {orderData.userAddress.localArea}
                                        </div> : ""}
                                </>
                            }
                        </div>
                        <div className="o-invoive-dtls">
                            <span>
                                <Link
                                    to={{
                                        pathname: `/order/${orderData.id}`,
                                        data: {
                                            orderData: orderData,
                                        },
                                    }}
                                    > View Details </Link>
                            </span>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        )
    }
}

export default OrderList;
