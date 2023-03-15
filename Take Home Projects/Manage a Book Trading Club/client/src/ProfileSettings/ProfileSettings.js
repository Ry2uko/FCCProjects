import './ProfileSettings.sass';
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import $ from 'jquery';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class ProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      placeholderImage: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
    };

    this.avatarUrl = null;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.chooseOption = this.chooseOption.bind(this);
    this.handleDiscardBtn = this.handleDiscardBtn.bind(this);
    this.handleSaveBtn = this.handleSaveBtn.bind(this);
    this.handleBackBtn = this.handleBackBtn.bind(this);
    this.renderStateData = this.renderStateData.bind(this);
  }

  handleBackBtn() {
    this.props.navigate('/profile');
  }

  handleDiscardBtn() {
    this.props.navigate('/profile');
  }

  handleSaveBtn() {
    const updateObj = {
      id: this.props.user.id
    };

    updateObj.hide_location = this.state.user.hide_location;
    updateObj.username = this.state.user.username;
    updateObj.avatar_url = this.state.user.avatar_url;
    updateObj.bio = this.state.user.bio;
    updateObj.location = this.state.user.location;

    $.ajax({
      method: 'PUT',
      url: '/users',
      data: updateObj,
      success: () => {
        this.renderStateData();
      },
      error: resp => {
        const errMsg = resp.responseJSON.error;
        alert('Failed to save: ' + errMsg);
      }
    });
  }

  chooseOption(option) {
    $('.hide-location-option').removeClass('active');
    $(`#hideLocation${option}`).addClass('active');
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        hide_location: option.toLowerCase() === 'yes' ? true : false
      }
    }));
  }

  handleImageError() {
    this.setState({ imageError: true });
  }

  handleInputChange(prop, evnt) {
    this.setState(prevState => ({
      user: {
        ...prevState.user,
        [prop]: $(evnt.target).val()
      }
    }));
  }

  renderStateData() {
    this.setState({ user: null });

    getData(`/users?id=${this.props.user.id}`).then(({ user }) => {
      this.setState({ user });

      this.avatarUrl = user.avatar_url;
    });
  }

  componentDidMount() {
    this.renderStateData();
  }

  render() {
    if (this.state.user === null) {
      return (
        <div className="parent-container">
          <div className="ProfileSettings-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">Settings</h2>
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
        <div className="ProfileSettings parent-container">
          <div className="ProfileSettings-header-container">
            <button type="button" id="backBtn" onClick={this.handleBackBtn}><i className="fa-solid fa-caret-left"></i></button>
            <h2 className="header-title">Settings</h2>
          </div>
          <div className="settings-container">
            <div className="input-container">
              <label htmlFor="usernameInput" className="input-label">Username</label>
              <input type="text" id="usernameInput" className="settings-text-input" autoComplete="off" value={this.state.user.username} onChange={(e) => this.handleInputChange('username', e)} />
            </div>
            <div className="input-container">
              <label htmlFor="bioInput" className="input-label">About</label>
              <textarea id="bioInput" className="settings-textarea-input" autoComplete="off" spellCheck="false"  onChange={(e) => this.handleInputChange('bio', e)} value={this.state.user.bio}></textarea>
            </div>
            <div className="input-container">
              <label htmlFor="locationInput" className="input-label">Location</label>
              <input type="text" id="locationInput" className="settings-text-input" autoComplete='off' value={this.state.user.location}  onChange={(e) => this.handleInputChange('location', e)}/>
            </div>
            <div className="input-hide-location-container">
              <label className="input-label">Hide location?</label>
              <div className="hide-location-options-container">
                <button type="button" className={this.state.user.hide_location ? `hide-location-option active` : `hide-location-option`} id="hideLocationYes" onClick={() => this.chooseOption('Yes')}>Yes</button>
                <button type="button" className={!this.state.user.hide_location ? `hide-location-option active` : `hide-location-option`} id="hideLocationNo" onClick={() => this.chooseOption('No')}>No</button>
              </div>
            </div>
            <div className="input-container">
              <label htmlFor="avatarUrlInput" className="input-label">Avatar Url</label>
              <input type="text" id="avatarUrlInput" className="settings-text-input" autoComplete='off' value={this.state.user.avatar_url}  onChange={(e) => this.handleInputChange('avatar_url', e)}/>
            </div>
            <div className="avatar-preview">
              <div className="avatar-container">
                <img alt="User Avatar" src={this.avatarUrl} id="userAvatarPreview" onError={this.handleImageError} />
              </div>
            </div>
            <div className="input-error-container">
              <span className="input-error">This quick brown fox ran over the brown dog.</span>
            </div>
            <div className="settings-btn-container">
              <button type="button" className="settings-btn" id="discardBtn" onClick={this.handleDiscardBtn}>Discard</button>
              <button type="button" className="settings-btn" id="saveBtn" onClick={this.handleSaveBtn}>Save</button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  let { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user) navigate('/books', { replace: true });
  }, [props.user]);

  return (
    <ProfileSettings user={props.user} navigate={navigate} navState={state} />
  );
}