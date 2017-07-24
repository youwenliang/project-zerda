import React, { Component } from "react"

import './App.css'

var onboarding = 1;
var subscribed = [true, true, true];
var sites = [false, false, false, false];
var sites_sub = [false, false, false, false];
var gotit = false;
var globalTimeout = null;
var globalTime = 1000;
var goOnline = false;
var loaded = " load";
var online = "";
var date = ["...","...","...","...","...","...","..."];
var mobile = ["","","",""];

var language = 'id'; // Language EN or ID

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHome: true,
      isSubscribed: false,
      site: "home"
    }
  }

  returnHome = () => {
    this.setState({
      isHome: true,
      isSubscribed: false,
      site: "home"
    });
    goOnline = false;
    mobile = ["","","",""];

    for(var i = 0; i < 4; i++){
      sites[i] = sites_sub[i];
    }
    console.log(sites);
    console.log(sites_sub);

    if(globalTimeout!=null) clearTimeout(globalTimeout);
    document.getElementById('loading-mask').classList.remove('active');
    document.getElementById('online').classList.remove('active');

    if(document.getElementById('site4-page')!=null) document.getElementById('site4-page').classList.remove('next');
    if(document.getElementById('menu-online')!=null) document.getElementById('menu-online').classList.remove('disabled');
    if(document.getElementById('link')!=null) document.getElementById('link').classList.remove('active');
    if(document.getElementById('link-2')!=null) document.getElementById('link-2').classList.remove('active');
  }

  leaveHome = (id) => {
    var site = document.querySelector('#subscribedSites li[data-attr='+id+']');
    if (site == null) {
      site = document.querySelector('li[data-attr='+id+']');
    }
    var flag = false;
    if(site.classList.contains('true')) flag = true;

    this.setState({
      isHome: false,
      isSubscribed: flag,
      site: id,
    });
  }

  subscribe = () => {
    this.setState({
      isHome: this.state.isHome,
      isSubscribed: true,
      site: this.state.site
    }); 
  }

  online = () => {
    goOnline = true;
    this.update();
    console.log(goOnline);
    if(this.state.isSubscribed) {
      document.getElementById('menu-panel').classList.remove('active');
      document.getElementById('mask').classList.add('active');
      document.getElementById('mask').classList.add('none');
      document.getElementById('download-modal').classList.add('active');
    } else {
      window.location.href = window.location.href;
    }
  }

  update = () => {
    this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <Browser isSubscribed = {this.state.isSubscribed} isHome = {this.state.isHome} returnHome = {this.returnHome.bind(this)} />
        <Content site={this.state.site} update = {this.update.bind(this)} leaveHome = {this.leaveHome.bind(this) }/>
        <Menu isSubscribed = {this.state.isSubscribed} isHome = {this.state.isHome} site={this.state.site} subscribe = {this.subscribe.bind(this)} online = {this.online.bind(this)}/>
        <Download update = {this.update.bind(this)} site={this.state.site}/>
        <Settings update = {this.update.bind(this)}/>
        <div id="mask"></div>
        <OnboardingInfo/>
        <div id="loading-mask"></div>
        <div id="highlight"></div>

        <div id="toast">
          {strings.subscribeToast[language]}
        </div>

        <div id="fakepage">
          <div className="url"><i className="material-icons">lock</i>{"http://assets.kompas.com/crop/0x13:1000x680/750x50..."}</div>
          <div className="sites" id="site1-page-fake">
          </div>
        </div>
        <div id="online" onClick = {this.online}></div>
      </div>
    );
  }
}


class OnboardingInfo extends Component {

  dismiss = (e) => {
    document.getElementById('onboarding-info').classList.toggle('active');
    document.getElementById('mask').classList.toggle('active');
    document.getElementById('mask').classList.toggle('none');
    document.getElementById('menu-panel').classList.toggle('active');
    document.getElementById('highlight').classList.toggle('active');
    document.getElementById('menu-subscribe').classList.remove('active');
    document.getElementById('action-refresh').classList.toggle('fade');
    gotit = true;
  }

  render() {
    return (
        <div id="onboarding-info">
          <div id="onboarding-text">
            <h2>{strings.subscribeTitle[language]}</h2>
            <p>{strings.subscribeContent[language]}</p>
          </div>
          <div className="button action" onClick = {this.dismiss}>{strings.subscribeOK[language]}</div>
        </div>
    );
  }
}
class Menu extends Component {

