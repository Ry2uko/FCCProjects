import './User.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class User extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/users"]').attr('class', 'nav-link active');
  }
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