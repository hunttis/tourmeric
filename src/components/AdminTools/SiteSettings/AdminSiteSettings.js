import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import _ from 'lodash';
import { PageTitles } from './PageTitles';
import { Localization } from './Localization';
import { Themes } from './Themes';
import FeatureEditor from '../FeatureEditor/FeatureEditor-container';
import PrivacyPolicyEditor from './PrivacyPolicyEditor-container';
import FooterEditor from './FooterEditor-container';

export default class AdminSiteSettings extends Component {

  state = { activeItem: null }

  switchActiveSiteSettingsTab(type) {
    this.setState({ activeItem: type });
  }

  defaultDateFormat() {
    firebase.update('/settings', { dateFormat: 'DD.MM.YYYY' });
  }

  changeTheme(newTheme) {
    firebase.update('/settings', { theme: newTheme });
  }

  render() {
    const { settings, profile } = this.props;

    const showDefaultButton = (settings && settings.dateFormat !== 'DD.MM.YYYY');

    const themes = ['Default', 'Cerulean', 'Cosmo', 'Cyborg',
      'Darkly', 'Flatly', 'Journal', 'Litera', 'Lumen', 'Lux', 'Materia',
      'Minty', 'Nuclear', 'Pulse', 'Sandstone', 'Simplex', 'Slate', 'Solar',
      'Spacelab', 'Superhero', 'United', 'Yeti'];

    const activePage = this.state.activeItem || _.get(profile, 'landingSubpage', 'pagetitles');


    const pageTitlesVisible = activePage === 'pagetitles';
    const localizationVisible = activePage === 'localization';
    const themesVisible = activePage === 'themes';
    const featuresVisible = activePage === 'features';
    const privacyPolicyVisible = activePage === 'privacypolicy';
    const footerVisible = activePage === 'footer';

    if (isLoaded(settings)) {
      return (

        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <SiteSettingsTab tabid="pagetitlestab" isActive={pageTitlesVisible} switchAction={() => this.switchActiveSiteSettingsTab('pagetitles')} icon="fa-pencil-alt" translationKey="pagetitles" />
              <SiteSettingsTab tabid="localizationtab" isActive={localizationVisible} switchAction={() => this.switchActiveSiteSettingsTab('localization')} icon="fa-globe" translationKey="localization" />
              <SiteSettingsTab tabid="themestab" isActive={themesVisible} switchAction={() => this.switchActiveSiteSettingsTab('themes')} icon="fa-star" translationKey="looks" />
              <SiteSettingsTab tabid="featurestab" isActive={featuresVisible} switchAction={() => this.switchActiveSiteSettingsTab('features')} icon="fa-star" translationKey="features" />
              <SiteSettingsTab tabid="privacypolicytab" isActive={privacyPolicyVisible} switchAction={() => this.switchActiveSiteSettingsTab('privacypolicy')} icon="fa-book" translationKey="privacypolicy" />
              <SiteSettingsTab tabid="footertab" isActive={privacyPolicyVisible} switchAction={() => this.switchActiveSiteSettingsTab('footer')} icon="fa-arrow-down" translationKey="footer" />
            </ul>
          </div>
          <div className="section">
            {pageTitlesVisible && <PageTitles settings={settings} />}
            {localizationVisible && <Localization settings={settings} showDefaultButton={showDefaultButton} defaultDateFormat={this.defaultDateFormat} />}
            {themesVisible && <Themes settings={settings} themes={themes} changeTheme={this.changeTheme} />}
            {featuresVisible && <FeatureEditor settings={settings} themes={themes} changeTheme={this.changeTheme} />}
            {privacyPolicyVisible && <PrivacyPolicyEditor />}
            {footerVisible && <FooterEditor />}
          </div>
        </div>
      );
    }
    return <div><Translate id="loading" /></div>;
  }

}

const SiteSettingsTab = ({ tabid, isActive, switchAction, icon, translationKey }) => (
  <li id={tabid} className={`sitesettingstab has-icon ${isActive && 'is-active'}`}>
    <a onClick={switchAction}>
      <span className="icon is-small"><i className={`fas ${icon}`} aria-hidden="true" /></span>
      <span><Translate id={translationKey} /></span>
    </a>
  </li>
);

SiteSettingsTab.propTypes = {
  tabid: PropTypes.string,
  isActive: PropTypes.bool,
  switchAction: PropTypes.func,
  icon: PropTypes.string,
  translationKey: PropTypes.string,
};

AdminSiteSettings.propTypes = {
  settings: PropTypes.object,
  profile: PropTypes.object,
};
