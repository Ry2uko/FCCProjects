import './ReqTrade.sass';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}

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
      books: null,
      responseModalContent: null,
      cancelLock: false,
      acceptLock: false,
      rejectLock: false
    }

    this.renderInit = this.renderInit.bind(this);
    this.handleOpenBookBtn = this.handleOpenBookBtn.bind(this);
    this.renderReqTradeById = this.renderReqTradeById.bind(this);
    this.renderStateData = this.renderStateData.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenReqTradeBtn = this.handleOpenReqTradeBtn.bind(this);
    this.handleAcceptRequest = this.handleAcceptRequest.bind(this);
    this.handleRejectRequest = this.handleRejectRequest.bind(this);
    this.handleCancelRequest = this.handleCancelRequest.bind(this);
  }

  renderReqTradeById(type) {
    let textType = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    let targetReqTrade = type === 'request' 
    ? this.state.requests.find(request => request._id.toString() === this.props.requestId)
    : this.state.trades.find(trade => trade._id.toString() === this.props.tradeId); 

    if (!targetReqTrade) {
      return (
        <>
          <div className="ReqTrade-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">{textType} {type === 'request' ? this.props.requestId : this.props.tradeId}</h2>
          </div>
          <div className="spec-container">
            <span className="error-text">
              {textType} <b>{type === 'request' ? this.props.requestId : this.props.tradeId}</b> either does not exist or has been deleted.
            </span>
          </div>
        </>
      )
    }

    return (
      <>
        <div className="ReqTrade-header-container">
          <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
          <h2 className="header-title">{textType} {type === 'request' ? this.props.requestId : this.props.tradeId}</h2>
        </div>
        <div className="spec-container">
          <div className="spec-request-container">
            <div className="spec-book-panels-container">
              <div className="spec-book-panel panel-left">
                <span className="book-label">Wants to trade:</span>
                <div className="books-container">
                  {
                    type === 'request' ? (
                      targetReqTrade.userABooks.map((userABookId, index) => {
                        let targetBook = this.state.books.find(book => book._id.toString() === userABookId);
                        return (
                          <div className="spec-book" key={index} onClick={() => { this.handleOpenBookBtn(userABookId) }}>
                            <h4 className="spec-book-title">{targetBook.title}</h4>
                            <h5 className="spec-book-author">{targetBook.author}</h5>
                          </div>
                        );
                      }
                    )) : (
                      targetReqTrade.userABooks.map((userABookId, index) => {
                        let targetBook = this.state.books.find(book => book._id.toString() === userABookId);
                        return (
                          <div className="spec-book" key={index} onClick={() => { this.handleOpenBookBtn(userABookId) }}>
                            <h4 className="spec-book-title">{targetBook.title}</h4>
                            <h5 className="spec-book-author">{targetBook.author}</h5>
                          </div>
                        );
                      }
                    ))
                  }
                </div>
              </div>
              <div className="spec-book-panel panel-right">
              <span className="book-label">For:</span>
                <div className="books-container">
                  {
                    type === 'request' ? (
                      targetReqTrade.userBBooks.map((userBBookId, index) => {
                        let targetBook = this.state.books.find(book => book._id.toString() === userBBookId);
                        return (
                          <div className="spec-book" key={index} onClick={() => { this.handleOpenBookBtn(userBBookId) }}>
                            <h4 className="spec-book-title">{targetBook.title}</h4>
                            <h5 className="spec-book-author">{targetBook.author}</h5>
                          </div>
                        );
                      })
                    ) : (
                      targetReqTrade.userBBooks.map((userBBookId, index) => {
                        let targetBook = this.state.books.find(book => book._id.toString() === userBBookId);
                        return (
                          <div className="spec-book" key={index} onClick={() => { this.handleOpenBookBtn(userBBookId) }}>
                            <h4 className="spec-book-title">{targetBook.title}</h4>
                            <h5 className="spec-book-author">{targetBook.author}</h5>
                          </div>
                        );
                      })
                    )
                  }
                </div>
              </div>
            </div>
            <div className="spec-info-container">
              <div className="span-container">
                <span className="requested-by-span">
                  Requested by: <Link className="requested-by" to={
                    type === 'request' ? (
                      this.props.user ? (
                        this.props.user.username === targetReqTrade.userA ? 
                        `/profile` : `/user/${targetReqTrade.userA}`
                      ) : `/user/${targetReqTrade.userA}`
                    ) : (
                      this.props.user ? (
                        this.props.user.username === targetReqTrade.userA ? 
                        `/profile` : `/user/${targetReqTrade.userA}`
                      ) : `/user/${targetReqTrade.userA}`
                    )
                  }>{type === 'request' ? targetReqTrade.userA : targetReqTrade.userA}</Link>
                </span>
                <span className="requested-to-span">
                  Requested to: <Link className="requested-to" to={
                    type == 'request' ? (
                      this.props.user ? (
                        this.props.user.username === targetReqTrade.userB ? 
                        `/profile` : `/user/${targetReqTrade.userB}`
                      ) : `/user/${targetReqTrade.userB}`
                    ) : (
                      this.props.user ? (
                        this.props.user.username === targetReqTrade.userB ? 
                        `/profile` : `/user/${targetReqTrade.userB}`
                      ) : `/user/${targetReqTrade.userB}`
                    )
                  }>{type === 'request' ? targetReqTrade.userB : targetReqTrade.userB}</Link>
                </span>
                {
                  type === 'request' ? (
                    <span className="requested-on-span">
                      Requested on: <span className="requested-on">{targetReqTrade.requested_on}</span>
                    </span>
                  ) : (
                    <span className="accepted-on-span">
                    Accepted on: <span className="accepted-on">{targetReqTrade.accepted_on}</span>
                  </span>
                  )
                }
              </div>
              {
                (this.props.user && type === 'request') ? (
                  targetReqTrade.userB === this.props.user.username ? (
                    <div className="spec-btn-container">
                      <button type="button" id="acceptRequest" onClick={() => { this.handleAcceptRequest(targetReqTrade._id.toString()) }}><i className="fa-solid fa-check"></i></button>
                      <button type="button" id="rejectRequest" onClick={() => { this.handleRejectRequest(targetReqTrade._id.toString()) }}><i className="fa-solid fa-xmark"></i></button>
                      <span className="spec-label">Accept request?</span>
                    </div>
                  ) : targetReqTrade.userA === this.props.user.username ? (
                    <button type="button" id="cancelRequest" onClick={() => { this.handleCancelRequest(targetReqTrade._id.toString()) }}>Cancel Request</button>
                  ) : null
                ) : null
              }
            </div>
          </div>
        </div>
      </>
    );
  }

  handleCancelRequest(requestId) {
    if (!requestId || this.state.cancelLock) return;
    this.setState({ cancelLock: true });

    $.ajax({
      method: 'DELETE',
      url: '/requests',
      data: { id: requestId },
      success: () => {
        this.renderStateData();
        let route = '/requests';
        if (this.props.navState) route = this.props.navState.route;
        this.props.navigate(route, { replace: true });
      },
      error: resp => {
        const errMsg = resp.responseJSON.error;
        alert('Failed to reject request: ' + errMsg);
      }
    });
  }

  handleAcceptRequest(requestId) {
    if (!requestId || this.state.acceptLock) return;
    this.setState({ acceptLock: true });

    $.ajax({
      method: 'POST',
      url: '/trades',
      data: { id: requestId },
      success: data => {
        this.renderStateData();
        this.props.navigate(`/trade/${data._id.toString()}`, { replace: true });
      },
      error: resp => {
        const errMsg = resp.responseJSON.error;
        alert('Failed to accept request: ' + errMsg);
      }
    });
  }

  handleRejectRequest(requestId) {
    if (!requestId || this.state.rejectLock) return;
    this.setState({ rejectLock: true });

    $.ajax({
      method: 'DELETE',
      url: '/requests',
      data: { id: requestId },
      success: () => {
        this.renderStateData();
        let route = '/requests';
        if (this.props.navState) route = this.props.navState.route;
        this.props.navigate(route, { replace: true });
      },
      error: resp => {
        const errMsg = resp.responseJSON.error;
        alert('Failed to reject request: ' + errMsg);
      }
    });
  }

  handleBackBtn() {
    let route;
    if (this.props.navState) route = this.props.navState.route;

    this.props.navigate(route ? route : (this.props.route === '/request' ? '/requests' : '/trades'));
  }

  handleOpenReqTradeBtn(reqTradeId) {
    this.props.navigate(`/${this.props.type === 'request' ? 'request' : 'trade'}/${reqTradeId}`, { state: { route: this.props.route }});
  }

  handleOpenBookBtn(bookId) {
    let route;
    if (this.props.route === '/request') route = `/request/${this.props.requestId}`;
    else if (this.props.route === '/trade') route = `/trade/${this.props.tradeId}`;
    else route = this.props.route;

    this.props.navigate(`/book/${bookId}`, { state: { route } });
  }

  renderStateData() {
    this.setState({ 
      books: null, 
      requests: null, 
      trades: null, 
      cancelLock: false,
      acceptLock: false,
      rejectLock: false 
    });

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
        <> 
          <div className="ReqTrade parent-container">
            {
              this.props.route === '/request' ? this.renderReqTradeById('request') 
              : this.props.route === '/trade' ? this.renderReqTradeById('trade')
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
        </>
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