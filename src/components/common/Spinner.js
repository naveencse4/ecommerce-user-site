import React, { Component } from 'react';
import './Spinner.scss';

class Spinner extends Component {

    render() {
        return (
            <React.Fragment>
                {this.props.isFullPage ?
                    <div className="spinner-bg">
                        <div className="spinner-5"></div>
                    </div>
                    :
                    this.props.isBlockLevel?
                    <div className="spinner-block">
                        <div className="spinner-5"></div>
                    </div>:
                    this.props.isPageLoad ?
                        <div className="spinner-7"></div>
                        : <div className="spinner-3"></div>
                }

            </React.Fragment>
        );
    }
}

export default Spinner;
