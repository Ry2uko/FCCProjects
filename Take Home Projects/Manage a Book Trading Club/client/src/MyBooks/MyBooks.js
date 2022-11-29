import './MyBooks.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class MyBooks extends React.Component {
  render() {
    return (
      <div className="MyBooks">
        <h1>My Books</h1>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <MyBooks navigate={navigate} />
  );
}