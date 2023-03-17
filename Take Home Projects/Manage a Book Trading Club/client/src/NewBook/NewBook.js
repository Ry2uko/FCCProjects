import './NewBook.sass';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import $ from 'jquery';

async function getData(route) {
  const response = await fetch(route);
  const dataObj = await response.json();

  return dataObj;
}

class NewBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      book: null,
      createLock: false
    };

    this.handleDiscardBtn = this.handleDiscardBtn.bind(this);
    this.handleCreateBtn = this.handleCreateBtn.bind(this);
    this.renderStateData = this.renderStateData.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleBookConditionOption = this.handleBookConditionOption.bind(this);
  }

  handleBookConditionOption(condition) {
    $('.book-condition-option').removeClass('active');
    if (condition === '') $(`.NotSpecified-condition`).addClass('active');
    else $(`.${condition.split(' ').join('')}-condition`).addClass('active');
    this.setState(prevState => ({
      book: {
        ...prevState.book,
        condition 
      }
    }));
  }

  handleDiscardBtn() {
    this.props.navigate('/books');
  }

  handleCreateBtn() {
    if (this.state.createLock) return;
    this.setState({ createLock: true });

    const updateObj = {
      user: this.state.book.user,
      title: this.state.book.title,
      author: this.state.book.author,
      condition: this.state.book.condition
    }

    $.ajax({
      method: 'POST',
      url: '/books',
      data: updateObj,
      success: book => {
        this.props.navigate(`/book/${book._id.toString()}`, { state: { route: '/new/book' } });
      }, 
      error: resp => {
        const errMsg = resp.responseJSON.error;
        $('.input-error').text(errMsg);
        $('.input-error-container').css('display', 'block');
        this.setState({ createLock: false });
      }
    })
    return;
  }

  renderStateData() {
    this.setState({ user: null, book: null, createLock: false });

    getData(`/users?id=${this.props.user.id}`).then(({ user }) => {
      this.setState({ 
        user,
        book: { // possible inputs
          user: user.username,
          title: '',
          author: '',
          condition: ''
        }
      });
    });
  }

  handleInputChange(prop, evnt) {
    this.setState(prevState => ({
      book: {
        ...prevState.book,
        [prop]: $(evnt.target).val()
      }
    }));
  }

  componentDidMount() {
    this.renderStateData();

    $('a.nav-link.active').removeClass('active');
    $('.user-dropdown-content').css('display', 'none');
  }

  render() {
    if (this.state.user === null) {
      return (
        <div className="parent-container">
          <div className="NewBook-header-container">
            <h1 className="header-title">New Book</h1>
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
        <div className="NewBook parent-container">
          <div className="NewBook-header-container">
            <h1 className="header-title">New Book</h1>
          </div>
          <div className="book-form-container">
            <div className="input-container">
              <label htmlFor="titleInput" className="input-label">Title</label>
              <input type="text" id="titleInput" className="settings-text-input" autoComplete="off" value={this.state.book.title} onChange={(e) => this.handleInputChange('title', e)} />
            </div>
            <div className="input-container">
              <label htmlFor="authorInput" className="input-label">Author <span className="sub-text">(optional)</span></label>
              <input type="text" id="authorInput" className="settings-text-input" autoComplete="off" value={this.state.book.author} onChange={(e) => this.handleInputChange('author', e)} />
            </div>
            <div className="book-conditions-container input-container">
              <label className="input-label">Book Condition</label>
              <div className="book-conditions-options">
                <div className="book-condition-option NotSpecified-condition active" onClick={() => {this.handleBookConditionOption('')}}>
                  <span className="book-condition">Not Specified</span>
                </div>
                <div className="book-condition-option Excellent-condition" onClick={() => {this.handleBookConditionOption('Excellent')}}>
                  <span className="book-condition">Excellent</span>
                </div>
                <div className="book-condition-option VeryGood-condition" onClick={() => {this.handleBookConditionOption('Very Good')}}>
                  <span className="book-condition">Very Good</span>
                </div>
                <div className="book-condition-option Good-condition" onClick={() => {this.handleBookConditionOption('Good')}}>
                  <span className="book-condition">Good</span>
                </div>
                <div className="book-condition-option Fair-condition" onClick={() => {this.handleBookConditionOption('Fair')}}>
                  <span className="book-condition">Fair</span>
                </div>
                <div className="book-condition-option Poor-condition" onClick={() => {this.handleBookConditionOption('Poor')}}>
                  <span className="book-condition">Poor</span>
                </div>
              </div>
            </div>
            <div className="input-error-container">
              <span className="input-error">@Hacked By Ry2uko :P</span>
            </div>
            <div className="book-form-btn-container">
              <button type="button" id="discardBtn" onClick={this.handleDiscardBtn} className="book-form-btn">Discard</button>
              <button type="button" id="createBtn" onClick={this.handleCreateBtn} className="book-form-btn">Create</button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default function WithRouter(props) {
  const navigate = useNavigate();

  return (
    <NewBook user={props.user} navigate={navigate} />
  )
}