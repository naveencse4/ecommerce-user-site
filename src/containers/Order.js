import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Order from '../components/pages/orders/Order';
import service from '../redux/actions/index';

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
