import './User.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class User extends React.Component {
  render() {
    return (
      <div className="User">
        <h1>Users</h1>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <User navigate={navigate} />
  );
}