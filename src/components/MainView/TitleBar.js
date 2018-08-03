import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
import Moment from 'react-moment';
import { logout } from '../../api/loginApi';
import flagFI from '../../images/fi.png';
import flagEN from '../../images/uk.png';

export default class TitleBar extends Component {

  changeLanguage(newLanguage) {
    this.props.dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { settings, languages, profile } = this.props;

    const currentLanguage = _.find(languages, 'active').code;
    const pageTitle = _.get(settings, 'pageTitle', 'Pagetitle not set');
    const pageSubtitle = _.get(settings, 'pageSubtitle', '');
    const settingsLoaded = isLoaded(settings);
    const profileLoaded = isLoaded(profile);
    const loggedIn = isLoaded(profile) && !isEmpty(profile);

    if (settingsLoaded) {
      return (
        <section className="hero titlebar animated">
          <div className="hero-body">
            <div className="columns is-marginless is-tablet">
              <div className="column is-6">
                {settings.activeLogo &&
                  <div id="logo">
                    <img src={settings.activeLogo} alt="" />
                  </div>
                }
                {settings.pageTitle &&
                  <div id="titletext" className="title is-2">
                    {pageTitle}
                  </div>
                }
              </div>

              <div className="column is-6 button-container">
                {!profileLoaded &&
                  <button className="button is-rounded is-loading is-half" />
                }
                {profileLoaded &&
                  <div className="field has-addons language-and-log-buttons">

                    <p className="control">
                      <button className={`button is-rounded ${(currentLanguage === 'en') ? 'is-primary' : ''}`} onClick={() => this.changeLanguage('en')}><img src={flagEN} className="languageflag" alt="Finnish" /> En</button>
                    </p>
                    <p className="control">
                      <button className={`button is-rounded ${(currentLanguage === 'fi') ? 'is-primary' : ''}`} onClick={() => this.changeLanguage('fi')}><img src={flagFI} className="languageflag" alt="Finnish" /> Fi</button>
                    </p>

                    {loggedIn &&
                      <p className="control">
                        <button className="button is-rounded" onClick={() => logout()}>
                          <p><Translate id="logout" /></p>
                          <span className="icon">
                            <i className="fas fa-sign-out-alt" />
                          </span>
                        </button>
                      </p>
                    }

                  </div>
                }
              </div>

            </div>
            {pageSubtitle &&
              <div id="subtitletext" className="subtitle has-text-grey-light is-6 is-paddingless is-marginless">
                {pageSubtitle}
              </div>
            }
          </div>
        </section>
      );
    }

    return (
      <div className="title has-text-centered">
        <div className="level" />
        <button disabled className="button is-loading is-purple"><Translate id="loading" />.</button>
      </div>
    );
  }
}

TitleBar.propTypes = {
  settings: PropTypes.object,
  languages: PropTypes.array,
  profile: PropTypes.object,
  dispatch: PropTypes.func,
};
