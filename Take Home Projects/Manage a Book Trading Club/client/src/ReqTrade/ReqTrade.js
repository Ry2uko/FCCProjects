import './ReqTrade.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}


// rendering non-existent books

const ReqTradeContainer = ({ 
  type, // for determining if request or trade
  userA,
  userABooks,
  userB,
  userBBooks,
  user, // for checking if user is current user in links
  reqTradeId
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
                <div className="request-book" key={index}>
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
                  <span className="book-author-span">by <span className="book-author">{ book.author }</span></span>
                </div>
              )
            }) }
          </div>
        </div>
      </div>
      {
        type === 'request' ? (
          <button className="reqTrade-info-btn"><i className="fa-solid fa-share"></i></button>
        ) : (
          <button className="reqTrade-info-btn"><i className="fa-solid fa-repeat"></i></button>
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
                <div className="request-book" key={index}>
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
                  <span className="book-author-span">by <span className="book-author">{ book.author }</span></span>
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
  }

  componentDidMount() {
    if (this.props.type === 'request') {
      getData('/requests').then(({ requests }) => {
        this.setState({ requests, trades: null });
      });
    } else if (this.props.type === 'trade') {
      getData('/trades').then(({ trades }) => {
        this.setState({ trades, requests: null });
      });
    }

    getData('/books').then(({ books }) => {
      this.setState({ books });
    });

    this.renderInit();
    $('.user-dropdown-content').css('display', 'none');
  }

  componentDidUpdate(prevProps) {
    // for checking if /requests or /trades 
    // if user is currently in /requests then moved to /trades, since they share the same component it won't mount again but will only re render

    // for avoiding infinite loop because of this.setState which updates the component again
    // only works if route is changed
    if (!equal(this.props.route, prevProps.route)) {
      if (this.props.type === 'request') {
        getData('/requests').then(({ requests }) => {
          this.setState({ requests, trades: null });
        });
      } else if (this.props.type === 'trade') {
        getData('/trades').then(({ trades }) => {
          this.setState({ trades, requests: null });
        });
      }

      getData('/books').then(({ books }) => {   
        this.setState({ books });
      });

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
      (this.props.type === 'request' && this.state.requests == null || this.state.books == null) ||
      (this.props.type === 'trade' && this.state.trades == null || this.state.books == null)
    ) {
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
    } else {
      return (
        <div className="ReqTrade parent-container">
          <div className="title-banner">
            <h1 className="title">All {this.state.title}</h1>
          </div>
          <div className="reqTrades-container">
            { this.props.type === 'request' ? (
              this.state.requests.map((request, index) => {
                // format userA and userB books id to object
                const formattedUserABooks = request.userABooks.reduce((a, bookId) => {
                  const book = this.state.books.find(book => book._id.toString() == bookId);
                  a.push(book);
                  return a;
                }, []);

                const formattedUserBBooks = request.userBBooks.reduce((a, bookId) => {
                  const book = this.state.books.find(book => book._id.toString() == bookId);
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
                />;
              })
            ): (
              this.state.trades.map((trade, index) => {
                // format userA and userB books id to object
                const formattedUserABooks = trade.userABooks.reduce((a, bookId) => {
                  const book = this.state.books.find(book => book._id.toString() == bookId);
                  a.push(book);
                  return a;
                }, []);

                const formattedUserBBooks = trade.userBBooks.reduce((a, bookId) => {
                  const book = this.state.books.find(book => book._id.toString() == bookId);
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
                />;
              })
            )}
          </div>
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <ReqTrade navigate={navigate} type={props.type} user={props.user} route={props.route} />
  );
};

export { ReqTradeContainer };