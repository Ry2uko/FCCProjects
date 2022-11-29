import './NewRequest.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class NewRequest extends React.Component {
  render() {
    return (
      <div className="NewRequest">
        <h1>New Request</h1>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <NewRequest navigate={navigate} />
  );
}