  startSubscribe = () => {
    console.log(sites);
    console.log(sites_sub);
    console.log("!--!");
    var sbutton = document.getElementById('menu-subscribe');
    sbutton.classList.add('subscribed');
    this.props.subscribe();
    sites_sub[this.props.site.split('site')[1] - 1] = true;
    console.log(sites);
    console.log(sites_sub);
    document.getElementById('online').classList.add('active');

    var d = new Date();
    var curr_time = ('0'+d.getHours().toString()).slice(-2)+":"+('0'+d.getMinutes().toString()).slice(-2);
    var curr_date = d.getDate();
    var curr_month = d.getMonth() + 1; //Months are zero based
    var curr_year = d.getFullYear();
    var now = curr_month + "/" + curr_date +"/" + curr_year + " " + curr_time;
    date[this.props.site.split('site')[1] - 1] = now;
  }

  render() {
    let subscribeButton = null;
    let online = null;
    if(this.props.isSubscribed) {
      online = <li id="menu-online" onClick={this.props.online} className={goOnline}><div className="menu-icons"></div><p>{strings.menuOnline[language]}</p></li>
      subscribeButton = <li id="menu-subscribe" className="subscribed"><div className="menu-icons"></div><p>{strings.menuUnsubscribe[language]}</p></li>
    } else if(this.props.isHome) {
      subscribeButton = <li id="menu-subscribe" className="fade"><div className="menu-icons"></div><p>{strings.menuSubscribe[language]}</p></li>
    } else {
      if(!gotit) subscribeButton = <li id="menu-subscribe" className="active" onClick={this.startSubscribe}><div className="menu-icons"></div><p>{strings.menuSubscribe[language]}</p></li>
      else {
        subscribeButton = <li id="menu-subscribe" onClick={this.startSubscribe}><div className="menu-icons"></div><p>{strings.menuSubscribe[language]}</p></li>
      }
    }

    return (
      <div id="menu-panel">
        <ul id="menuList">
          <li id="menu-download">
            <div className="menu-icons"></div>
            <p>{strings.menuDownload[language]}</p>
          </li>
          {subscribeButton}
          <li id="menu-clear">
            <div className="menu-icons"></div>
            <p>{strings.menuClear[language]}</p>
          </li>
          <li id="menu-history">
            <div className="menu-icons"></div>
            <p>{strings.menuHistory[language]}</p>
          </li>
          <li id="menu-share">
            <div className="menu-icons"></div>
            <p>{strings.menuShare[language]}</p>
          </li>
          <li id="menu-addhome">
            <div className="menu-icons"></div>
            <p>{strings.menuAddHome[language]}</p>
          </li>
          <li id="menu-settings">
            <div className="menu-icons"></div>
            <p>{strings.menuSettings[language]}</p>
          </li>
          {online}

        </ul>
        <div id="menu-action">
          <ul>
            <li id="action-back">back</li>
            <li id="action-next">forward</li>
            <li id="action-refresh" onClick={this.props.online}>refresh</li>
            <li id="action-info">info</li>
          </ul>
        </div>
      </div>
    );
  }
}

class Settings extends Component {
  switchLan = () => {
    if(language === 'en') language = 'id';
    else language = 'en';
    this.props.update();
  }

