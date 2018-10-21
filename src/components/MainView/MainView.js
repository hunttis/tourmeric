import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import AdminTools from '../AdminTools/AdminTools-container';
import AdminToolsEvents from '../AdminTools/AdminToolsEvents-container';
import AdminSiteSettings from '../AdminTools/SiteSettings/AdminSiteSettings-container';
import UserInfo from '../UserInfo/UserInfo-container';
import EventCalendar from '../EventList/EventCalendar/EventCalendar-container';
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
import SingleEvent from '../EventList/EventCard/SingleEvent-container';

import EventLoader from './Loaders/EventLoader-container';
import CategoryLoader from './Loaders/CategoryLoader-container';
import ParticipationsLoader from './Loaders/ParticipationsLoader-container';
import UploadedCategoryLogosLoader from './Loaders/UploadedCategoryLogosLoader-container';

// ******************
// Set the theme here
// ******************
import 'bulmaswatch/darkly/bulmaswatch.min.css';

export default class MainView extends Component {
  constructor(props) {
    super(props);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.state = { redirected: false };
  }

  componentWillReceiveProps(nextProps) {

    const wasProfileLoaded = isLoaded(this.props.profile);
    const isProfileLoaded = isLoaded(nextProps.profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(nextProps.profile);
    const acceptedPrivacyPolicy = _.get(nextProps.profile, 'acceptedPrivacyPolicy', false);
    const providerEmail = _.get(nextProps.profile, 'providerData[0].email', null);
    const emailOk = (!nextProps.profile.useOtherEmail && (providerEmail || nextProps.profile.email)) || (nextProps.profile.useOtherEmail && nextProps.profile.otherEmail);

    if (!this.state.redirected) {
      if (isLoaded(nextProps.profile) && isEmpty(nextProps.profile) && ['/userinfo'].indexOf(this.props.location.pathname) !== -1 && !isLoggedIn) {
        this.props.history.push('/today');
      } else if (isLoggedIn && (!nextProps.profile.firstName || !nextProps.profile.lastName || !emailOk || !acceptedPrivacyPolicy)) {
        this.props.history.push('/userinfo');
        this.setState({ redirected: true });
      } else if (wasProfileLoaded !== isProfileLoaded) {
        const currentLocation = this.props.location.pathname.substring(1);
        const landingPage = _.get(nextProps.profile, 'landingPage', 'today');
        if (_.isEmpty(currentLocation) && !_.isEmpty(landingPage)) {
          this.props.history.push(`/${landingPage}`);
        }
        this.setState({ redirected: true });
      }
    }
  }

  changeLanguage(newLanguage) {
    const { dispatch } = this.props;
    dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { profile, settings } = this.props;

    if (isLoaded(settings) && isEmpty(settings)) {
      return <InitialSetup profile={profile} />;
    }

    return (
      <div>
        <ThemeHandler />

        <EventLoader />
        <CategoryLoader />
        <ParticipationsLoader />
        <UploadedCategoryLogosLoader />

        <TitleBar returnToFrontpage={() => this.props.history.push('/today')} />
        <Navbar changeLanguage={this.changeLanguage} />
        <Switch>
          <Route path="/today" component={Today} />
          <Route path="/event/:id" component={SingleEvent} />
          <Route path="/events" component={EventCalendar} />
          <Route path="/storeinfo" component={StoreInfo} />
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
