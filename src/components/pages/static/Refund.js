import React, { Component } from 'react';

class Refund extends Component {
    componentDidMount() {
        window.scrollTo(0, 0)
    }
    render() {
        return (
            <React.Fragment>
                <div className="container">
                    <h2>Refund Policy</h2>
                    <strong>Returns</strong>
                    <p>Our policy lasts 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging. Several types of goods are exempt from being returned. Perishable goods such as food, flowers, newspapers or magazines cannot be returned. We also do not accept products that are intimate or sanitary goods, hazardous materials, or flammable liquids or gases. Additional non-returnable items: Gift cards Downloadable software products Some health and personal care items To complete your return, we require a receipt or proof of purchase. Please do not send your purchase back to the manufacturer. There are certain situations where only partial refunds are granted: (if applicable) Book with obvious signs of use CD, DVD, VHS tape, software, video game, cassette tape, or vinyl record that has been opened. Any item not in its original condition, is damaged or missing parts for reasons not due to our error. Any item that is returned more than 30 days after delivery</p>
                    <strong>Refunds (if applicable)</strong>
                    <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.</p>
                    <strong>Late or missing refunds</strong>
                    <p>If you haven’t received a refund yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted. Next contact your bank. There is often some processing time before a refund is posted. If you’ve done all of this and you still have not received your refund yet, please contact us at contact@heybandi.com.</p>
                    <strong>Sale items</strong>
                    <p>Only regular priced items may be refunded, unfortunately sale items cannot be refunded.</p>
                    <strong>Exchanges</strong>
                    <p>We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email at contact@heybandi.com and send your item to: Flat 410, Urbansky Regalia, Road No 10, Panchavati Colony, Manikonda, Hyderabad, Telengana -500 089.</p>
                    <strong>Shipping</strong>
                    <p>To return your product, you should mail your product to: Flat 410, Urbansky Regalia, Road No 10, Panchavati Colony, Manikonda, Hyderabad, Telengana -500 089. You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable. If you receive a refund, the cost of return shipping will be deducted from your refund. Depending on where you live, the time it may take for your exchanged product to reach you, may vary. We don’t guarantee that we will receive your returned item.</p>
                </div>
            </React.Fragment>
        );
    }
}

export default Refund;