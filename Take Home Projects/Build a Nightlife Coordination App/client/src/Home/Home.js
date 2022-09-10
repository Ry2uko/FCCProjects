import './Home.sass';
import { Link, useNavigate } from 'react-router-dom';  

export default function Home(props) {
  const navigate = useNavigate();

  const handleLogIn = () => {
    navigate('/login', { replace: false });
  }

  const handleInputKeyUp = e => {
    if (e.key === 'Enter') { this.handleSearch(); }
  }

  const handleSearch = () => {
    return;
  }

  return (
    <div className="Home">
      <div className="home-header">
        <h1 className="title"><Link to="/">NIGHTSURFER</Link></h1>
        { (props.authenticated === 'true') ? null : <button type="button" id="loginBtn" onClick={handleLogIn}>Login</button> }
      </div>
      <div className="home-content">
        <div className="search-container">
          <h2><i className="fa-solid fa-martini-glass"></i> Plans Tonight?</h2>          
          <div className="location-form">
            <input type="text" id="location-input" placeholder="Enter location" onKeyUp={handleInputKeyUp} />
            <button type="button" id="location-btn" onClick={handleSearch}><i className="fa-solid fa-magnifying-glass"></i></button>
          </div>
        </div>
      </div>
      <p className="footer-credits">Powered by <a href="https://fusion.yelp.com/" target="_blank" rel="noreferrer">Yelp</a></p>
    </div>
  );
}
