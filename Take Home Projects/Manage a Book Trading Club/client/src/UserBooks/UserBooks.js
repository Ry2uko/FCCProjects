import './UserBooks.sass';
import React from 'react';
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
      books: null
    };

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenBook = this.handleOpenBook.bind(this);
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
    let route = '';

    if (this.props.type === 'profile') route = `/users?id=${this.props.user.id}`;
    else if (this.props.type === 'user') route = `/users?username=${this.props.username}`;

    getData(route).then(([user, books]) => {
      const userBooks = user.books;
      let stateBooks = [];
      
      userBooks.forEach(bookId => {
        stateBooks.push(books.find(book => book._id.toString() === bookId));
      });

      this.setState({ books: stateBooks });
    });
    
    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.books == null) {
      return (
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
      );
    } else {
      return (
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
                      <div className="book-requests-container"><span className="book-requests">{book.requests_count}</span></div> 
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
                      <span className="book-condition-container"><span className={ `${book.condition}-condition book-condition` }>{book.condition}</span> condition</span>
                    ) : null }
                  </div>
                  {
                    this.props.type === 'profile' ? (
                      <div className="profile-book-btn-container">
                        <div className="btn-container">
                          <button type="button" className="edit-book-btn"><i className="fa-solid fa-pen"></i></button>
                          <div className="tag-container" />
                        </div>
                        <div className="btn-container">
                          <button type="button" className="delete-book-btn"><i className="fa-solid fa-trash-can"></i></button>
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
      );
    }
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  if (props.user) {
    if (username === props.user.username) {
      navigate('/profile/books', { replace: true });
      return;
    }
  }

  return (
    <UserBooks type={props.type} user={props.user} navigate={navigate} username={username} navState={state} />
  );
}