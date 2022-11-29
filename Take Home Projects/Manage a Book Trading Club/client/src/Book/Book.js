import './Book.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class Book extends React.Component {
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