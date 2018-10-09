import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { Route, Link, Switch } from 'react-router-dom';
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
import FooterBar from './FooterBar-container';
import EventLoader from './Loaders/EventLoader-container';

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

  componentWillMount() {
    const isLoggedIn = isLoaded(this.props.profile) && !isEmpty(this.props.profile);

    if (['/userinfo'].indexOf(this.props.location.pathname) !== -1 && !isLoggedIn) {
      this.props.history.push('/today');
    }
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
    const { activeItem, forceUserInfo } = this.state; // TODO: Force user info if not all user info is input
    const { profile, settings } = this.props;

    if (isLoaded(settings) && isEmpty(settings)) {
      return <InitialSetup profile={profile} />;
    }

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin'; // TODO: Only show admin tabs to admins
    const hasProfileData = isProfileLoaded && profile.firstName && profile.lastName && profile.email;

    const eventsActive = _.get(settings, 'features.events.active', false);
    const storeInfoActive = _.get(settings, 'features.storeinfo.active', false);

    const activePage = activeItem || _.get(profile, 'landingPage', 'today'); // TODO: User selected starting page

    // const todayVisible = Boolean(!forceUserInfo && (!isLoggedIn || hasProfileData) && activePage === 'today');
    // const eventContentVisible = Boolean(!forceUserInfo && (!isLoggedIn || hasProfileData) && activePage === 'events');
    // const userInfoVisible = Boolean(isLoggedIn && (forceUserInfo || activePage === 'userinfo' || !hasProfileData));
    // const adminToolsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'admintools');
    // const adminToolsEventsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'admintoolsevents');
    // const adminSiteSettingsVisible = Boolean(isAdmin && !forceUserInfo && activePage === 'adminsitesettings');
    // const loginVisible = Boolean(!isLoggedIn && activePage === 'login');
    // const registerVisible = Boolean(!isLoggedIn && activePage === 'register');
    // const storeInfoVisible = Boolean(activePage === 'storeinfo');
    // const companyInfoVisible = Boolean(activePage === 'companyinfo');

    return (
      <div>
        <ThemeHandler />
        <EventLoader />

        <TitleBar returnToFrontpage={() => this.switchActiveTab('today')} />
        <Navbar changeLanguage={this.changeLanguage} />
        <Switch>
          <Route path="/today" component={Today} />
          {eventsActive && <Route path="/events" component={EventList} />}
          {storeInfoActive && <Route path="/storeinfo" component={StoreInfo} />}
          <Route path="/userinfo" component={UserInfo} />
          <Route path="/admintools" component={AdminTools} />
          <Route path="/admintoolsevents" component={AdminToolsEvents} />
          <Route path="/adminsitesettings" component={AdminSiteSettings} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/companyinfo" component={CompanyInfo} />
        </Switch>

        {isLoaded(settings) &&
          <FooterBar />
        }
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
  location: PropTypes.object,
  history: PropTypes.object,
};
