import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import _ from 'lodash';
{/* import { setActiveLanguage, InitializePayload, SingleLanguageTranslation } from 'react-localize-redux'; */}
import Moment from 'react-moment';
import { Location, History } from 'history';
import { renderToStaticMarkup } from 'react-dom/server';
import englishTranslations from '~/translations/en.json';
import finnishTranslations from '~/translations/fi.json';

// import UserInfo from '~/components/UserInfo/UserInfo-container';
import TitleBar from '~/components/MainView/TitleBar-container';
import UserInfoNotice from '~/components/MainView/UserInfoNotice-container';
import ThemeHandler from '~/components/MainView/ThemeHandler-container';
import Navbar from '~/components/MainView/Navbar/Navbar-container';
import InitialSetup from '~/components/MainView/InitialSetup';
import FooterBar from '~/components/MainView/FooterBar-container';
import OpeningHours from '~/components/StoreInfo/OpeningHours-container';

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
  {/* initialize: (payload: InitializePayload) => void;
  addTranslationForLanguage: (
    translation: SingleLanguageTranslation,
    language: string
  ) => void; */}
}

interface State {
  redirected: boolean;
}

export default class MainView extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    {/* this.props.initialize({
      languages: [
        { name: 'English', code: 'en' },
        { name: 'Finnish', code: 'fi' },
      ],
      options: { renderToStaticMarkup },
    });
    this.props.addTranslationForLanguage(englishTranslations, 'en');
    this.props.addTranslationForLanguage(finnishTranslations, 'fi'); */}

    this.changeLanguage = this.changeLanguage.bind(this);
    this.state = { redirected: false };
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (!this.state.redirected) {

      const wasProfileLoaded: boolean = isLoaded(this.props.profile);
      const nextProfile = nextProps.profile;
      const isProfileLoaded: boolean = isLoaded(nextProfile);
      const isLoggedIn: boolean = isProfileLoaded && !isEmpty(nextProfile);

      if (isLoaded(nextProfile) && isEmpty(nextProfile) && ['/userinfo'].indexOf(this.props.location.pathname) !== -1 && !isLoggedIn) {
        this.triggerDelayedLocationChange('/today');
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
    {/* dispatch(setActiveLanguage(newLanguage)); */}
    Moment.globalLocale = newLanguage;
  }

  isUserInfoOk() {
    const isProfileLoaded: boolean = isLoaded(this.props.profile);
    const { profile } = this.props;
    const isLoggedIn: boolean = isProfileLoaded && !isEmpty(profile);
    const acceptedPrivacyPolicy = !!_.get(profile, 'acceptedPrivacyPolicy');
    const providerEmail = _.get(profile, 'providerData[0].email', null);
    const emailOk = (!profile.useOtherEmail && (providerEmail || profile.email)) || (profile.useOtherEmail && profile.otherEmail);
    const namesOk = !!_.get(profile, 'firstName', false) && !!_.get(profile, 'lastName', false);
    const everythingOk = !isLoggedIn || (emailOk && namesOk && acceptedPrivacyPolicy);
    return everythingOk;
  }

  render() {
    const { profile, settings, isAdmin, location } = this.props;
    const userInfoOk = this.isUserInfoOk();

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
              <div className="level-item openinghours-mobile">
                <OpeningHours />
              </div>
            </div>
          </>
        }

        {!userInfoOk && <UserInfoNotice />}

        <MainViewRoutes isAdmin={isAdmin} />

        {(isLoaded(settings) && !printPage) &&
          <FooterBar />
        }

      </div>
    );

  }
}
