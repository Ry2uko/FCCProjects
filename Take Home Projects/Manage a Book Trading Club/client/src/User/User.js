import './User.sass';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import $ from 'jquery';

class User extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
    $('a.nav-link[href="/users"]').attr('class', 'nav-link active');
  }
  render() {
    return (
      <div className="User">
        <div className="title-banner">
          <h1 className="title">Users</h1>
        </div>
        <div className="users-container">
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn" title="Books"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn" title="Trades"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span className="user-name">Ry2uko</span><span className="user-location-container">from <span className="user-location">Philippines</span></span></h4>
            <p className="user-bio">Just a developer for fun.</p>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span class="user-name">Ry2ukoAlt</span><span className="user-location-container">from <span className="user-location">Philipinas</span></span></h4>
            <p className="user-bio">The quick brown fox jumped over the lazy dog but if the dog barked was it lazy? Oh and the quick yellow fox ran over the cute little puppy named Chikinini. TOUHNEOHNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSEUOAHNSTAEUOHNSAEUO AEUHTRO SAEUO HTNSAEUHNO SAEUHTNO SAEUHTNO SAEUO HTNSAEUOHTNSAEUHNOSTAEUHTNOSAEUOHNSEUAO HNSAEUO HTNSAEUO HTNSAEUO HTNSAEUO HNS</p>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span class="user-name">Ry2ukoAlt</span><span className="user-location-container">from <span className="user-location">Philipinas</span></span></h4>
            <p className="user-bio">The quick brown fox jumped over the lazy dog but if the dog barked was it lazy? Oh and the quick yellow fox ran over the cute little puppy named Chikinini. TOUHNEOHNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSEUOAHNSTAEUOHNSAEUO AEUHTRO SAEUO HTNSAEUHNO SAEUHTNO SAEUHTNO SAEUO HTNSAEUOHTNSAEUHNOSTAEUHTNOSAEUOHNSEUAO HNSAEUO HTNSAEUO HTNSAEUO HTNSAEUO HNS</p>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span class="user-name">Ry2ukoAlt</span><span className="user-location-container">from <span className="user-location">Philipinas</span></span></h4>
            <p className="user-bio">The quick brown fox jumped over the lazy dog but if the dog barked was it lazy? Oh and the quick yellow fox ran over the cute little puppy named Chikinini. TOUHNEOHNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSEUOAHNSTAEUOHNSAEUO AEUHTRO SAEUO HTNSAEUHNO SAEUHTNO SAEUHTNO SAEUO HTNSAEUOHTNSAEUHNOSTAEUHTNOSAEUOHNSEUAO HNSAEUO HTNSAEUO HTNSAEUO HTNSAEUO HNS</p>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span class="user-name">Ry2ukoAlt</span><span className="user-location-container">from <span className="user-location">Philipinas</span></span></h4>
            <p className="user-bio">The quick brown fox jumped over the lazy dog but if the dog barked was it lazy? Oh and the quick yellow fox ran over the cute little puppy named Chikinini. TOUHNEOHNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSEUOAHNSTAEUOHNSAEUO AEUHTRO SAEUO HTNSAEUHNO SAEUHTNO SAEUHTNO SAEUO HTNSAEUOHTNSAEUHNOSTAEUHTNOSAEUOHNSEUAO HNSAEUO HTNSAEUO HTNSAEUO HTNSAEUO HNS</p>
          </div>
          <div className="user-tile">
            <div className="user-btn-container">
              <button type="button" className="user-btn user-books-btn"><i class="fa-solid fa-book"></i></button>
              <button type="button" className="user-btn user-trades-btn"><i class="fa-solid fa-right-left"></i></button>
            </div>
            <h4 className="user-name-container"><span class="user-name">Ry2ukoAlt</span><span className="user-location-container">from <span className="user-location">Philipinas</span></span></h4>
            <p className="user-bio">The quick brown fox jumped over the lazy dog but if the dog barked was it lazy? Oh and the quick yellow fox ran over the cute little puppy named Chikinini. TOUHNEOHNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSAEUOHTNSEUOAHNSTAEUOHNSAEUO AEUHTRO SAEUO HTNSAEUHNO SAEUHTNO SAEUHTNO SAEUO HTNSAEUOHTNSAEUHNOSTAEUHTNOSAEUOHNSEUAO HNSAEUO HTNSAEUO HTNSAEUO HTNSAEUO HNS</p>
          </div>
        </div>
      </div>
    );
  }
}


export default function WithRouter(props) {
  const navigate = useNavigate();
  return (
    <User navigate={navigate} />
  );
}