import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
import { setActiveLanguage, InitializePayload, SingleLanguageTranslation } from 'react-localize-redux';
import Moment from 'react-moment';
import { Location, History } from 'history';
import { renderToStaticMarkup } from 'react-dom/server';
import englishTranslations from '~/translations/en.json';
import finnishTranslations from '~/translations/fi.json';

import UserInfo from '~/components/UserInfo/UserInfo-container';
import TitleBar from '~/components/MainView/TitleBar-container';
import ThemeHandler from '~/components/MainView/ThemeHandler-container';
import Navbar from '~/components/MainView/Navbar/Navbar-container';
import InitialSetup from '~/components/MainView/InitialSetup';
import FooterBar from '~/components/MainView/FooterBar-container';
import { OpeningHoursContainer as OpeningHours } from '~/components/StoreInfo/OpeningHours-container';

import ArticleLoader from '~/components/MainView/Loaders/ArticleLoader-container';
import EventLoader from '~/components/MainView/Loaders/EventLoader-container';
import CategoryLoader from '~/components/MainView/Loaders/CategoryLoader-container';
import ParticipationsLoader from '~/components/MainView/Loaders/ParticipationsLoader-container';
import UploadedCategoryLogosLoader from '~/components/MainView/Loaders/UploadedCategoryLogosLoader-container';
import OpeningHoursExceptionLoader from '~/components/MainView/Loaders/OpeningHoursExceptionLoader-container';
import UsersLoader from '~/components/MainView/Loaders/UsersLoader-container';
import HighLightsLoader from '~/components/MainView/Loaders/HighLightsLoader-container';
import MainViewRoutes from '~/components/MainView/MainView-routes';

// ******************
// Set the theme here
// ******************
import 'bulmaswatch/darkly/bulmaswatch.min.css';
import { FirebaseProfile } from '~/models/ReduxState';
import { Settings } from '~/models/Settings';

interface Props {
  dispatch: Dispatch;
  profile: FirebaseProfile;
  settings: Settings;
  location: Location;
  history: History;
  isAdmin: boolean;
  initialize: (payload: InitializePayload) => void;
  addTranslationForLanguage: (
    translation: SingleLanguageTranslation,
    language: string
  ) => void;
}

interface State {
  redirected: boolean;
  userInfoOk: boolean;
}

export default class MainView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Finnish', code: 'fi' },
      ],
      options: { renderToStaticMarkup },
    });
    this.props.addTranslationForLanguage(englishTranslations, 'en');
    this.props.addTranslationForLanguage(finnishTranslations, 'fi');

    this.changeLanguage = this.changeLanguage.bind(this);
    this.state = { redirected: false, userInfoOk: false };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!this.state.redirected) {

      const wasProfileLoaded: boolean = isLoaded(this.props.profile);
      const nextProfile = nextProps.profile;
      const isProfileLoaded: boolean = isLoaded(nextProfile);
      const isLoggedIn: boolean = isProfileLoaded && !isEmpty(nextProfile);
      const acceptedPrivacyPolicy = !!_.get(nextProfile, 'acceptedPrivacyPolicy');
      const providerEmail = _.get(nextProfile, 'providerData[0].email', null);
      const emailOk = (!nextProfile.useOtherEmail && (providerEmail || nextProfile.email)) || (nextProfile.useOtherEmail && nextProfile.otherEmail);
      const namesOk = !!_.get(nextProps, 'profile.firstName', false) && !!_.get(nextProps, 'profile.lastName', false);
      const everythingOk = !isLoggedIn || (emailOk && namesOk && acceptedPrivacyPolicy);

      this.setState({ userInfoOk: everythingOk });

      if (isLoaded(nextProfile) && isEmpty(nextProfile) && ['/userinfo'].indexOf(this.props.location.pathname) !== -1 && !isLoggedIn) {
        this.triggerDelayedLocationChange('/today');
      } else if (
        isLoggedIn && (
          !nextProfile.firstName ||
          !nextProfile.lastName ||
          !emailOk ||
          !acceptedPrivacyPolicy)
      ) {
        this.triggerDelayedLocationChange('/userinfo');
        this.setState({ redirected: true });
      } else if (wasProfileLoaded !== isProfileLoaded) {
        const currentLocation = this.props.location.pathname.substring(1);
        const landingPage = _.get(nextProfile, 'landingPage', 'today');
        if (_.isEmpty(currentLocation) && !_.isEmpty(landingPage)) {
          this.triggerDelayedLocationChange(`/${landingPage}`);
        }
        this.setState({ redirected: true });
      }
    }
  }

  triggerDelayedLocationChange(newLocation: string) {
    setTimeout(() => {
      this.props.history.push(newLocation);
    }, 100);
  }

  changeLanguage(newLanguage: string) {
    const { dispatch } = this.props;
    dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { profile, settings, isAdmin, location } = this.props;
    const { userInfoOk } = this.state;

    if (isLoaded(settings) && isEmpty(settings)) {
      return <InitialSetup profile={profile} />;
    }

    const printPage = location.pathname.indexOf('print') !== -1;

    return (
      <div>
        <ThemeHandler />

        <EventLoader />
        <CategoryLoader />
        <ParticipationsLoader />
        <UploadedCategoryLogosLoader />
        <OpeningHoursExceptionLoader />
        <ArticleLoader />
        <HighLightsLoader />
        {isAdmin && <UsersLoader />}

        {!printPage &&
          <>
            <TitleBar returnToFrontpage={() => this.props.history.push('/today')} />
            <Navbar changeLanguage={this.changeLanguage} />
            <div className="is-hidden-tablet is-centered is-fullwidth level box">
              <div className="level-item openinghours-mobile"><OpeningHours /></div>
            </div>
          </>
        }

        {userInfoOk &&
          <>
            <MainViewRoutes isAdmin={isAdmin} />
          </>
        }

        {!userInfoOk &&
          <UserInfo />
        }

        {(isLoaded(settings) && !printPage) &&
          <FooterBar />
        }
      </div>
    );

  }
}
