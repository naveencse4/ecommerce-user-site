import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Cart from '../components/pages/cart';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		cart: state.cart,
		selectedZone: state.util.selectedZone,
		configInfo: state.util.configInfo,
		cartData: state.cart.cartData,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		updateCart: service.updateCart
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Cart);
