import './UserBooks.sass';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import $ from 'jquery';

// no books yet

async function getData(userRoute) {
  const userResponse = await fetch(userRoute);
  const userObj = await userResponse.json();

  const booksResponse = await fetch('/books');
  const booksObj = await booksResponse.json();

  return [userObj.user, booksObj.books];
}

class UserBooks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: null,
      deleteBtnLock: false
    };

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenBook = this.handleOpenBook.bind(this);
    this.handleDeleteBookBtn = this.handleDeleteBookBtn.bind(this);
    this.reloadState = this.reloadState.bind(this);
  }

  reloadState() {
    this.setState({ books: null, deleteBtnLock: false });

    let route = '';

    if (this.props.type === 'profile') route = `/users?id=${this.props.user.id}`;
    else if (this.props.type === 'user') route = `/users?username=${this.props.username}`;

    getData(route).then(([user, books]) => {
      const userBooks = user.books;
      let stateBooks = [];
     
      userBooks.forEach(bookId => {
        let book = books.find(book => book._id.toString() === bookId);
        if (!book) return;
        
        stateBooks.push(book);
      });

      this.setState({ books: stateBooks });
    });
  }

  handleDeleteBookBtn(bookId) {
    if (!bookId || this.state.deleteBtnLock) return;
    this.setState({ deleteBtnLock: true });
    const MS = 200;

    $('.user-dropdown-content').css('display', 'none');

    $('.confirm-modal').css({
      'display': 'flex',
      'opacity': 0
    }).animate({
      'opacity': 1
    }, MS);
    $('.parent-container').css('pointerEvents', 'none').animate({ 'opacity': 0.5 }, MS);

    $('#cancelBtn').on('click', () => {
      // close modal
      $('.confirm-modal').animate({
        'opacity': 0
      }, MS, function(){
        $(this).css('display', 'none');
      });
      $('.parent-container').animate({
        'opacity': 1
      }, MS, function(){
        $(this).css('pointerEvents', 'auto');
        $('#cancelBtn').off('click');
      });
    });

    $('#deleteBtn').on('click', () => {    
      const component = this;  
      // close modal
      $('.confirm-modal').animate({
        'opacity': 0
      }, MS, function(){
        $(this).css('display', 'none');
        $.ajax({
          method: 'DELETE',
          url: '/books',
          data: { id: bookId },
          success: component.reloadState(),
          error: resp => {
            const errMsg = resp.responseJSON.error;
            alert('Failed to delete book: ' + errMsg);
          }
        });
      });

      $('.parent-container').animate({
        'opacity': 1
      }, MS, function(){
        $(this).css('pointerEvents', 'auto');
        $('#deleteBtn').off('click');
      });

    });
  }

  handleBackBtn() {
    let route;
    if (this.props.navState) route = this.props.navState.route;

    if (route) {
      this.props.navigate(route);
    } else {
      if (this.props.type === 'profile') this.props.navigate('/profile');
      else this.props.navigate(`/user/${this.props.username}`);
    }
  }

  handleOpenBook(bookId) {
    let route = this.props.type === 'profile' ? '/profile/books' : `/user/${this.props.username}/books`;
    this.props.navigate(`/book/${bookId}`, { state: { route } })
  }

  componentDidMount() {
    this.reloadState();
    
    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.books == null) {
      return (
        <>
          <div className="confirm-modal">
            <div className="header-container">
              <span className="warning-icon"><i className="fa-solid fa-triangle-exclamation"></i></span>
              <h4 className="warning-text">Are you sure?</h4>
            </div>
            <span className="warning-description">You will not be able to recover this book!</span>
            <div className="modal-buttons-container">
              <button type="button" id="cancelBtn">Cancel</button>
              <button type="button" id="deleteBtn">Delete</button>
            </div>
          </div>
          <div className="parent-container">
            <div className="UserBooks-header-container">
              <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
              { this.props.type === 'profile' ? (
                <h2 className="header-title">My Books</h2>
              ) : (
                <h2 className="header-title">{this.props.username}'s Books</h2>
              )}
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
        </>
      );
    } else {
      return (
        <>
          <div className="confirm-modal">
            <div className="header-container">
              <span className="warning-icon"><i className="fa-solid fa-triangle-exclamation"></i></span>
              <h4 className="warning-text">Are you sure?</h4>
            </div>
            <span className="warning-description">You will not be able to recover this book!</span>
            <div className="modal-buttons-container">
              <button type="button" id="cancelBtn">Cancel</button>
              <button type="button" id="deleteBtn">Delete</button>
            </div>
          </div>
          <div className="UserBooks parent-container">
            <div className="UserBooks-header-container">
              <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
              { this.props.type === 'profile' ? (
                <h2 className="header-title">My Books</h2>
              ) : (
                <h2 className="header-title">{this.props.username}'s Books</h2>
              )}
            </div>
            <div className="books-container">
              { this.state.books.map((book, index) => {
                return (
                  <div className="book-tile-container" bookid={book._id} key={index}>
                    <div className="book-tile">
                      { book.requests_count > 0 ? (
                        <div className="book-requests-container" onClick={() => { this.handleOpenBook(book._id.toString()) }}><span className="book-requests">{book.requests_count}</span></div> 
                      ) : null}
                      <h4 className="book-title">
                        <span className="book-link" onClick={() => { this.handleOpenBook(book._id.toString()) }}>
                          {book.title}
                        </span>
                      </h4>
                      { book.author ? (
                        <span className="book-author">by {book.author}</span>
                      ) : null }
                      { book.condition ? (
                        <span className="book-condition-container"><span className={ `${book.condition.split(' ').join('')}-condition book-condition` }>{book.condition}</span> condition</span>
                      ) : null }
                    </div>
                    {
                      this.props.type === 'profile' ? (
                        <div className="profile-book-btn-container">
                          <div className="btn-container">
                            <button type="button" className="delete-book-btn" onClick={() => { this.handleDeleteBookBtn(book._id.toString()) }}><i className="fa-solid fa-trash-can"></i></button>
                            <div className="tag-container" />
                          </div>
                        </div>
                      ) : null
                    }
                    
                  </div>
                );
              }) }
            </div>
          </div>
        </>
      );
    }
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      if (username === props.user.username) {
        navigate('/profile/books', { replace: true });
        return;
      }
    }
  }, []);

  return (
    <UserBooks type={props.type} user={props.user} navigate={navigate} username={username} navState={state} />
  );
}