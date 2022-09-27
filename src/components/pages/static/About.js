import React, { Component } from 'react';
import Link from "react-router-dom/Link";

class About extends Component {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        return (
            <React.Fragment>
                <div className="container about">
                    <h2>Who We Are</h2>
                    <strong>Hello!!</strong>
                    <p>From Neelima & Manohar, Founders of Divergent Consulting Services an IT firm based out in Hyderabad.</p>
                    <p>With an ever increasing need for finding Pure & Natural cooking products, we ventured out to play our role to address this painful need. We truly believe in <strong>GOOD FOOD = GOOD HEALTH </strong>,we have come up with <strong>HeyBandi</strong> a technology delivery platform, delivering non adulterated/fresh cooking products, quick bites & beauty products, partnering with progressive Indian farmers and tribal communities for delivering Pure & Natural products at your doorstep. We have been enjoying travelling and partnering with farmers and tribal communities across India to get you non adulterated products.</p>
                    <strong>Mission</strong>
                    <p>Commitment for Pure & Natural unadulterated products.</p>
                    <strong>Vision</strong>
                    <p>To establish as a household name for non adulterated and fresh products and be the most trusted HEALTHY DELIVERY platform.</p>
                    <h3>Our Products</h3>
                    <h2>Highest Quality</h2>
                    <p>
                    </p>
                    <strong>How We Work</strong>
                    <img src="https://images.heybandi.com/web_images/HeyBandi+Icons.jpg" alt="heybandi work flow" />
                    <h3>Our Core Team</h3>
                    <h2>We Are The Best Team</h2>
                    <div className="row">
                        <div className="col-md-3">
                            <img className="card-img-bottom" src="https://images.heybandi.com/web_images/Chilli-Farmer.jpg" />
                            <h5>Anasuya</h5>
                        </div>
                        <div className="col-md-3">
                            <img className="card-img-bottom" src="https://images.heybandi.com/web_images/Farmer2.jpg" />
                            <h5>Gopinath</h5>
                        </div>
                        <div className="col-md-3">
                            <img className="card-img-bottom" src="https://images.heybandi.com/web_images/Farmer1.png" />
                            <h5>Sunil Yadav / Naveen Yadav</h5>
                        </div>
                        <div className="col-md-3">
                            <img className="card-img-bottom" src="https://images.heybandi.com/web_images/Farmer4.jpg" />
                            <h5>Eiliyah Gould</h5>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default About;
