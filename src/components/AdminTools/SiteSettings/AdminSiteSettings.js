import React, { Component } from 'react';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import { PageTitles } from './PageTitles';
import { Localization } from './Localization';
import { Themes } from './Themes';

export default class AdminSiteSettings extends Component {

  constructor(props) {
    super(props);
    this.changeTheme = this.changeTheme.bind(this);
  }

  defaultDateFormat() {
    firebase.update('/settings', { dateFormat: 'DD.MM.YYYY' });
  }

  changeTheme(newTheme) {
    firebase.update('/settings', { theme: newTheme });
  }

  switchActiveSiteSettingsTab(type) {
    const tabs = document.getElementsByClassName('sitesettingstab');
    const contents = document.getElementsByClassName('sitesettingscontent');

    for (const tab of tabs) {
      tab.classList.remove('is-active');
    }

    for (const content of contents) {
      content.classList.add('is-hidden');
    }

    const activeTab = document.getElementById(`${type}tab`);
    activeTab.classList.add('is-active');
    const activeContent = document.getElementById(`${type}content`);
    activeContent.classList.remove('is-hidden');
  }


  render() {
    const { settings } = this.props;

    const showDefaultButton = (settings && settings.dateFormat !== 'DD.MM.YYYY');

    const themes = ['Default', 'Cerulean', 'Cosmo', 'Cyborg',
      'Darkly', 'Flatly', 'Journal', 'Litera', 'Lumen', 'Lux', 'Materia',
      'Minty', 'Nuclear', 'Pulse', 'Sandstone', 'Simplex', 'Slate', 'Solar',
      'Spacelab', 'Superhero', 'United', 'Yeti'];

    if (!isLoaded(settings)) {
      return <div><Translate id="loading" /></div>;
    } else if (isLoaded(settings)) {
      return (

        <div>
          <div className="tabs is-boxed is-marginless is-multiline">
            <ul>
              <SiteSettingsTab tabid="pagetitlestab" isActive switchAction={() => this.switchActiveSiteSettingsTab('pagetitles')} icon="fa-pencil-alt" translationKey="pagetitles" />
              <SiteSettingsTab tabid="localizationtab" isActive={false} switchAction={() => this.switchActiveSiteSettingsTab('localization')} icon="fa-globe" translationKey="localization" />
              <SiteSettingsTab tabid="themestab" isActive={false} switchAction={() => this.switchActiveSiteSettingsTab('themes')} icon="fa-star" translationKey="themes" />

            </ul>
          </div>
          <div className="section">
            <div id="pagetitlescontent" className="sitesettingscontent">
              <PageTitles settings={settings} />
            </div>
            <div id="localizationcontent" className="sitesettingscontent is-hidden">
              <Localization settings={settings} showDefaultButton={showDefaultButton} />
            </div>
            <div id="themescontent" className="sitesettingscontent is-hidden">
              <Themes settings={settings} themes={themes} changeTheme={this.changeTheme} />
            </div>

          </div>
        </div>
      );
    }
    return <div><Translate id="error" /></div>;
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
};
