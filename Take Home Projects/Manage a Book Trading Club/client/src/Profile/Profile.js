import './Profile.sass';
import { useNavigate } from 'react-router-dom';
import React, { useRef } from 'react';
import $ from 'jquery';

async function getUser() {
  const response = await fetch('/auth');
  const userObj = await response.json();
  return userObj;
}

class Main extends React.Component {
  componentDidMount() {
    $('a.nav-link.active').removeClass('active');
  }
  render() {
    return (
      <div className="Main">
        
      </div>
    )
  }
}

export default function Profile(props) {
  let componentRender = useRef();

  switch (props.type) {
    default:
      componentRender.current = <Main />;
  }

  return (
    <div className="Profile">
      { componentRender.current }
    </div>
  );
}
