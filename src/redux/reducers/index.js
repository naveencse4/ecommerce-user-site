import { combineReducers } from 'redux';
import home from './home';
import category from './category';
import product from './product';
import cart from './cart';
import util from './util';
import userLogin from './userLogin';
import checkout from './checkout';
import orders from './orders';

const reduxState = combineReducers({
	home,
	category,
	product,
	cart,
	checkout,
	util,
	userLogin,
	orders
});

export default reduxState;
