import './ReqTrade.sass';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}

// rendering non-existent books
// opening books
// trade/request info modal

const ReqTradeContainer = ({ 
  type, // for determining if request or trade
  userA,
  userABooks,
  userB,
  userBBooks,
  user, // for checking if user is current user in links
  reqTradeId,
  handleOpenBookBtn,
  handleOpenReqTradeBtn
}) => {
  return (
    <div className="reqTrade-container" reqtradeid={reqTradeId}>
      <div className="left-panel-container panel-container">
        <span className="reqTrade-tile-user">
          {
            user ? (
              user.username === userA ? (
                type === 'trade-profile' ? (
                  <span className="trade-profile">{ userA }</span>
                ) :  <a href="/profile" className="request-user">{ userA }</a>
              ) : <a href={ `/user/${userA}` } className="request-user">{ userA }</a>
            ) : <a href={ `/user/${userA}` } className="request-user">{ userA }</a>    
          }
        </span>
        <div className="container-tile">
          <div className="request-book-container">
            { userABooks.map((book, index) => {
              return (
                <div className="request-book" key={index} onClick={() => { handleOpenBookBtn(book._id.toString()) }}>
                  { 
                    type === 'request' ? (
                      book.requests_count > 0 ? (
                        <div className="requests-count-container">
                          <span className="requests-count">{ book.requests_count }</span>
                        </div>
                      ) : null
                    ) : null
                  }
                  
                  <h4 className="book-name">{ book.title }</h4>
                  {
                    book.author ? <span className="book-author-span">by <span className="book-author">{ book.author }</span></span> : null
                  }
                </div>
              )
            }) }
          </div>
        </div>
      </div>
      {
        type === 'request' ? (
          <button className="reqTrade-info-btn" onClick={() => { handleOpenReqTradeBtn(reqTradeId) }}><i className="fa-solid fa-share"></i></button>
        ) : (
          <button className="reqTrade-info-btn" onClick={() => { handleOpenReqTradeBtn(reqTradeId) }}><i className="fa-solid fa-repeat"></i></button>
        )
      }
      <div className="right-panel-container panel-container">
        <span className="reqTrade-tile-user">
        {
            user ? (
              user.username === userB ? (
                type === 'trade-profile' ? (
                  <span className="trade-profile">{ userB }</span>
                ) :  <a href="/profile" className="request-user">{ userB }</a>
              ) : <a href={ `/user/${userB}` } className="request-user">{ userB }</a>
            ) : <a href={ `/user/${userB}` } className="request-user">{ userB }</a>    
          }
        </span>
        <div className="container-tile">
          <div className="request-book-container">
            { userBBooks.map((book, index) => {
              return (
                <div className="request-book" key={index} onClick={() => { handleOpenBookBtn(book._id.toString()) }}>
                  { 
                    type === 'request' ? (
                      book.requests_count > 1 ? (
                        /* greater than 1 since this request is not counted */ 
                        <div className="requests-count-container">
                          <span className="requests-count">{ book.requests_count }</span>
                        </div>
                      ) : null
                    ) : null
                  }
                  <h4 className="book-name">{ book.title }</h4>
                  {
                    book.author ? <span className="book-author-span">by <span className="book-author">{ book.author }</span></span> : null
                  }
                </div>
              )
            }) }
          </div>
        </div>
      </div>
    </div>
  );
}

