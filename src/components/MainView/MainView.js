import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import AdminTools from '../AdminTools/AdminTools-container';
import AdminToolsEvents from '../AdminTools/AdminToolsEvents-container';
import AdminSiteSettings from '../AdminTools/SiteSettings/AdminSiteSettings-container';
import UserInfo from '../UserInfo/UserInfo-container';
import EventList from '../EventList/EventList-container';
import TitleBar from './TitleBar-container';
import Login from './Account/Login-container';
import Register from './Account/Register-container';
import ThemeHandler from './ThemeHandler-container';
import StoreInfo from '../StoreInfo/StoreInfo-container';
import Navbar from './Navbar/Navbar-container';
import Today from './Today/Today-container';
import CompanyInfo from './CompanyInfo/CompanyInfo-container';
import InitialSetup from './InitialSetup';
import FooterBar from './FooterBar';

// ******************
// Set the theme here
// ******************
import 'bulmaswatch/darkly/bulmaswatch.min.css';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.switchActiveTab = this.switchActiveTab.bind(this);
    this.state = { forceUserInfo: false };
  }

  componentWillReceiveProps(nextProps) {
    const isProfileLoaded = isLoaded(nextProps.profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(nextProps.profile);
    const acceptedPrivacyPolicy = _.get(nextProps.profile, 'acceptedPrivacyPolicy', false);

    if (isLoggedIn && (!nextProps.profile.firstName || !nextProps.profile.lastName || !nextProps.profile.email || !acceptedPrivacyPolicy)) {
      this.setState({ forceUserInfo: true, activeItem: 'userinfo' });
    } else if (isLoaded(nextProps.profile)) {
      this.setState({ forceUserInfo: false });
    }
  }

  switchActiveTab(type) {
    this.setState({ activeItem: type });
  }

  changeLanguage(newLanguage) {
    const { dispatch } = this.props;
    dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { activeItem, forceUserInfo } = this.state;
    const { profile, settings } = this.props;

    if (isLoaded(settings) && isEmpty(settings)) {
      return <InitialSetup profile={profile} />;
    }

    const isProfileLoaded = isLoaded(profile);

    if (isProfileLoaded) {
      const isLoggedIn = isProfileLoaded && !isEmpty(profile);
      const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';
      const hasProfileData = isProfileLoaded && profile.firstName && profile.lastName && profile.email;

      const eventsActive = _.get(settings, 'features.events.active', false);
      const storeInfoActive = _.get(settings, 'features.storeinfo.active', false);

      const activePage = activeItem || _.get(profile, 'landingPage', 'today');

      const todayVisible = Boolean(!forceUserInfo && (!isLoggedIn || hasProfileData) && activePage === 'today');
      const eventContentVisible = Boolean(!forceUserInfo && (!isLoggedIn || hasProfileData) && activePage === 'events');
      const userInfoVisible = Boolean(isLoggedIn && (forceUserInfo || activePage === 'userinfo' || !hasProfileData));
      const adminToolsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'admintools');
      const adminToolsEventsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'admintoolsevents');
      const adminSiteSettingsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'adminsitesettings');
      const loginVisible = Boolean(!isLoggedIn && activePage === 'login');
      const registerVisible = Boolean(!isLoggedIn && activePage === 'register');
      const storeInfoVisible = Boolean(activePage === 'storeinfo');
      const companyInfoVisible = Boolean(activePage === 'companyinfo');

      return (
        <div>
          <ThemeHandler />
          <TitleBar returnToFrontpage={() => this.switchActiveTab('today')} />
          <Navbar switchActiveTab={this.switchActiveTab} activeItem={activePage} changeLanguage={this.changeLanguage} />
          {todayVisible && <Today />}
          {eventsActive && eventContentVisible && <EventList />}
          {storeInfoActive && storeInfoVisible && <StoreInfo />}
          {userInfoVisible && <UserInfo />}
          {adminToolsVisible && <AdminTools />}
          {adminToolsEventsVisible && <AdminToolsEvents />}
          {adminSiteSettingsVisible && <AdminSiteSettings />}
          {loginVisible && <Login />}
          {registerVisible && <Register />}
          {companyInfoVisible && <CompanyInfo />}
          {isLoaded(settings) &&
            <FooterBar />
          }
        </div>

      );
    }
    return (
      <div className="title has-text-centered">
        <div className="level" />
        <button disabled className="button is-loading is-black">Loading..</button>
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
  isActive: PropTypes.bool,
  switchAction: PropTypes.func,
  icon: PropTypes.string,
  translationKey: PropTypes.string,
  notification: PropTypes.string,
  isDisabled: PropTypes.bool,
};

MainView.propTypes = {
  dispatch: PropTypes.func,
  profile: PropTypes.object,
  settings: PropTypes.object,
};
