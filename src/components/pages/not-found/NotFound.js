import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from "react-helmet";
import styles from './NotFound.scss';

export default class NotFound extends Component {
	render() {
		return (
			<React.Fragment>
				<Helmet>
					<title> Page Not Found | HeyBandi</title>
				</Helmet>
				<div className="container">
					<div className="row">
						<div className="col-md-12">
							<div className={styles.NotFound}>
								<h1>Route not found.</h1>
								<p>Go <Link to='/' >Home</Link> to visit our range of products.</p>
							</div>
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}
}
