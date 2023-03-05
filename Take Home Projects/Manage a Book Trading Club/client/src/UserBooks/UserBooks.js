import './UserBooks.sass';
import React from 'react';

class UserBooks extends React.Component {
  render() {
    return <h1>UserBooks</h1>;
  }
}

export default function WithRouter(props) {
  return (
    <UserBooks type={props.type} />
  );
}