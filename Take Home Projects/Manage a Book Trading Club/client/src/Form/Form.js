import './Form.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';

class Form extends React.Component {
  render() {
    return (
      <div className="Form">
        <h1>Form</h1>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <Form  navigate={navigate} />
  );
}