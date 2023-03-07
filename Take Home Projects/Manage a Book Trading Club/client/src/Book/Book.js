import './Book.sass';
import { useNavigate, useParams, Link } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';
import equal from 'fast-deep-equal';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();
  return dataObj;
}

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // null instead of empty array so that we can determine if data hasn't been fetched yet
      books: null,
      requests: null,
      users: null,
      trades: null
    };

    this.renderBookById = this.renderBookById.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenBookBtn = this.handleOpenBookBtn.bind(this);
  }

  handleBackBtn() {
    this.props.navigate('/books');
  }

  handleOpenBookBtn(bookId) {
    this.props.navigate(`/book/${bookId}`, { replace: true });
  }

  renderBookById() {
    let targetBook = this.state.books.find(book => book._id.toString() === this.props.bookId);

    return (
      <>
        <div className="Book-header-container">
          <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
          <h2 className="header-title">Book {targetBook._id.toString()}</h2>
        </div>
        <div className="spec-container">
          <div className="spec-book-container">
            <div className="book-info-container">
              <h4 className="book-title">{targetBook.title}</h4>
              {
                targetBook.author ? (
                  <span className="book-author">by {targetBook.author}</span>
                ): null
              }
              {
                targetBook.condition ? (
                  <span className="book-condition"><span className={`${targetBook.condition}-condition`}>{targetBook.condition}</span> condition</span>
                ) : null
              }
              <div className="book-btn-container">
                {
                  targetBook.available ? (
                    <button type="button" id="requestBtn">
                      <i className="fa-solid fa-share"></i> Request
                    </button>
                  ) : (
                    <>
                      <button type="button" id="requestDisabled">
                        Not Available
                      </button>
                      <button type="button" id="viewTradeBtn">
                        <i className="fa-solid fa-repeat"></i> View Trade
                      </button>
                    </>
                  )
                }
              </div>
            </div>
            { targetBook.requests.length > 0 ? (
              <div className="book-requests-container">
                <h4 className="requests-title">Requests (<span id="requestsCount">{targetBook.requests_count}</span>)</h4>
                <div className="book-requests">
                  { targetBook.requests.map((requestId, index) => {
                      const targetRequest = this.state.requests.find(request => request._id.toString() === requestId);
                      const targetUser = this.state.users.find(user => user.username === targetRequest.userA);
                      return (
                        <div className="book-request" key={index}>
                          <div className="user-header-container">
                            <div className="user-image-container">
                              <img src={targetUser.avatar_url} className="user-avatar" alt="User Avatar" />
                            </div>
                            {
                              this.props.user ? (
                                this.props.user.username === targetUser.username ? (
                                  <Link to="/profile" className="user-name">{targetUser.username}</Link>
                                ) : (
                                  <Link to={ `/user/${targetUser.username}` } className="user-name">{targetUser.username}</Link>
                                )
                              ) : (
                                <Link to={ `/user/${targetUser.username}` } className="user-name">{targetUser.username}</Link>
                              )
                            }
                          </div>
                          <span className="requested-on">Requested on {targetRequest.requested_on}</span>
                        </div>
                      )
                    }) 
                  }
                </div>
              </div>
            ) : null }
          </div>
        </div>
      </>
    );
  }

  renderStateData() {
    this.setState({ books: null, requests: null, users: null, trades: null });
    
    getData('/books').then(({ books }) => {
      this.setState({ books });
    });

    getData('/requests').then(({ requests }) => {
      this.setState({ requests });
    });

    getData('/trades').then(({ trades }) => {
      this.setState({ trades });
    });

    getData('/users').then(({ users }) => {
      this.setState({ users });
    });
  }

  componentDidMount() {
    this.renderStateData();

    // Default
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/books"]').attr('class', 'nav-link active');
  }
  
  componentDidUpdate(prevProps) {
    // same deal as ReqTrade, check if route is changed
    if (!equal(this.props.route, prevProps.route)) {
      // update state data
      this.renderStateData();
    }
  }

  render() {
    if (
      this.state.books == null || this.state.requests == null
      || this.state.trades == null || this.state.users == null
      ) {
      if (this.props.bookId) {
        return (
          <>
            <div className="Book-header-container">
              <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
              <h2 className="header-title">Book {this.props.bookId}</h2>
            </div>
            <span className="loading-container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </span>
          </>
        )
      } else {
        return (
          <>
            <div className="title-banner">
              <h1 className="title">Books</h1>
              <h2 className="title-description">Available for trade</h2>
            </div>
            <span className="loading-container">
              <div className="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </span>
          </>
        );
      }
    } else {
      return (
        <div className="Book">
          {
            this.props.bookId ? (
              this.renderBookById()
            ) : (
              <>
                <div className="title-banner">
                  <h1 className="title">Books</h1>
                  <h2 className="title-description">Available for trade</h2>
                </div>
                <div className="books-container">
                  { 
                    this.state.books.map((book, index) => {
                      return (
                        <div className="book-tile" bookid={book._id.toString()} key={index} onClick={() => { this.handleOpenBookBtn(book._id.toString()) }}>
                          <button className="request-trade-button"><i className="fa-solid fa-arrow-right-arrow-left"></i></button>
                          <div className="book-center-container">
                            <h4 className="book-title">{book.title}</h4>
                            {book.author ? (
                              <h5 className="book-author">
                                by {book.author}
                              </h5>
                            ): null}
                          </div>
                          <div className="book-bottom-container">
                            <span className="book-user">
                              from
                              { 
                                this.props.user ? (
                                  this.props.user.username === book.user ? <a className="user-name" href="/profile"> {book.user}</a>
                                  : <a className="user-name" href={ `/user/${book.user}` }> {book.user}</a>
                                ) : <a className="user-name" href={ `/user/${book.user}` }> {book.user}</a>
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })
                  }
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
  let { bookId } = useParams();
  const navigate = useNavigate();

  return (
    <Book navigate={navigate} user={props.user} bookId={bookId} route={props.route} />
  );
}