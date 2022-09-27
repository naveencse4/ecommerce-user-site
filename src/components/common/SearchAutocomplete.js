import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import service from '../../redux/actions/index';
import './SearchAutocomplete.scss'
import Spinner from './Spinner';

class SearchAutocomplete extends Component {
    _isMounted = false;
    static propTypes = {
        suggestions: PropTypes.instanceOf(Array)
    };
    static defaultProps = {
        suggestions: []
    };
    constructor(props) {
        super(props);
        this.items = [];
        this.state = {
            activeSuggestion: null,
            showSuggestions: false,
            userInput: "",
            showSpinner: false,
            noProductFound: false,
        };
        this.wrapperRef = React.createRef();
    }
    onChange = e => {
        this.setState({
            activeSuggestion: null,
            showSuggestions: true,
            userInput: e.currentTarget.value
        }, () => {
            this.triggerChange();
        });
    };
    onClickClose = e => {
        this.setState({
            userInput: ""
        });
    };
    triggerChange() {
        //const { userInput } = this.state;
        
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.getGlobalSearchData();
        }, 500);
    }

    componentDidMount() {
        this._isMounted = true;
        document.addEventListener('mousedown', this.handleClickOutside);
        if (this.props.autoFocusEnable) {
            setTimeout(() => {
                this.nameInput.focus();    
            }, 50);
        }
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({
                showSuggestions: false
            })
        }
    }

    onRouteClick = (e, slug) => {
        this.setState({
            showSuggestions: false,
            userInput: ''
        });
    }

    onEnter = (slug) => {
        this.setState({
            showSuggestions: false,
            userInput: ''
        });
        this.props.history.push(slug);
    }

    // scrollToRef = (ref) => ref.scrollIntoView({ behavior: 'smooth' });
    onKeyDown = e => {
        const { activeSuggestion } = this.state;
        const { globalSearchData } = this.props;
        if (this.items.length > 0) {
            // User pressed the enter key, update the input and close the suggestions
            let suggestionResult = globalSearchData[activeSuggestion];
            if (e.keyCode === 13) {
                if (suggestionResult)
                this.onEnter(suggestionResult.slug);
            }
            // User pressed the up arrow, decrement the index
            else if (e.keyCode === 38) {
                if (activeSuggestion === 0) {
                    this.setState({ activeSuggestion: globalSearchData.length - 1 });
                } else {
                    this.setState({ activeSuggestion: activeSuggestion - 1 });
                }
                
                // this.scrollToRef(this.items[activeSuggestion - 1]);
            }
            // User pressed the down arrow, increment the index
            else if (e.keyCode === 40) {
                if (activeSuggestion === globalSearchData.length - 1 ) {
                    this.setState({ activeSuggestion: 0 });
                } else {
                    this.setState({ activeSuggestion: activeSuggestion === null ? 0 :activeSuggestion + 1 });
                }
                // this.scrollToRef(this.items[activeSuggestion + 1]);
            }
        }
    };

    getGlobalSearchData() {
        const { userInput } = this.state;
        const { globalSearchData } = this.props;
        if (userInput != null && userInput !== "" && userInput.length >= 3) {
            this.setState({showSpinner:true}, ()=>{
				setTimeout(()=>{
					this.setState({showSpinner: false});
				}, 200)
			});
            this.props.getSearchData(userInput)
                .then(res => {
                    //  window.location.reload();
                  if ((Object.keys(this.props.globalSearchData).length === 0) && userInput.length >= 3){
                    this.setState({noProductFound : true})
                }
                })
        }
        if (userInput.length < 3) {
            this.setState({noProductFound : false})
        }
        if (userInput === "" || userInput.length < 3) {
            while (this.props.globalSearchData.length) {
                this.props.globalSearchData.pop()
            }
        }
       
    }

    render() {
        const { globalSearchData } = this.props;
        const {
            onChange,
            onKeyDown,
            onClickClose,
            state: {
                activeSuggestion,
                showSuggestions,
                userInput
            }
        } = this;
        return (
            <Fragment>
                <>
                    <input
                        type="text"
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        value={userInput}
                        ref={(input) => { this.nameInput = input; }} 
                        placeholder="Search for products"
                        id="searchInput"
                        autoComplete="off"
                        className="search-bar full-border"
                    />
                    <span className="search-icon pointer">
                        <img src="/public/images/search-interface-symbol.svg" />
                    </span>
                </>
                <div id="searchSuggestionBlock" ref={this.wrapperRef}>
                    {this.state.showSpinner && <>
                    <div className="search-spinner">
                    <Spinner isBlockLevel={true} />
                    </div>
                    </>}
                    {(globalSearchData && showSuggestions && userInput) ? ((Object.keys(globalSearchData).length > 0) ? (<Fragment>
                        <ul className="suggestions search-suggestions-block pointer full-border">
                            {globalSearchData.map((suggestion, index) => {
                                let className = 'suggestion';
                                if (index === activeSuggestion) {
                                    className = "suggestion suggestion-active";
                                }
                                return (
                                    <li className={className} key={index} ref={(ref) => this.items[index] = ref} onClick={(e) => {
                                        this.onRouteClick(e, suggestion.slug)
                                        this.props.closeSearchModal()
                                    }
                                    }>
                                        <Link to={'/product/' + suggestion.slug}  >
                                            <img src={suggestion.masterProductMedia[0].prefix + suggestion.masterProductMedia[0].childern[0].imgUrl100} alt={suggestion.title} />
                                            <div>
                                                {suggestion.productName}
                                            </div>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </Fragment>) :
                    this.state.noProductFound && <div className="no-search-found">No Products Found</div>)
                    : null}
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    globalSearchData: state.userLogin.autoSuggestionData
});

const mapDispatchToProps = (dispatch, ownProps) => {
    return bindActionCreators({
        getSearchData: service.getSearchData,
    }, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SearchAutocomplete));
