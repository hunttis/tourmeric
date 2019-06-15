import React, { Component } from 'react';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import _ from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { History } from 'history';
import PageTitles from './PageTitles-container';
import Localization from './Localization-container';
import Themes from './Themes-container';
import FeatureEditor from '../FeatureEditor/FeatureEditor-container';
import PrivacyPolicyEditor from './PrivacyPolicyEditor-container';
import FooterEditor from './FooterEditor-container';
import { AdminToolsTab } from '../AdminToolsTab';
import { Settings } from '~/models/Settings';
import { FirebaseProfile } from '~/models/ReduxState';


interface Props {
  settings: Settings;
  profile: FirebaseProfile;
  location: Location;
  history: History;
}

export default class AdminSiteSettings extends Component<Props> {

  switchActiveSiteSettingsTab(page: string) {
    this.props.history.push(`/admin/sitesettings/${page}`);
  }

  defaultDateFormat() {
    firebase.update('/settings', { dateFormat: 'DD.MM.YYYY' });
  }

  changeTheme(newTheme: string) {
    firebase.update('/settings', { theme: newTheme });
  }

  render() {
    const { settings, profile, location } = this.props;

    const isProfileLoaded = isLoaded(profile);
    const isLoggedIn = isProfileLoaded && !isEmpty(profile);
    const isAdmin = isLoggedIn && _.get(profile, 'role', 'user') === 'admin';

    if (!isAdmin) {
      return <div />;
    }

    let activeItem = location.pathname;
    if (activeItem === '/admin/sitesettings') {
      activeItem = '/admin/sitesettings/pagetitles';
    }

    if (isLoaded(settings)) {
      return (

        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/pagetitles'} switchAction={() => this.switchActiveSiteSettingsTab('pagetitles')} icon="fa-pencil-alt" translationKey="pagetitles" />
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/localization'} switchAction={() => this.switchActiveSiteSettingsTab('localization')} icon="fa-globe" translationKey="localization" />
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/themes'} switchAction={() => this.switchActiveSiteSettingsTab('themes')} icon="fa-star" translationKey="looks" />
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/features'} switchAction={() => this.switchActiveSiteSettingsTab('features')} icon="fa-star" translationKey="features" />
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/privacypolicy'} switchAction={() => this.switchActiveSiteSettingsTab('privacypolicy')} icon="fa-book" translationKey="privacypolicy" />
              <AdminToolsTab isActive={activeItem === '/admin/sitesettings/footer'} switchAction={() => this.switchActiveSiteSettingsTab('footer')} icon="fa-arrow-down" translationKey="footer" />
            </ul>
          </div>
          <Switch>
            <Route exact path="/admin/sitesettings" component={PageTitles} />
            <Route path="/admin/sitesettings/pagetitles" component={PageTitles} />
            <Route path="/admin/sitesettings/localization" component={Localization} />
            <Route path="/admin/sitesettings/themes" component={Themes} />
            <Route path="/admin/sitesettings/features" component={FeatureEditor} />
            <Route path="/admin/sitesettings/privacypolicy" component={PrivacyPolicyEditor} />
            <Route path="/admin/sitesettings/footer" component={FooterEditor} />
          </Switch>

        </div>
      );
    }
    return <div><Translate id="loading" /></div>;
  }
}
