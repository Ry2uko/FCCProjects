import './UserRequests.sass';
import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
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
      renderType: 'pending',
      requestsByUser: null,
      requestsToUser: null,
      users: null
    }

    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.handleOpenRequest = this.handleOpenRequest.bind(this);
    this.handleFilterPendingNav = this.handleFilterPendingNav.bind(this);
    this.handleFilterIncomingNav = this.handleFilterIncomingNav.bind(this);
    this.renderState = this.renderState.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }

  handleImageError(evnt) {
    $(evnt.target).attr('src', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');
  }

  renderState() {
    this.setState({ requestsByUser: null, requestsToUser: null });

    let routeA = this.props.type === 'profile' 
    ? `/requests?userA=${this.props.user.username}`
    : `/requests?userA=${this.props.username}`;
    let routeB = this.props.type === 'profile' 
    ? `/requests?userB=${this.props.user.username}`
    : `/requests?userB=${this.props.username}`;

    getData(routeA).then(({ requests }) => {
      this.setState({ requestsByUser: requests });
    });

    getData(routeB).then(({ requests }) => {
      this.setState({ requestsToUser: requests });
    });

    getData('/users').then(({ users }) => {
      this.setState({ users });
    });
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

  handleFilterPendingNav() {
    $('.navbar-btn').removeClass('active');
    $('#pendingRequestsNav').addClass('active');
    this.renderState();
    this.setState({ renderType: 'pending' });
  }

  handleFilterIncomingNav() {
    $('.navbar-btn').removeClass('active');
    $('#incomingRequestsNav').addClass('active');
    this.renderState();
    this.setState({ renderType: 'incoming' });
  }

  handleOpenRequest(requestId, evnt) {
    if ($(evnt.target).hasClass('request-user-name')) return;
    let route = this.props.type === 'profile' ? '/profile/requests' : `/user/${this.props.username}/requests`;

    this.props.navigate(`/request/${requestId}`, { state: { route } });
  }

  componentDidMount() {
    this.renderState();

    // Default
    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.requestsByUser === null || this.state.requestsToUser === null || this.state.users === null) {
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
          <div className="requests-container">
            <div className="btn-navbar-container">
              <button type="button" id="pendingRequestsNav" className="navbar-btn active" onClick={this.handleFilterPendingNav}>Pending</button>
              <button type="button" id="incomingRequestsNav" className="navbar-btn" onClick={this.handleFilterIncomingNav}>Incoming</button>
            </div>
            <div className="main-requests-container">
              <span className="loading-container">
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </span>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="UserRequests parent-container">
          <div className="UserRequests-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            { this.props.type === 'profile' ? (
              <h2 className="header-title">My Requests</h2>
            ) : (
              <h2 className="header-title">{this.props.username}'s Requests</h2>
            )}
          </div>
          <div className="requests-container">
            <div className="btn-navbar-container">
              <button type="button" id="pendingRequestsNav" className="navbar-btn active" onClick={this.handleFilterPendingNav}>Pending</button>
              <button type="button" id="incomingRequestsNav" className="navbar-btn" onClick={this.handleFilterIncomingNav}>Incoming</button>
            </div>
            <div className="main-requests-container">
              {
                this.state.renderType === 'pending' ? (
                  this.state.requestsByUser.length > 0 ? (
                    this.state.requestsByUser.map((request, index) => {
                      let targetUser = this.state.users.find(user => user.username === request.userB);
                      return (
                        <div className="request-container" key={index} onClick={(e) => {this.handleOpenRequest(request._id.toString(), e)}}>
                          <div className="request-header-container">
                            <div className="header-image-container">
                              <img src={targetUser.avatar_url} className="request-user-image" alt="user-avatar" onError={(e) => this.handleImageError(e)}/>
                            </div>
                            <Link className="request-user-name" to={
                              this.props.user ? (
                                this.props.user.username === targetUser.username ? (
                                  `/profile`
                                ) : (
                                  `/user/${targetUser.username}`
                                )
                              ) : (
                                `/user/${targetUser.username}`
                              )
                            }>{targetUser.username}</Link>
                          </div>
                          <div className="request-info-container">
                            <span className="requested-on">Requested on {request.requested_on}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    this.props.type === 'profile' ? (
                      <span className="error-text">You don't have any requests yet</span>
                    ) : (
                      <span className="error-text">User doesn't have any requests yet</span>
                    )
                  )
                ) : (
                  this.state.requestsToUser.length > 0 ? (
                    this.state.requestsToUser.map((request, index) => {
                      let targetUser = this.state.users.find(user => user.username === request.userA);
                      return (
                        <div className="request-container" key={index} onClick={(e) => {this.handleOpenRequest(request._id.toString(), e)}}>
                          <div className="request-header-container">
                            <div className="header-image-container">
                              <img src={targetUser.avatar_url} className="request-user-image" alt="user-avatar" onError={(e) => this.handleImageError(e)} />
                            </div>
                            <Link className="request-user-name" to={
                              this.props.user ? (
                                this.props.user.username === targetUser.username ? (
                                  `/profile`
                                ) : (
                                  `/user/${targetUser.username}`
                                )
                              ) : (
                                `/user/${targetUser.username}`
                              )
                            }>{targetUser.username}</Link>
                          </div>
                          <div className="request-info-container">
                            <span className="requested-on">Requested on {request.requested_on}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    this.props.type === 'profile' ? (
                      <span className="error-text">You don't have any incoming requests</span>
                    ) : (
                      <span className="error-text">User doesn't have any incoming requests</span>
                    )
                  )
                )
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  let { username } = useParams();
  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      if (username === props.user.username) {
        navigate('/profile/requests', { replace: true });
        return;
      }
    }
  }, [navigate, username, props.user]);

  return (
    <UserRequests type={props.type} user={props.user} navigate={navigate} username={username} navState={state} />
  );
}