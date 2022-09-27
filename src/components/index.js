/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
var ExecutionEnvironment = require('exenv');
import IdleTimer from 'react-idle-timer';
import Header from './common/Header';
import Footer from './common/Footer';
import './index.scss';
import { IDLE_TIME } from '../components/constants/constants';

export default class App extends Component {

	
	handleOnActive = (event) => {
      window.location.reload();
    }
	render() {
		return (
		
			<React.Fragment>
				{ExecutionEnvironment.canUseDOM && 
				<IdleTimer
					ref={ref => { this.idleTimer = ref }}
					element={document}
					onActive={this.handleOnActive}
					debounce={250}
					timeout={IDLE_TIME} />
				}
				<Header />
				{this.props.children}
				<Footer />
				</React.Fragment>
		);
	}
}

App.propTypes = {
	children: PropTypes.node.isRequired
};
