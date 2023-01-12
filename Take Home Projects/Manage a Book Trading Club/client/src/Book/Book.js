import './Book.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class Book extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/books"]').attr('class', 'nav-link active');

    $('.book-tile').each(function() {
      let conditionColors = [
        'rgb(23, 138, 238, 0.2) 3px 3px 20px 1px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
        'rgb(136, 41, 214, 0.2) 3px 3px 20px 1px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
        'rgb(102, 255, 102, 0.2) 3px 3px 20px 1px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
        'rgb(255, 255, 102, 0.2) 3px 3px 20px 1px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset',
        'rgb(255, 80, 80, 0.2) 3px 3px 20px 1px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset'
        
      ];
      $(this).css('boxShadow', conditionColors[Math.floor(Math.random() * conditionColors.length)]);
    });
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
            <div className="book-center-container">
              <h4 className="book-title">The Subtle Art of Not Giving a F*ck</h4>
              <h5 className="book-author">by Mark Manson</h5>
            </div>
            <div className="book-bottom-container">
              <span className="book-user">from <a className="user-name" href="/">Ry2uko</a> in <span className="user-location">Philippines</span></span>
            </div>
          </div>
          <div className="book-tile">
            <div className="book-center-container">
              <h4 className="book-title">Everything is F*cked</h4>
              <h5 className="book-author">by Mark Manson</h5>
            </div>
            <div className="book-bottom-container">
              <span className="book-user">from <a className="user-name" href="/">Ry2uko</a> in <span className="user-location">Philippines</span></span>
            </div>
          </div>
          <div className="book-tile">
            <div className="book-center-container">
              <h4 className="book-title">Surrounded by Setbacks</h4>
              <h5 className="book-author">by Thomas Erikson</h5>
            </div>
            <div className="book-bottom-container">
              <span className="book-user">from <a className="user-name" href="/">Ry2uko</a> in <span className="user-location">Philippines</span></span>
            </div>
          </div>
          <div className="book-tile">
            <div className="book-center-container">
              <h4 className="book-title">Surrounded by Idiots</h4>
              <h5 className="book-author">by Thomas Erikson</h5>
            </div>
            <div className="book-bottom-container">
              <span className="book-user">from <a className="user-name" href="/">Ry2uko</a> in <span className="user-location">Philippines</span></span>
            </div>
          </div>
          <div className="book-tile">
            <div className="book-center-container">
              <h4 className="book-title">Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones</h4>
              <h5 className="book-author">by James Clear</h5>
            </div>
            <div className="book-bottom-container">
              <span className="book-user">from <a className="user-name" href="/">Ry2uko</a> in <span className="user-location">Philippines</span></span>
            </div>
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