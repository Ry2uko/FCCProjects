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
        <h1>Book</h1>
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