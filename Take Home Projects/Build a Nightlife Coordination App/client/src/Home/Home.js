import './Home.sass';
import { Link, useNavigate} from 'react-router-dom';  
import React, { useState } from 'react';
import $ from 'jquery';
import StarRatings from 'react-star-ratings';

function SearchContent(props) {  
  return (
    <div className="SearchContent">
      <div className="search-container">
        <h2><i className="fa-solid fa-martini-glass"></i> Plans Tonight?</h2>          
        <div className="location-form">
          <input type="text" id="location-input" placeholder="Enter location" onKeyUp={props.handleInputKeyUp} />
          <button type="button" id="location-btn" onClick={props.handleSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
        </div>
      </div>
      <p className="footer-credits">Powered by <a href="https://fusion.yelp.com/" target="_blank" rel="noreferrer">Yelp</a></p>
    </div>
  );
}

function BusinessesContent(props) {
  const [starDimension] = useState('20px');

  const businesses = props.data.businesses;
  
  const handleMarkBusiness = (e) => {

    const businessInfo = $(e.target).parents('.business-info');
    const location = businessInfo.find('.business-title').text(),
    locationLink = businessInfo.parents('.business-container').attr('url');

    $('.markBusinessBtn').attr('class', 'markBusinessBtn');
    $('.mark-button-icon').attr('class', 'fa-solid fa-location-dot mark-button-icon');

    $(e.target).attr('class', 'markBusinessBtn disabled');
    $(e.target).find('.mark-button-icon').attr('class', 'fa-solid fa-check mark-button-icon');
    $('.user-status').html(`Status: going to 
      <b><a href="${locationLink}" target="_blank"
      rel="noreferrer">${location}</a></b>
      <button type="button" id="clearDestinationBtn">
        <i class="fa-solid fa-xmark"></i>
      </button>
    `);

    $('#clearDestinationBtn').on('click', () => {
      $('.user-status').html(`Status: <b>None</b>`);
      if ($('.BusinessesContent').length) {
        $('.markBusinessBtn').attr('class', 'markBusinessBtn');
        $('.mark-button-icon').attr('class', 'fa-solid fa-location-dot mark-button-icon');
      }

      $.ajax({
        method: 'PUT',
        url: '/api',
        data: { 
          location: '', 
          locationLink: '',
          clear: true
          },
        error: resp => {
          console.error(resp.responseJSON.error);
        }
      });
    });

    $.ajax({
      method: 'PUT',
      url: '/api',
      data: { location, locationLink },
      error: resp => {
        console.error(resp.responseJSON.error);
      }
    });
  }

  return (
    <div className="BusinessesContent">
      <button type="button" id="searchAgainBtn" onClick={props.handleSearchAgain}><i className="fa-solid fa-caret-left"></i> Search Again</button>
      <div className="businesses-container">  
        {businesses.map((b, i) => {
          return (
            <div className="business-container" key={i} url={b.url}>
              <div className="business-image">
                <img src={b.image_url} alt="business" />
              </div>
              <div className="business-info">
                <h4 className="business-title"><a href={b.url} target="_blank" rel="noreferrer">{b.name}</a></h4>

                <div className="ratings-container">
                  <span className="business-rating">{b.rating}</span>
                  <span className="business-ratings-stars">
                    <StarRatings 
                      rating={b.rating}
                      starDimension={starDimension}
                      starSpacing='0px'
                      starEmptyColor="#7D8287"
                      starRatedColor="#FDD663"
                    />
                  </span>
                  <span className="business-review-count">({b.review_count})</span>
                  <span className="business-price">· ${b.price}</span>
                </div>

                <div className="location-container">
                  <span className="business-address">
                    {`${b.location.display_address[0]} · ${b.location.display_address[1]}`}
                  </span>
                </div>

                <div className="is-closed-container">
                  { b.is_closed ? (
                      <span className="business-is-closed">
                        Closed
                      </span>
                    ) : null
                  }
                </div>

                <div className="transactions-container">
                  <span className="business-transactions">
                    {b.transactions.map((t, i) => {
                      if (i === 0) return t;
                      return ` · ${t}`;
                    })}
                  </span>
                </div>

                <button type="button" className={props.authed ? 'markBusinessBtn' : 'markBusinessBtn disabled'} 
                title="Mark Business" onClick={e => handleMarkBusiness(e)}>
                  <i className="fa-solid fa-location-dot mark-button-icon"></i>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

class Home extends React.Component {
  constructor (props) {
    super(props);

    this.handleInputKeyUp = this.handleInputKeyUp.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSearchAgain = this.handleSearchAgain.bind(this);
    this.handleToggleDropdown = this.handleToggleDropDown.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
    
    this.state = {
      authed: false,
      user: null,
      contentComponent: <SearchContent 
      handleSearch={this.handleSearch} 
      handleInputKeyUp={this.handleInputKeyUp} />
    };
      
  }

  handleInputKeyUp(e) {
    if (e.key === 'Enter') { this.handleSearch(); }
  }

  handleSearchAgain() {
    this.setState({
      contentComponent: <SearchContent 
      handleSearch={this.handleSearch} 
      handleInputKeyUp={this.handleInputKeyUp} />
    });
  }

  handleSearch() {
    const location = $('#location-input').val();

    if (location === '') return;

    $.ajax({
      method: 'POST',
      url: '/api',
      data: { location },
      success: body => { 
        this.setState({
          contentComponent: <BusinessesContent 
          data={body} 
          handleSearchAgain={this.handleSearchAgain} 
          authed={this.state.authed} />
        });
      },
      error: resp => {
        alert(resp.responseJSON.error);
      }
    });
  }

  handleLogIn() {
    this.props.navigate('/login', { replace: false });
  }

  handleToggleDropDown() {
    if ($('.user-dd-container').css('display') === 'none') {
      $('.user-dd-container').slideDown(275).css('display', 'flex');
      $(document).on('click', e => {
        if ($('.user-dd-container').has(e.target).length || $('#toggleDropDownBtn').is(e.target)) return;
        $('.user-dd-container').slideUp(275);
      });
    } else {
      $('.user-dd-container').slideUp(275);
      $(document).off('click');
    }

  }

  handleLogOut() {
    const navigate = this.props.navigate;
    $.ajax({
      method: 'POST',
      url: '/logout',
      data: {},
      error: resp => {
        console.log(resp);
        alert(`Failed to Logout: ${resp.responseJSON.error}`);
      },
      complete: () => {
        navigate(0);
      }
    });
  }

  componentDidMount() {
    $.ajax({
      method: 'GET',
      url: '/auth',
      success: data => { 
        this.setState({
          authed: true,
          user: data.user
        });

        if (data.user.destination !== '') {
          $('.user-status').html(`Status: going to 
            <b><a href="${data.user.destination_link}" target="_blank"
            rel="noreferrer">${data.user.destination}</a></b>
            <button type="button" id="clearDestinationBtn">
              <i class="fa-solid fa-xmark"></i>
            </button>
          `);

          $('#clearDestinationBtn').on('click', () => {
            $('.user-status').html(`Status: <b>None</b>`);

            if ($('.BusinessesContent').length) {
              $('.markBusinessBtn').attr('class', 'markBusinessBtn');
              $('.mark-button-icon').attr('class', 'fa-solid fa-location-dot mark-button-icon');
            }

            $.ajax({
              method: 'PUT',
              url: '/api',
              data: { 
                location: '', 
                locationLink: '',
                clear: true
               },
              error: resp => {
                console.error(resp.responseJSON.error);
              }
            });
          });

        }
      }
    });

  }
  
  render() {
    return (
      <div className="Home">
        <div className="home-header">
          <h1 className="title"><Link to="/">NIGHTSURFER</Link></h1>
          { this.state.authed 
          ? (
            <div className="user-authed-dd">
              <button type="button" id="toggleDropDownBtn" onClick={this.handleToggleDropDown}>{this.state.user.username} <i className="fa-solid fa-angle-down"></i></button>
              <div className="user-dd-container">
                <button type="button" id="logOutBtn" onClick={this.handleLogOut}>Logout</button>
                <div className="status-container">
                  <span className="user-status">Status: <b>None</b></span>
                </div>
              </div>
            </div>
          )
          : (
          <div className="login-container">
            <button type="button" id="loginBtn" onClick={this.handleLogIn}>Login</button> 
          </div>
          ) }
        </div>
        { this.state.contentComponent }
      </div>
    );
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <Home navigate={navigate} />
  );
}