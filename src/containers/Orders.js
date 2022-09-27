import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Orders from '../components/pages/orders';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.orders.ordersAll,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getData: service.getOrdersListData
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Orders);
