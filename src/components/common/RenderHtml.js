import React from 'react';
import ReactHtmlParser from 'react-html-parser';
 
class RenderHtml extends React.Component {
  render() {
    return <React.Fragment>{ ReactHtmlParser(this.props.html) }</React.Fragment>;
  }
}
export default RenderHtml;