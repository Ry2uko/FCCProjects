import './Book.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

async function getBooks() {
  const response = await fetch('/books');
  const booksObj = await response.json();
  return booksObj.books;
}

class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // null instead of empty array so that we can determine if books haven't been loaded yet
      books: null
    };
  }

  componentDidMount() {
    getBooks().then(books => {
      this.setState({ books });
    });

    // Default
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/books"]').attr('class', 'nav-link active');
  }
  
  render() {
    if (this.state.books == null) {
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
    } else {
      return (
        <div className="Book">
          <div className="title-banner">
            <h1 className="title">Books</h1>
            <h2 className="title-description">Available for trade</h2>
          </div>
          <div className="books-container">
            { this.state.books.map((book, index) => {
              return (
                <div className="book-tile" bookid={book.id} key={index}>
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
            }) }
          </div>
        </div>
      );
    }
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <Book navigate={navigate} user={props.user}/>
  );
}