import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import AdminTools from '../AdminTools/AdminTools-container';
import AdminSiteSettings from '../AdminTools/SiteSettings/AdminSiteSettings-container';
import UserInfo from '../UserInfo/UserInfo-container';
import EventList from '../EventList/EventList-container';
import TitleBar from './TitleBar-container';
import Login from './Account/Login-container';
import Register from './Account/Register-container';
import ThemeHandler from './ThemeHandler-container';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.switchActiveTab = this.switchActiveTab.bind(this);
    this.state = { activeItem: 'admintools', forceUserInfo: false };
  }

  componentWillReceiveProps(nextProps) {
    const isProfileLoaded = isLoaded(nextProps.profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(nextProps.profile);
    if (isLoggedIn && (!nextProps.profile.firstName || !nextProps.profile.lastName || !nextProps.profile.email)) {
      this.setState({ forceUserInfo: true, activeItem: 'userinfo' });
    } else if (isLoaded(nextProps.profile)) {
      this.setState({ forceUserInfo: false });
    }
  }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  changeLanguage(newLanguage) {
    this.props.dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { activeItem, forceUserInfo } = this.state;
    const { profile, settings } = this.props;
    const isProfileLoaded = isLoaded(profile) && isLoaded(settings);

    if (isProfileLoaded) {
      const isLoggedIn = isProfileLoaded && !isEmpty(profile);
      const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';
      const hasProfileData = isProfileLoaded && profile.firstName && profile.lastName && profile.email;

      const eventContentVisible = Boolean(isProfileLoaded && !forceUserInfo && (!isLoggedIn || hasProfileData) && activeItem === 'events');
      const userInfoVisible = Boolean(isLoggedIn && (forceUserInfo || activeItem === 'userinfo' || !hasProfileData));
      const adminToolsVisible = Boolean(isAdmin && !forceUserInfo && activeItem === 'admintools');
      const adminSiteSettingsVisible = Boolean(isAdmin && !forceUserInfo && activeItem === 'adminsitesettings');
      const loginVisible = Boolean(!isLoggedIn && activeItem === 'login');
      const registerVisible = Boolean(!isLoggedIn && activeItem === 'register');

      return (
        <div>
          <ThemeHandler />
          <TitleBar />

          {isProfileLoaded &&
            <div className="tabs is-boxed is-marginless">
              <ul>
                <MainViewTab isDisabled={!hasProfileData} isActive={eventContentVisible} switchAction={() => this.switchActiveTab('events')} icon="fa-calendar-alt" translationKey="events" />
                {isLoggedIn && <MainViewTab isActive={userInfoVisible} switchAction={() => this.switchActiveTab('userinfo')} icon="fa-user" translationKey="userinfo" notification={hasProfileData ? null : 'fa-exclamation-triangle'} />}
                {!isLoggedIn && <MainViewTab isActive={loginVisible} switchAction={() => this.switchActiveTab('login')} icon="fa-sign-in-alt" translationKey="login" />}
                {!isLoggedIn && <MainViewTab isActive={registerVisible} switchAction={() => this.switchActiveTab('register')} icon="fa-pencil-alt" translationKey="register" />}
                {isAdmin && <MainViewTab isActive={adminToolsVisible} switchAction={() => this.switchActiveTab('admintools')} icon="fa-calendar-plus" translationKey="adminevents" />}
                {isAdmin && <MainViewTab isActive={adminSiteSettingsVisible} switchAction={() => this.switchActiveTab('adminsitesettings')} icon="fa-cogs" translationKey="sitesettings" />}
              </ul>
            </div>
          }

          {eventContentVisible && <EventList />}
          {userInfoVisible && <UserInfo />}
          {adminToolsVisible && <AdminTools />}
          {adminSiteSettingsVisible && <AdminSiteSettings />}
          {loginVisible && <Login />}
          {registerVisible && <Register />}
        </div>

      );
    }
    return (
      <div className="title has-text-centered">
        <div className="level" />
        <button disabled className="button is-loading is-black" >Loading..</button>
      </div>
    );
  }
}

const MainViewTab = ({ isActive, switchAction, icon, translationKey, notification, isDisabled }) => (
  <li className={`has-icon ${isActive && 'is-active'} ${isDisabled && 'has-text-gray'}`}>
    <a onClick={switchAction}>
      <span className="icon is-small"><i className={`fas ${icon}`} aria-hidden="true" /></span>
      <span><Translate id={translationKey} /></span>
      {notification &&
        <span className="icon is-small has-text-danger"><i className={`fas ${notification}`} aria-hidden="true" /></span>
      }
    </a>
  </li>
);

MainViewTab.propTypes = {
  isActive: PropTypes.bool.isRequired,
  switchAction: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  translationKey: PropTypes.string.isRequired,
  notification: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
};

MainView.propTypes = {
  dispatch: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired,
};
