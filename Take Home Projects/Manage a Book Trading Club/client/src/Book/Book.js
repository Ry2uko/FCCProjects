import './Book.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class Book extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/books"]').attr('class', 'nav-link active');
  }
  
  render() {
    return (
      <div className="Book">
        <div className="title-banner">
          <h1 className="title">Books</h1>
          <h2 className="title-description">Available for trade</h2>
        </div>
        <div className="books-container">
          <div className="book-tile">
            <h4 className="book-title">The Subtle Art of Not Giving a F*ck</h4>
            <span className="book-user">from <a className="user" href="#">Ry2uko</a> in Philippines</span>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
          <div className="book-tile">
            <p>book</p>
          </div>
        </div>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <Book navigate={navigate} />
  );
}