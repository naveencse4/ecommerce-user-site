// import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {matchPath} from 'react-router-dom';
import {Helmet} from "react-helmet";
import {routes} from '../../../universal/routes';
import './OrdersList.scss';
import '../profile/profile.scss';
import OrderList from "./OrderList"
import {ORDER_LIMIT, ORDER_OFFEST} from '../../constants/constants';
import ProfileNav from '../profile/profileNav';
import Spinner from '../../common/Spinner';
import service from '../../../redux/actions/index';

class Orders extends Component {

    constructor(props) {
        super(props);
        this.state = {
         //   orderStatus: "NON_DELIVERED",
            orderStatus: "",
            offset: ORDER_OFFEST,
            limit: ORDER_LIMIT,
            showSpinner: false,
            noProductsFound : false,
            isHideLoadMore: false
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
        let info = this.props.data && this.props.data.responseBody.responseData.data
        this.setState({ showSpinner: true }, () => {
            setTimeout(() => {
                this.setState({ showSpinner: false });
            }, 500)
  
            if (this.props.data === null) {
                this.props.data && this.props.data.responseBody.responseData.data[0].status === "DELIVERED" ? this.setState({ orderStatus: "DELIVERED" }) : this.setState({ orderStatus: "NON_DELIVERED" })
            } else {
                const { orderStatus, offset, limit } = this.state;
                this.setState({ orderStatus: "NON_DELIVERED" })
                this.props.getData(orderStatus, offset, limit)
            }
        })
        if (!this.props.data) {
            const { orderStatus, offset, limit } = this.state;
            this.setState({ orderStatus: "NON_DELIVERED" }, () =>
            this.props.getData(orderStatus, offset, limit) )
        }
      
        if (!service.getCookieData('token')) {
            this.props.history.push('/');
        }
    }

    componentDidUpdate(prevProps) {
        let info = this.props.data && this.props.data.responseBody.responseData.data
        if (this.props !== prevProps) {
            this.setState({orderStatus : this.state.orderStatus})
            try {
                if (info.length === 0){
                    this.setState({
                        noProductsFound: true,
                    })
                }
                if (this.state.limit>info.length){
                    this.setState({
                        isHideLoadMore : true
                    })
                }
            }catch (e) {

            }
            this.setState({
                showSpinner: false
            });
        }
    }

    orderDeliveredHandler = (e, orderStatus) => {

        this.setState({
                orderStatus: orderStatus,
                limit: ORDER_LIMIT,
                isHideLoadMore : false
            },
            this.loadOrderList
        );
    }

    orderNonDeliveredHandler = (e, orderStatus) => {
        this.setState({
                orderStatus: orderStatus,
                limit: ORDER_LIMIT,
                isHideLoadMore : false
            },
            this.loadOrderList
        );
    }

    loadMore = () => {
        this.setState(
            prevState => ({
                limit: prevState.limit + ORDER_LIMIT,
            }),
            this.loadOrderList
        )
    };

    loadOrderList =  () => {
        const {orderStatus, offset, limit} = this.state;
        this.props.getData(orderStatus, offset, limit);
        this.setState({showSpinner: true});

    }

    render() {

        const {data} = this.props;
        if (!data)
            return <div id="order_list_view"><Spinner isFullPage={true}/></div>;
        const orders = data.responseBody.responseData;

        const {location} = this.props;
        const itemToActive = location;

        return (
            <React.Fragment>
                <Helmet>
                    <title>My Orders | HeyBandi</title>
                </Helmet>
                {this.state.showSpinner && <Spinner isFullPage={true}/>}
                <div id="order_list_view">
                    <div className="profile-container container">
                        <div className="row">
                            <ProfileNav itemToActive={itemToActive}/>
                            <div className="col-lg-7 orders-block-container">
                                {/* My Orders Container */}
                                <section id="myOrdersBlock" className="orders-block full-border">
                                    <h2>My Orders
                                        <span>
                                             <span
                                                 className={this.state.orderStatus === "DELIVERED" ? "statusTypeAc" : "statusTypeIn"}
                                                 onClick={(e) => this.orderDeliveredHandler(e, "DELIVERED")}>
                                                Delivered
                                            </span>
                                            <span
                                                className={this.state.orderStatus === "NON_DELIVERED" ? "statusTypeAc" : "statusTypeIn"}
                                                onClick={(e) => this.orderNonDeliveredHandler(e, "NON_DELIVERED")}>
                                                In Progress
                                            </span>

                                        </span>
                                    </h2>
                                    {orders.data.length > 0 ?
                                        <>
                                            {orders.data.map((order) => {
                                                return <OrderList
                                                    orderData={order}
                                                />;
                                            })}
                                        </>
                                        :
                                        <div className="text-center">
                                            <button className="no-orders-text">No Orders Found!</button>
                                        </div>
                                }
                                    {
                                        this.state.isHideLoadMore ? null :
                                            <div className="text-center">
                                                <button className="load-more" onClick={this.loadMore}>Load More</button>
                                            </div>
                                    }
                                    {/* {
                                        this.state.noProductsFound ? <div className="text-center">
                                            <button className="no-orders-text">No Orders Found!</button>
                                        </div> : null
                                    } */}
                                </section>
                                {/* End of My Orders Container */}
                            </div>
                        </div>
                    </div>
                </div>

            </React.Fragment>
        );
    }
}

// Orders.propTypes = {
//     data: PropTypes.shape({
//         text: PropTypes.string
//     }),
//     getData: PropTypes.func.isRequired
// };

// Orders.defaultProps = {
//     data: null
// };

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        getData: service.getOrdersListData
    }, dispatch);
}

const mapStateToProps = (state, ownProps) => {
    return {
        data: state.orders.ordersAll,
        cartData: state.cart.cartData,
        addressData: state.userLogin.addressData,
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Orders);
