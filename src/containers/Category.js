import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Category from '../components/pages/category';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.category,
		cart: state.cart,
		categories: state.util.categories,
		selectedZone: state.util.selectedZone,
		configInfo: state.util.configInfo
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getData: service.getCategoryPageData,
		updateCart: service.updateCart,
		getCartData: service.getCartData
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Category);