  render() {
    return (
      <div id="settings-panel">
        <nav>
          <span id="settings-close"><i className="material-icons">arrow_back</i></span>
          <span>{strings.settingsTitle[language]}</span>
        </nav>
        <div className="settings-scroll">
          <section>
            <h2>{strings.settingsDataSaving[language]}</h2>
            <div className="toggle">
              <p>{strings.settingsBlock1[language]}</p>
              <input type="checkbox" id="check-1" className="cbx hidden" defaultChecked/>
              <label htmlFor="check-1" className="lbl"></label>
            </div>
            <div className="toggle">
              <p>{strings.settingsBlock2[language]}</p>
              <input type="checkbox" id="check-2" className="cbx hidden" defaultChecked/>
              <label htmlFor="check-2" className="lbl"></label>
            </div>
            <div className="toggle">
              <p>{strings.settingsBlock3[language]}</p>
              <input type="checkbox" id="check-3" className="cbx hidden" />
              <label htmlFor="check-3" className="lbl"></label>
            </div>
            <div className="toggle">
              <p>{strings.settingsBlock4[language]}</p>
              <input type="checkbox" id="check-4" className="cbx hidden" defaultChecked/>
              <label htmlFor="check-4" className="lbl"></label>
            </div>
            <div className="toggle">
              <p>{strings.settingsBlock5[language]}</p>
              <input type="checkbox" id="check-5" className="cbx hidden" />
              <label htmlFor="check-5" className="lbl"></label>
            </div>
          </section>
          <section>
            <h2>{strings.settingsGeneral[language]}</h2>
            <div className="toggle" onClick={this.switchLan}>
              <p>{strings.settingsLanguage[language]} <br/> <span>{strings.settingsSDefault[language]}</span></p>
            </div>
          </section>
          <section>
            <h2>{strings.settingsSearch[language]}</h2>
            <div className="toggle">
              <p>Google <br/> <span>{strings.settingsDefault[language]}</span></p>
            </div>
          </section>
          <section>
            <h2>{strings.settingsPrivacy[language]}</h2>
            <div className="toggle">
              <p>{strings.settingsClear[language]}</p>
            </div>
            <div className="toggle">
              <p>{strings.settingsSave[language]} <br/> <span>{strings.settingsCard[language]}</span></p>
            </div>
            <br/><br/>
          </section>
        </div>
      </div>
    );
  }
}

class Download extends Component {
  cancel = () => {
    goOnline = false;
    document.getElementById('mask').classList.remove('active');
    document.getElementById('mask').classList.remove('none');
    document.getElementById('download-modal').classList.remove('active');
    var temp = this;
    setTimeout(function(){
      temp.props.update();
    },200);
  }

  ok = () => {
    document.getElementById('mask').classList.remove('active');
    document.getElementById('mask').classList.remove('none');
    document.getElementById('download-modal').classList.remove('active');

    if(!goOnline) {
      document.getElementById('fakepage').classList.add('active');
      document.getElementById('loading-mask').classList.add('active');
      if(document.getElementById('menu-online')!=null) document.getElementById('menu-online').classList.add('disabled');
      globalTimeout = setTimeout(function(){
        document.getElementById('loading-mask').classList.remove('active');
      },globalTime);

    } else {
      console.log("online!");
      mobile[3] = " mobile";
      document.getElementById('loading-mask').classList.add('active');
      globalTimeout = setTimeout(function(){
        document.getElementById('loading-mask').classList.remove('active');
      },globalTime);
      document.querySelector('.url').classList.add('online');
      if(document.getElementById('site4-page') != null) document.getElementById('site4-page').classList.add('online');
      online = " online";

      var d = new Date();
      var curr_time = ('0'+d.getHours().toString()).slice(-2)+":"+('0'+d.getMinutes().toString()).slice(-2);
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var now = curr_month + "/" + curr_date +"/" + curr_year + " " + curr_time;
      if(this.props.site.split('sub')[1] != null) {
        date[parseInt(this.props.site.split('sub')[1],10)+3] = now;
      }
      else {
        date[this.props.site.split('site')[1]-1] = now;
      }
    }
    this.props.update();
  }

  render() {
    let text = null;
    let title = null;
    console.log(goOnline+"???");
    
    if(goOnline) {
      text = <p>{strings.browseOnline[language]}</p>
      title = <h2>{strings.browseUpdate[language]}</h2>
    } 
    else {
      text = <p>{strings.browseLink[language]}</p>
      title = <h2>{strings.browseMobile[language]}</h2>
    }
    return (
      <div className="modal" id="download-modal">
        <div className="modal-info">
          {title}
          {text}
        </div>
        <div className="modal-action">
          <div className="button" id="download-cancel" onClick={this.cancel}>{strings.cancel[language]}</div>
          <div className="button action" id="download-ok" onClick={this.ok}>{strings.yes[language]}</div>
        </div>
      </div>
    );
  }
}


class Browser extends Component {
  
  visitHome = (e) => {
    this.props.returnHome();
    document.getElementById('fakepage').classList.remove('active');
  }

  initList = (e) => {
    const isHome = this.props.isHome;
    const isSubscribed = this.props.isSubscribed;
    var site = document.getElementById('menu-subscribe');
    if (!isHome) {
      if(site!=null) {
        if (isSubscribed) site.classList.add('subscribed');
        else site.classList.remove('subscribed');
        site.classList.remove('fade');
      }
    } else site.classList.add('fade');
    
  }

