import './UserRequests.sass';
import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import $ from 'jquery';

// no requests yet

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class UserRequests extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requestsByUser: null,
      requestsToUser: null
    }

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenRequestBtn = this.handleOpenRequestBtn.bind(this);
  }

  handleBackBtn() {
    let route;
    if (this.props.navState) route = this.props.navState.route;

    if (route) {
      this.props.navigate(route);
    } else {
      if (this.props.type === 'profile') this.props.navigate('/profile');
      else this.props.navigate(`/user/${this.props.username}`);
    }
  }

  handleOpenRequestBtn(requestId) {
    return;
  }

  componentDidMount() {
    let routeA = this.props.type === 'profile' 
    ? `/requests?userA=${this.props.user.username}`
    : `/requests?userA=${this.props.username}`;
    let routeB = this.props.type === 'profile' 
    ? `/requests?userB=${this.props.user.username}`
    : `/requests?userB=${this.props.username}`;

    getData(routeA).then(({ requests }) => {
      this.setState({ requestsByUser: requests });
      console.log(this.state);
    });
    getData(routeB).then(({ requests }) => {
      this.setState({ requestsToUser: requests });
      console.log(this.state);
    });

    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.requestsByUser === null || this.state.requestsToUser === null) {
      return (
        <div className="parent-container">
          <div className="UserRequests-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            { this.props.type === 'profile' ? (
              <h2 className="header-title">My Requests</h2>
            ) : (
              <h2 className="header-title">{this.props.username}'s Requests</h2>
            )}
          </div>
          <span className="loading-container">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </span>
        </div>
      );
    } else {
      return (
        <div className="UserRequests parent-container">

        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  if (props.user) {
    if (username === props.user.username) {
      navigate('/profile/requests', { replace: true });
      return;
    }
  }

  return (
    <UserRequests type={props.type} user={props.user} navigate={navigate} username={username} navState={state} />
  );
}