import './Form.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.handleGithubLogIn = this.handleGithubLogIn.bind(this);
  }

  handleGithubLogIn() {
    window.location.replace('http://localhost:1010/auth/github');
  }

  render() {
    return (
      <div className="Form">
        <h1 className="form-title">Login</h1>
        <div className="form-container">
          <div className="button-group-container" id="githubLogInBtn" onClick={this.handleGithubLogIn}>
            <div className="logo-container">
              <i className="fa-brands fa-github"></i>
            </div>
            <div className="text-container">
              <span>Sign in with Github</span>
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
    <Form  navigate={navigate} />
  );
}