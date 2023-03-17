import './NewRequest.sass';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import $ from 'jquery';

/* removing books */
/* request button, pre added book */
/* other users + filtering */
/* Saving request & error handling */
/* final testing */

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class SelectBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: null
    };
  }

  componentDidMount() {
    let route = '/books';
    if (this.props.renderType === 'books-my') route = `/books?user=${this.props.user.username}`;

    getData(route).then(({ books }) => {
      if (this.props.renderType === 'books-users') {
        let filteredBooks = books.filter(book => book.user !== this.props.user.username);
        this.setState({ books: filteredBooks });
      } else {
        this.setState({ books });        
      }
    });
  }

  render() {
    if (this.state.books === null) {
      return (
        <div className="parent-container">
          <div className="SelectBook-header-container">
            <button type="button" id="backBtn" onClick={this.props.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">
              {
                this.props.renderType === 'books-my' ? 'My Books' : 'Books'
              }
            </h2>
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
      )
    } else {
      return (
        <div className="SelectedBook parent-container">
          <div className="SelectBook-header-container">
            <button type="button" id="backBtn" onClick={this.props.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">
              {
                this.props.renderType === 'books-my' 
                ? 'My Books' 
                : this.props.targetBookUser !== '' ? ` ${this.props.targetBookUser}'s Books` 
                : 'Books'
              }
            </h2>
          </div>
          <div className="books-container">
            { 
              this.state.books.map((book, index) => {
                return (
                  <div className={
                    this.props.presentBooks ? (
                      ((!this.props.presentBooks.includes(book._id.toString()) 
                      && this.props.presentBooks.length === 3) || 
                      (book.user !== this.props.targetBookUser && this.props.targetBookUser !== ''))
                      ? "book-tile disabled" : "book-tile"
                    ): "book-tile"
                  } bookid={book._id.toString()} key={index} onClick={(e) => { this.props.handleOpenBookBtn(book._id.toString(), e) }}>
                    <button type="button" className={
                      this.props.presentBooks ? (
                        this.props.presentBooks.includes(book._id.toString()) ? "add-book-btn active" : "add-book-btn" 
                      ) : "add-book-btn"
                    } onClick={() => { this.props.handleAddBookBtn(book._id.toString()) }}><i className="fa-solid fa-plus"></i></button>
                    <div className="book-center-container">
                      <h4 className="book-title">{book.title}</h4>
                      {book.author ? (
                        <h5 className="book-author">
                          by {book.author}
                        </h5>
                      ): null}
                    </div>
                    <div className="book-bottom-container">
                      {
                        this.props.renderType === 'books-users' ? (
                          <span className="book-user">
                            from
                            <span className="user-name"> {book.user}</span>{
                              book.condition !== '' ? ',' : null
                            }
                          </span>
                        ) : null
                      }
                      
                      {
                        book.condition ? (
                          <span className="book-condition-container"><span className={`book-condition ${book.condition.split(' ').join('')}-condition`}>{book.condition}</span> Condition</span>
                        ) : null
                      }
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )
    }
  }
}

class NewRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      request: null,
      books: null,
      createLock: false,
      stateLoad: true,
      renderType: 'form',
      userABooks: [],
      userBBooks: []
    };

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleAddBookBtn = this.handleAddBookBtn.bind(this);
    this.renderStateData = this.renderStateData.bind(this);
    this.addRequestBookBtn = this.addRequestBookBtn.bind(this);
  }

  handleBackBtn() {
    this.renderStateData(false);  
  }

  handleAddBookBtn(bookId) {
    if (!bookId) return;
    let targetBookUser = this.state.books.find(book => book._id.toString() === bookId).user;

    if (this.state.renderType === 'books-my') {
      if (targetBookUser !== this.props.user.username) return;

      // toggle off
      if (this.state.userABooks.includes(bookId)) {
        let filtered = this.state.userABooks.filter(book_id => book_id !== bookId)
        this.setState({
          userABooks: filtered
        });
        return;
      }

      if (this.state.userABooks.length >= 3) return;

      // add book
      this.setState(prevState => ({
        userABooks: [...prevState.userABooks, bookId]
      }));
    } else {
      let otherTargetBookUser;
      if (this.state.userBBooks.length > 0) {
        otherTargetBookUser = this.state.books.find(book => book._id.toString() === this.state.userBBooks[0]).user; // assuming all authors are the same
        if (targetBookUser !== otherTargetBookUser) return;
      }

      // toggle off
      if (this.state.userBBooks.includes(bookId)) {
        let filtered = this.state.userBBooks.filter(book_id => book_id !== bookId)
        this.setState({
          userBBooks: filtered
        });
        return;
      }
      
      if (this.state.userBBooks.length >= 3) return;
      // add book
      this.setState(prevState => ({
        userBBooks: [...prevState.userBBooks, bookId]
      }));
    }
  }

  addRequestBookBtn(type) {
    if (type === 'my') {
      this.setState({ renderType: 'books-my' });
    } else {
      this.setState({ renderType: 'books-users' });
    }
  }

  renderStateData() {
    this.setState({ 
      user: null, 
      books: null,
      request: null, 
      createLock: false,
      renderType: 'form'
    });

    getData(`/users?id=${this.props.user.id}`).then(({ user }) => {
      this.setState({ 
        user,
        request: { // possible inputs
          userA: user.username,
          userB: null,
          userABooks: [],
          userBBooks: []
        },
      });
    });

    getData('/books').then(({ books }) => {
      this.setState({ books });
    });
  }

  componentDidMount() {
    this.renderStateData();

    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.renderType === 'form') {
      if (this.state.user === null || this.state.books === null) {
        return (
          <div className="parent-container">
            <div className="NewRequest-header-container">
              <h1 className="header-title">New Request</h1>
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
        let targetBookUser = '';
        if (this.state.userBBooks.length > 0) {
          targetBookUser = this.state.books.find(book => book._id.toString() === this.state.userBBooks[0]).user; // assuming that all books are from the same user
        }
        return (
          <div className="NewRequest parent-container">
            <div className="NewRequest-header-container">
              <h1 className="header-title">New Request</h1>
            </div>
            <div className="request-form-container">
              <div className="request-books-container-tile">
                <span className="caption-span">Choose your books to trade:</span>
                <div className="container-a request-books-container">
                  <button type="button" className="add-book-btn" onClick={() => { this.addRequestBookBtn('my') }}><i className="fa-solid fa-plus"></i></button>
                  {
                    this.state.userABooks.map((bookId, index) => {
                      let targetBook = this.state.books.find(book => book._id.toString() === bookId);
                      return (
                        <div className="request-book" key={index}>
                          <h4 className="book-name">{ targetBook.title }</h4>
                          {
                            targetBook.author ? <span className="book-author-span">by <span className="book-author">{ targetBook.author }</span></span> : null
                          }
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              <div className="request-books-container-tile">
                <span className="caption-span">Choose books to trade:</span>
                <div className="container-b request-books-container">
                  <button type="button" className="add-book-btn" onClick={() => { this.addRequestBookBtn('users') }}><i className="fa-solid fa-plus"></i></button>
                  {
                    this.state.userBBooks.map((bookId, index) => {
                      let targetBook = this.state.books.find(book => book._id.toString() === bookId);
                      return (
                        <div className="request-book" key={index}>
                          <h4 className="book-name">{ targetBook.title }</h4>
                          {
                            targetBook.author ? <span className="book-author-span">by <span className="book-author">{ targetBook.author }</span></span> : null
                          }
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              <div className="request-info-container">
                <span className="requested-by-span">Requested by: <span className="requested-by">{this.props.user.username}</span></span>
                <span className="requested-to-span">Requested to: <span className="requested-to">{targetBookUser}</span></span>
              </div>
              <div className="input-error-container">
                <span className="input-error">@Hacked By Ry2uko :P</span>
              </div>
              <div className="request-form-btn-container">
                <button type="button" id="discardBtn" onClick={this.handleDiscardBtn} className="request-form-btn">Discard</button>
                <button type="button" id="createBtn" onClick={this.handleCreateBtn} className="request-form-btn">Create</button>
              </div>
            </div>
          </div>
        );
      }
    } else {
      let presentBooks = this.state.renderType === 'books-my' ? this.state.userABooks : this.state.userBBooks;
      let targetBookUser = '';
      if (presentBooks.length > 0) {
        targetBookUser = this.state.books.find(book => book._id.toString() === presentBooks[0]).user; // assuming that all books are from the same user
      }

      return (
        <SelectBook 
          user={this.props.user}
          presentBooks={presentBooks}
          handleBackBtn={this.handleBackBtn}
          handleAddBookBtn={this.handleAddBookBtn}
          targetBookUser={targetBookUser}
          renderType={this.state.renderType}
        />
      );
    }
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();
  const { state } = useLocation();

  return (
    <NewRequest user={props.user} navigate={navigate} navState={state} />
  )
}