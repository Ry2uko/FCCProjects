import './User.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

async function getUsers() {
  const response = await fetch('/users');
  const usersObj = await response.json();
  return usersObj.users;
}

class User extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
    };
    
    this.handleUserBooksBtn = this.handleUserBooksBtn.bind(this);
    this.handleUserTradesBtn = this.handleUserTradesBtn.bind(this);
    this.handleUserRequestsBtn = this.handleUserRequestsBtn.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }

  handleImageError(evnt) {
    $(evnt.target).attr('src', 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png');
  }

  handleUserRequestsBtn(evnt) {
    const targetUserId = parseInt($(evnt.target).parents('.user-tile').attr('userid'));

    if (this.props.user) {
      if (targetUserId === parseInt(this.props.user.id)) return this.props.navigate('/profile/requests',  { state: { route: '/users' }});
    }

    const targetUser = this.state.users.find(user => user.id === targetUserId);
    this.props.navigate(`/user/${targetUser.username}/requests`, { state: { route: '/users' }}); 
    return;
  }

  handleUserBooksBtn(evnt) {
    const targetUserId = parseInt($(evnt.target).parents('.user-tile').attr('userid'));

    if (this.props.user) {
      if (targetUserId === parseInt(this.props.user.id)) return this.props.navigate('/profile/books',  { state: { route: '/users' }});
    }

    const targetUser = this.state.users.find(user => user.id === targetUserId);
    this.props.navigate(`/user/${targetUser.username}/books`, { state: { route: '/users' }}); 
  }

  handleUserTradesBtn(evnt) {
    const targetUserId = parseInt($(evnt.target).parents('.user-tile').attr('userid'));

    if (this.props.user) {
      if (targetUserId === parseInt(this.props.user.id)) return this.props.navigate('/profile/trades', { state: { route: '/users' } });
    }

    const targetUser = this.state.users.find(user => user.id === targetUserId);
    this.props.navigate(`/user/${targetUser.username}/trades`, { state: { route: '/users' } });
  }

  componentDidMount() {
    getUsers().then(users => {
      this.setState({ users });
    });
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/users"]').attr('class', 'nav-link active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.users == null) {
      return (
        <div className="parent-container">
          <div className="title-banner">
            <h1 className="title">Users</h1>
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
        <div className="User parent-container">
          <div className="title-banner">
            <h1 className="title">Users</h1>
          </div>
          <div className="users-container">
            { this.state.users.map((user, index) => {
              return (
                <div className="user-tile" userid={user.id.toString()} key={index}>
                  <div className="user-info-main-container">
                    <div className="user-title-container">
                      <div className="user-image-container">
                        <img src={user.avatar_url} className="user-avatar" alt="User Avatar" onError={(e) => this.handleImageError(e)}/>
                      </div>
                      <h4 className="user-name-container">
                        { this.props.user ? (
                          this.props.user.username === user.username ? <a className="user-name" href="/profile">{user.username}</a> 
                          : <a className="user-name" href={ `/user/${user.username}` }>{user.username}</a>
                        ) : <a className="user-name" href={ `/user/${user.username}` }>{user.username}</a>}
                        { (!user.hide_location && user.location !== '') ? (
                          <span className="user-location-container">
                            from <span className="user-location">{user.location}</span>
                          </span>
                        ) : null }
                      </h4>
                    </div>
                    <p className="user-bio">{user.bio}</p>
                  </div>
                  <div className="user-btn-container">
                    <button type="button" className="user-btn user-books-btn" title="Books" onClick={(e) => this.handleUserBooksBtn(e)}><i className="fa-solid fa-book"></i></button>
                    <button type="button" className="user-btn user-trades-btn" title="Trades" onClick={(e) => this.handleUserTradesBtn(e)}><i className="fa-solid fa-right-left"></i></button>
                    <button type="button" className="user-btn user-trades-btn" title="Requests" onClick={(e) => this.handleUserRequestsBtn(e)}><i className="fa-solid fa-share"></i></button>
                  </div>  
                </div>
              );
            }) }
            
          </div>
        </div>
      );
    }
  }

}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <User navigate={navigate} user={props.user}/>
  );
}