import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Product from '../components/pages/product';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.product,
		cart: state.cart,
		selectedZone: state.util.selectedZone,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getData: service.getProductPageData,
		updateCart: service.updateCart,
		getCartData: service.getCartData
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Product);