class ReqTrade extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: '',
      title: '',
      requests: null,
      trades: null,
      books: null
    }

    this.renderInit = this.renderInit.bind(this);
    this.handleOpenBookBtn = this.handleOpenBookBtn.bind(this);
    this.renderRequestById = this.renderRequestById.bind(this);
    this.renderTradeById = this.renderTradeById.bind(this);
    this.renderStateData = this.renderStateData.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenReqTradeBtn = this.handleOpenReqTradeBtn.bind(this);
  }

  renderRequestById() {
    let targetRequest = this.state.requests.find(request => request._id.toString() === this.props.requestId);

    if (!targetRequest) {
      return (
        <>
          <div className="ReqTrade-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">Request {this.props.requestId}</h2>
          </div>
          <div className="spec-container">
            <span className="error-text">
              Request <b>{this.props.requestId}</b> either does not exist or it has been deleted.
            </span>
          </div>
        </>
      )
    }

    return;
  }

  renderTradeById() {
    return;
  }

  handleBackBtn() {
    let route;
    if (this.props.navState) route = this.props.navState.route;

    this.props.navigate(route ? route : '/requests');
  }

  handleOpenReqTradeBtn(reqTradeId) {
    this.props.navigate(`/${this.props.type === 'request' ? 'request' : 'trade'}/${reqTradeId}`, { state: { route: this.props.route }});
  }

  handleOpenBookBtn(bookId) {
    this.props.navigate(`/book/${bookId}`, { state: { route: this.props.route }});
  }

  renderStateData() {
    this.setState({ books: null, requests: null, trades: null });

    if (this.props.type === 'request') {
      getData('/requests').then(({ requests }) => {
        this.setState({ requests });
      });
    } else if (this.props.type === 'trade') {
      getData('/trades').then(({ trades }) => {
        this.setState({ trades });
      });
    } 

    getData('/books').then(({ books }) => {   
      this.setState({ books });
    });
  }

  componentDidMount() {
    this.renderStateData();

    this.renderInit();
    $('.user-dropdown-content').css('display', 'none');
  }

  componentDidUpdate(prevProps) {
    // for checking if /requests or /trades 
    // if user is currently in /requests then moved to /trades, since they share the same component it won't mount again but will only re render

    // for avoiding infinite loop because of this.setState which updates the component again
    // only works if route is changed
    if (!equal(this.props.route, prevProps.route)) {
      this.renderStateData();
      this.renderInit();
    }
  }

  renderInit() {
    // Initialize
    let type = this.props.type;
    this.setState({
      type: type.toLowerCase(),
      title: type.charAt(0).toUpperCase() + type.substr(1).toLowerCase() + 's'
    });

    $('a.nav-link.active').removeClass('active');
    if (type === 'request') {
      $('a.nav-link[href="/requests"]').attr('class', 'nav-link active');
    } else if (type === 'trade') {
      $('a.nav-link[href="/trades"]').attr('class', 'nav-link active');
    }
    
  }

  render() {
    if (
      ((this.props.type === 'request' && this.state.requests == null) || this.state.books == null) ||
      ((this.props.type === 'trade' && this.state.trades == null) || this.state.books == null)
    ) {
      if (this.props.route === '/request' || this.props.route === '/trade') {
        return (
          <div className="parent-container">
            <div className="ReqTrade-header-container">
              <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
              <h2 className="header-title">{this.props.type === 'request' ? 'Request' : 'Trade'} {this.props.type === 'request' ? this.props.requestId : this.props.tradeId}</h2>
            </div>
            <span className="loading-container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </span>
          </div>
        );
      } else {
        return (
          <div className="parent-container">
            <div className="title-banner">
              <h1 className="title">All {this.state.title}</h1>
            </div>
            <span className="loading-container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </span>
          </div>
        );
      }
    } else {
      return (
        <div className="ReqTrade parent-container">
          {
            this.props.route === '/request' ? this.renderRequestById() 
            : this.props.route === '/trade' ? this.renderTradeById()
            : (
              <>
                <div className="title-banner">
                  <h1 className="title">All {this.state.title}</h1>
                </div>
                <div className="reqTrades-container">
                  { this.props.type === 'request' ? (
                    this.state.requests.map((request, index) => {

                      // format userA and userB books id to object
                      const formattedUserABooks = request.userABooks.reduce((a, bookId) => {
                        const book = this.state.books.find(book => book._id.toString() === bookId);
                        a.push(book);
                        return a;
                      }, []);

                      const formattedUserBBooks = request.userBBooks.reduce((a, bookId) => {
                        const book = this.state.books.find(book => book._id.toString() === bookId);
                        a.push(book);
                        return a;
                      }, []);

                      return <ReqTradeContainer 
                        type={this.props.type}
                        userA={request.userA}
                        userABooks={formattedUserABooks}
                        userB={request.userB}
                        userBBooks={formattedUserBBooks}
                        user={this.props.user}
                        key={index}
                        reqTradeId={request._id.toString()}
                        handleOpenBookBtn={this.handleOpenBookBtn}
                        handleOpenReqTradeBtn={this.handleOpenReqTradeBtn}
                      />;
                    })
                  ): (
                    this.state.trades.map((trade, index) => {
                      // format userA and userB books id to object
                      const formattedUserABooks = trade.userABooks.reduce((a, bookId) => {
                        const book = this.state.books.find(book => book._id.toString() === bookId);
                        a.push(book);
                        return a;
                      }, []);

                      const formattedUserBBooks = trade.userBBooks.reduce((a, bookId) => {
                        const book = this.state.books.find(book => book._id.toString() === bookId);
                        a.push(book);
                        return a;
                      }, []);

                      return <ReqTradeContainer 
                        type={this.props.type}
                        userA={trade.userA}
                        userABooks={formattedUserABooks}
                        userB={trade.userB}
                        userBBooks={formattedUserBBooks}
                        user={this.props.user}
                        key={index}
                        reqTradeId={trade._id.toString()}
                        handleOpenBookBtn={this.handleOpenBookBtn}
                        handleOpenReqTradeBtn={this.handleOpenReqTradeBtn}
                      />;
                    })
                  )}
                </div>
              </>
            )
          }
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  let { requestId, tradeId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <ReqTrade 
      navigate={navigate} 
      type={props.type} 
      user={props.user} 
      route={props.route} 
      navState={state} 
      requestId={requestId} 
      tradeId={tradeId}
    />
  );
};

export { ReqTradeContainer };