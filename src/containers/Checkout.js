import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Checkout from '../components/pages/checkout';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		Checkout: state.Checkout,
		selectedZone: state.util.selectedZone,
		configInfo: state.util.configInfo
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getData: service.getOrdersListData,
		userPlaceOrder: service.userPlaceOrder,
		afterPayment: service.afterPayment,
		getCartData: service.getCartData,
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Checkout);
