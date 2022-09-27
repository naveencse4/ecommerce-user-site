import React, { Component } from 'react';
import Link from "react-router-dom/Link";

class SingleUrl extends Component {
    render() {
        return (
            <React.Fragment>
                <div className= "button-container">
                    <Link className = "button" to="/download">
                        Download Now
                    </Link>
                </div>
            </React.Fragment>
        );
    }
}

export default SingleUrl;
