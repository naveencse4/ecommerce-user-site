import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/pages/home/Home';
import service from '../redux/actions/index';

const mapStateToProps = (state, ownProps) => {
	return {
		data: state.home,
		cart: state.cart,
		categories: state.util.categories,
		selectedZone: state.util.selectedZone,
		configInfo: state.util.configInfo,
		nonServingDays : state.util.nonServingDays
	};
}

const mapDispatchToProps = (dispatch, ownProps) => {
	return bindActionCreators({
		getData: service.getHomeData,
		updateCart: service.updateCart,
		notifyProductAvailability : service.notifyProductAvailability,
		getCartData: service.getCartData,
		getProductData: service.getProductPageData,
	}, dispatch);
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);
