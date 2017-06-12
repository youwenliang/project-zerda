import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BrowserChrome/>
        <div id="content">
          {/* <iframe src="https://www.google.com"></iframe>*/}
        </div>
      </div>
    );
  }
}


class BrowserChrome extends Component {
  render() {
    return (
      <div className="nav">
        <div id="search-area">
          <div id="search"><i className="material-icons">search</i></div>
          <input name="url" type="text" placeholder="Search or enter address" spellCheck="false"/>
        </div>
        <div id="control-area">
          <div className="nav-button" id="tabs">
            <i className="material-icons">check_box_outline_blank</i>
            <span id="tab-count">1</span>
          </div>
          <div className="nav-button" id="menu"><i className="material-icons">more_vert</i></div>
          <div className="nav-button" id="mic"><i className="material-icons">mic</i></div>
          <div className="nav-button" id="close"><i className="material-icons">close</i></div>
        </div>
      </div>
    );
  }
}

export default App;
