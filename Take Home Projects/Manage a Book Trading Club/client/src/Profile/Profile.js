import './Profile.sass';
import React, { useRef } from 'react';
import $ from 'jquery';

class Main extends React.Component {
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