  render() {
    const isHome = this.props.isHome;
    let button = null;
    if (!isHome) button = <div id="home" onClick={this.visitHome}></div>;

    return (
      <div className="buttons">
        <div id="search"><i className="material-icons">search</i></div>
        {button}
        <div id="menu" onClick = {this.initList}><i className="material-icons">more_vert</i></div>
      </div>
    );
  }
}

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: onboarding,
      subscribed: subscribed
    }
  }

  subscribeSites = (e) => {
    var num = e.target.id.split('s')[1] - 1;
    e.target.classList.toggle('active');
    var stateCopy = Object.assign({}, this.state);

    if(e.target.classList.contains('active')) {
      stateCopy.subscribed[num] = true;
      this.setState(stateCopy);
    } else {
      stateCopy.subscribed[num] = false;
      this.setState(stateCopy);
    }
    subscribed = this.state.subscribed;
  }

  nextStage = (e) => {

    // document.getElementById('mask').classList.toggle('active');
    // document.getElementById('menu-panel').classList.toggle('active');
    // document.getElementById('highlight').classList.toggle('active');
    // document.getElementById('menu-subscribe').classList.toggle('active');
    // document.getElementById('menu-subscribe').classList.toggle('fade');
    // document.getElementById('action-refresh').classList.toggle('fade');
    
    var s = this.state.stage + 2;
    onboarding = s;
    this.setState({
      stage: s
    });
    var temp = this;
    setTimeout(function(){
      loaded = "";
      console.log("loaded!");
      var len = document.querySelectorAll('.load').length;
      for(var i = 0; i < len; i++) {
        document.querySelectorAll('.load')[0].classList.remove('load');
      }
      var d = new Date();
      var curr_time = ('0'+d.getHours().toString()).slice(-2)+":"+('0'+d.getMinutes().toString()).slice(-2);
      var curr_date = d.getDate();
      var curr_month = d.getMonth() + 1; //Months are zero based
      var curr_year = d.getFullYear();
      var now = curr_month + "/" + curr_date +"/" + curr_year + " " + curr_time;
      for (var j = 0; j < 7; j++) date[j] = now;
      temp.props.update();

    },globalTime+800);
  }
  jumpStage = (e) => {
    onboarding = 3;
    this.setState({
      stage: 3,
      subscribed: [false, false, false]
    });
    subscribed = [false, false, false];
  }

  openMenu = (e) => {
    // var flag = false;
    // if(e.target.nextSibling.classList.contains('active')) flag = true;

    // e.stopPropagation();
    // for(var i = 0; i < document.querySelectorAll('.dropdown').length; i++) {
    //   if(document.querySelectorAll('.dropdown')[i].classList.contains('active'))
    //     document.querySelectorAll('.dropdown')[i].classList.remove('active'); 
    // }

    // if(!flag) {
    //   if(e.target.nextSibling.classList.contains('active')) {
    //     e.target.nextSibling.classList.remove('active');
    //   } else {
    //     e.target.nextSibling.classList.add('active');
    //   }
    // }
  }

  render() {
    switch(this.state.stage){
      case 1:
        return (
          <div id="onboarding">
            <div id="onboarding-content">
              <h2>{strings.saveData[language]}</h2>
              <p>{strings.saveDataContent[language]}</p>
              <ul id="subsribeSites">
                <li id="s1" data-attr="sub1" className="active" onClick = {this.subscribeSites}>
                  <div className="sub-icon"></div>
                  <p>Tribunnews</p>
                </li>
                <li id="s2" data-attr="sub2" className="active" onClick = {this.subscribeSites}>
                  <div className="sub-icon"></div>
                  <p>Detik</p>
                </li>
                <li id="s3" data-attr="sub3" className="active" onClick = {this.subscribeSites}>
                  <div className="sub-icon"></div>
                  <p>Liputan6</p>
                </li>
              </ul>
            </div>
            <div id="onboarding-action">
              <div className="button" onClick = {this.jumpStage}>{strings.saveDataContentFalse[language]}</div>
              <div className="button action" onClick = {this.nextStage}>{strings.saveDataContentTrue[language]}</div>
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <ul id="subscribedSites">
              <li id="st1" data-attr="site1" className={sites[0]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Facebook.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[0]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>13MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="st2" data-attr="site2" className={sites[1]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Youtube.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[1]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>25MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="st3" data-attr="site3" className={sites[2]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Google.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[2]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>3MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="st4" data-attr="site4" className={sites[3]+loaded+online} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Kompas.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[3]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>7MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="sub1" data-attr="sub1" className={this.state.subscribed[0]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Tribunnews.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[4]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>13MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="sub2" data-attr="sub2" className={this.state.subscribed[1]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Detik.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[5]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>17MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              <li id="sub3" data-attr="sub3" className={this.state.subscribed[2]+loaded} onClick = {this.props.visitSite}></li>
              <div className="sub-info">
                <div className="page-info">
                  <p className="title">Liputan6.com</p>
                  <p className="updated">{strings.updated[language] + ': ' + date[6]}</p>
                </div>
                <div className="dropmenu" onClick={this.openMenu}>6MB</div>
                <div className="dropdown">
                  <ul>
                    <li>unsubscribe</li>
                    <li>settings</li>
                  </ul>
                </div>
              </div>
              
            </ul>
          </div>
        );
      default:
        return false;
    }
  }
}

class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      site: "home",
      subscribed: false
    }
  }

  changeURL = (link) => {
    document.querySelector('.url').innerHTML = '<i class="material-icons">lock</i>'+link;
  }

  openModal = (e) => {
    if(!sites[3] || mobile[3] === " mobile") {
      document.getElementById('fakepage').classList.add('active');
      document.getElementById('loading-mask').classList.add('active');
      globalTimeout = setTimeout(function(){
        document.getElementById('loading-mask').classList.remove('active');
      },globalTime);
    }
    else {
      goOnline = false;
      this.props.update();
      document.getElementById('mask').classList.add('active');
      document.getElementById('mask').classList.add('none');
      document.getElementById('download-modal').classList.add('active');
    }
  }

  nextPage = (e) => {
    document.getElementById('link').classList.add('active');
    document.getElementById('link-2').classList.add('active');
    this.changeURL("http://sains.kompas.com/read/2017/07/...");
    document.getElementById('site4-page').classList.add('next');

    if(!sites[3] || mobile[3] !== "") {
      document.getElementById('loading-mask').classList.add('active');
      globalTimeout = setTimeout(function(){
        document.getElementById('loading-mask').classList.remove('active');
      },globalTime);
    }
  }

  visitSite = (e) => {
    var siteId = e.target.dataset.attr;
    if(e.target.classList.contains('true')) {
      this.setState({
        site: siteId,
        subscribed: true
      })
      document.getElementById('online').classList.add('active');
    } else {
      this.setState({
        site: siteId,
        subscribed: false
      })
      document.getElementById('online').classList.remove('active');
    }
    this.props.leaveHome(siteId);
    document.querySelector('.App').scrollTop = 0;
  }

  visitSiteNew = (e) => {
    var siteId = e.target.dataset.attr;
    mobile[siteId.split('site')[1] - 1] = " mobile";

    document.getElementById('loading-mask').classList.add('active');
    globalTimeout = setTimeout(function(){
      document.getElementById('loading-mask').classList.remove('active');
    },globalTime);
    // if(e.target.classList.contains('true')) {
    //   this.setState({
    //     site: siteId,
    //     subscribed: true
    //   })
    // } else {
    //   this.setState({
    //     site: siteId,
    //     subscribed: false
    //   })
    // }
    this.props.leaveHome(siteId);
    document.querySelector('.App').scrollTop = 0;
    if(!gotit) {
      document.getElementById('onboarding-info').classList.toggle('active');
      document.getElementById('mask').classList.toggle('active');
      document.getElementById('mask').classList.toggle('none');
      document.getElementById('menu-panel').classList.toggle('active');
      document.getElementById('highlight').classList.toggle('active');
      document.getElementById('menu-subscribe').classList.remove('fade');
      document.getElementById('menu-subscribe').classList.add('active');
      document.getElementById('action-refresh').classList.toggle('fade');
    }
  }

  last = (s) => {
    console.log(s);
    if(s!=="...") {
      var hr = s.split(' ')[1].split(':')[0];
      var min = s.split(' ')[1].split(':')[1];

      var d = new Date();
      var dhr = parseInt(d.getHours(),10) - parseInt(hr,10);
      var dmin = parseInt(d.getMinutes(),10) - parseInt(min,10);

      if(dhr > 1) return "Updated "+dhr+" hrs ago";
      else if(dhr < 1) {
        if(dmin === 0) return "Updated just now";
        else if(dmin === 1) return "Updated 1 min ago";
        else if(dmin > 1) return "Updated "+dmin+" mins ago";
      } else if(dhr === 1) {
        if(dmin < 0 && dmin > -59) return "Updated "+ (60+parseInt(dmin,10)) +" mins ago";
        else if(dmin === -59) return "Updated 1 min ago";
        else return "Updated 1 hr ago"
      }
    }
  }

  update = () => {
    this.props.update();
  }

  render() {
    switch(this.props.site){
      case "home":
        return (
          <div className="page">
            <div id="topSites">
              <h2>{strings.topSites[language]}</h2>
              <ul>
                <li id="site1" data-attr="site1" onClick = {this.visitSiteNew} ><p>Facebook</p></li>
                <li id="site2" data-attr="site2" onClick = {this.visitSiteNew} ><p>Youtube</p></li>
                <li id="site3" data-attr="site3" onClick = {this.visitSiteNew} ><p>Google</p></li>
                <li id="site4" data-attr="site4" onClick = {this.visitSiteNew} ><p>Kompas</p></li>
              </ul>
            </div>
            {console.log("---")}
            <div id="divider" className={language}>{strings.subscription[language]}</div>
            <Onboarding visitSite = {this.visitSite.bind(this)} update = {this.update.bind(this)}/>
            {console.log("---")}
          </div>
        );
      case "site1":
        return (
          <div className="page">
            <div className={"url " + sites[0] + mobile[0]} data-time={this.last(date[0])}><i className="material-icons">lock</i>{"https://www.facebook.com"}</div>
            <div className="sites" id="site1-page"></div>
          </div>
        );  
      case "site2":
        return (
          <div className="page">
            <div className={"url " + sites[1] + mobile[1]} data-time={this.last(date[1])}><i className="material-icons">lock</i>{"https://www.youtube.com"}</div>
            <div className="sites" id="site2-page"></div>
          </div>
        );  
      case "site3":
        return (
          <div className="page">
            <div className={"url " + sites[2] + mobile[2]} data-time={this.last(date[2])}><i className="material-icons">lock</i>{"https://www.google.com"}</div>
            <div className="sites" id="site3-page"></div>
          </div>
        );  
      case "site4":
        return (
          <div className="page">
            {console.log("---")}
            <div className={"url " + sites[3] + mobile[3]} data-time={this.last(date[3])}><i className="material-icons">lock</i>{"https://www.kompas.com"}</div>
            <div className={"sites"+online} id="site4-page"></div>
            <div id="link" onClick={this.openModal}>link</div>
            <div id="link-2" onClick={this.nextPage}>link2</div>
          </div>
        );
      case "sub1":
        return (
          <div className="page">
            <div className="url true" data-time={this.last(date[4])}><i className="material-icons">lock</i>{"https://www.tribunnews.com"}</div>
            <div className="sites" id="sub1-page"></div>
          </div>
        );  
      case "sub2":
        return (
          <div className="page">
            <div className="url true" data-time={this.last(date[5])}><i className="material-icons">lock</i>{"https://www.detik.com"}</div>
            <div className="sites" id="sub2-page"></div>
          </div>
        );  
      case "sub3":
        return (
          <div className="page">
            <div className="url true" data-time={this.last(date[6])}><i className="material-icons">lock</i>{"https://www.liputan6.com"}</div>
            <div className="sites" id="sub3-page"></div>
          </div>
        );   
      default:
        return false;
    }
  }
}

export default App;



//Fill in the 'id' that is the translation of ‘en’

var strings = {
  topSites: {
    'en': 'Top Sites',
    'id': 'Situs Top'
  },
  subscription: {
    'en': 'Followed',
    'id': 'Situs Yang Difollow'
  },
  saveData: {
    'en': 'Save data and read offline',
    'id': 'Follow dan baca situs tanpa kuota'
  },
  saveDataContent: {
    'en': 'Follow your favorite site without costing data. We\'ll keep the site up to date whenever WI-FI is on so you can read them anytime you want.',
    'id': 'Ikuti terus update situs favorit anda tanpa kuota. Kami akan men-download isinya hanya sewaktu anda menggunakan koneksi wi-fi, supaya anda bisa membacanya kapan saja.'
  },
  saveDataContentFalse: {
    'en': 'No, thanks',
    'id': 'Tidak'
  },
  saveDataContentTrue: {
    'en': 'Follow',
    'id': 'Follow'
  },
  updated: {
    'en': 'Last updated',
    'id': 'Terakhir diupdate pada tanggal'
  },
  menuDownload: {
    'en': 'Download',
    'id': 'Download'
  },
  menuSubscribe: {
    'en': 'Follow',
    'id': 'Follow'
  },
  menuUnsubscribe: {
    'en': 'Unfollow',
    'id': 'Berhenti follow'
  },
  menuClear: {
    'en': 'Clean Space',
    'id': 'Bersihkan data'
  },
  menuHistory: {
    'en': 'History',
    'id': 'Riwayat'
  },
  menuShare: {
    'en': 'Share',
    'id': 'Bagikan'
  },
  menuAddHome: {
    'en': 'Add to home screen',
    'id': 'Tambahkan ke Layar Utama'
  },
  menuSettings: {
    'en': 'Settings',
    'id': 'Setelan'
  },
  menuOnline: {
    'en': 'View page online',
    'id': 'Lihat halaman memakai kuota'
  },
  subscribeTitle: {
    'en': 'Follow any site you like!',
    'id': 'Ikuti situs favorit anda!'
  },
  subscribeContent: {
    'en': 'When you find any interesting site, tap the Follow button in the menu so we can save and update it whenever Wi-Fi is on.',
    'id': 'Sewaktu anda menemukan situs yang menarik, tap tombol Follow di dalam menu di bawah ini. Kami akan men-downloadnya sewaktu anda menggunakan koneksi wi-fi.'
  },
  subscribeOK: {
    'en': 'Got it',
    'id': 'OK'
  },
  subscribeToast: {
    'en': 'Site followed! We\'ll keep the site update whenever Wi-Fi is available.',
    'id': 'OK. Kami akan men-download isi situs ini sewaktu anda menggunakan koneksi wi-fi.'
  },
  cancel: {
    'en': 'Cancel',
    'id': 'Batalkan'
  },
  yes: {
    'en': 'Yes',
    'id': 'OK'
  },
  browseUpdate: {
    'en': 'Update with mobile data',
    'id': 'Update dengan kuota data'
  },
  browseOnline: {
    'en': 'You need to use mobile data to update the site, do you want to update?',
    'id': 'Anda perlu menggunakan kuota untuk memuat kembali situs. Lanjutkan?'
  },
  browseMobile: {
    'en': 'Browse with mobile data',
    'id': 'Akses pakai kuota'
  },
  browseLink: {
    'en': 'You need to use mobile data to access the link, do you want to continue?',
    'id': 'Anda perlu menggunakan kuota untuk memuat situs. Lanjutkan?'
  },
  settingsTitle :{
    'en': 'Settings',
    'id': 'Setelan'
  },
  settingsDataSaving :{
    'en': 'Data saving',
    'id': 'Hemat data'
  },
  settingsBlock1 :{
    'en': 'Block ads and trackers',
    'id': 'Blokir iklan dan pelacak'
  },
  settingsBlock2 :{
    'en': 'Block Web fonts',
    'id': 'Blokir font'
  },
  settingsBlock3 :{
    'en': 'Block images while over cellular data',
    'id': 'Blokir gambar ketika menggunakan kuota data'
  },
  settingsBlock4 :{
    'en': 'Block media autoplay',
    'id': 'Blokir video yang berjalan dengan sendirinya begitu halaman web terbuka'
  },
  settingsBlock5 :{
    'en': 'Block tab restore',
    'id': 'Membuka kembali tab yang telah dibuka sebelumnya saat awal aplikasi'
  },
  settingsGeneral :{
    'en': 'General',
    'id': 'Umum'
  },
  settingsLanguage :{
    'en': 'Browser language',
    'id': 'Bahasa'
  },
  settingsSDefault :{
    'en': 'System default',
    'id': 'Ikuti bahasa Android'
  },
  settingsSearch :{
    'en': 'Search',
    'id': 'Situs pencarian'
  },
  settingsDefault :{
    'en': 'Default',
    'id': 'Utama'
  },
  settingsPrivacy :{
    'en': 'Privacy and storage',
    'id': 'Privasi dan penyimpanan data'
  },
  settingsClear :{
    'en': 'Clearing browsing data',
    'id': 'Hapus data dan riwayat'
  },
  settingsSave :{
    'en': 'Save downloads / cache / offline pages to',
    'id': 'Simpan download / cache / halaman di'
  },
  settingsCard :{
    'en': 'SD card',
    'id': 'Memori eksternal / SD card'
  }
}
