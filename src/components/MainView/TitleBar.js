import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import Moment from 'react-moment';
import Highlights from '../HighLights/HighLights-container';

export default class TitleBar extends Component {

  changeLanguage(newLanguage) {
    this.props.dispatch(setActiveLanguage(newLanguage));
    Moment.globalLocale = newLanguage;
  }

  render() {
    const { settings, returnToFrontpage } = this.props;

    const highlightsActive = _.get(settings, 'features.highlights.active', false);

    const pageTitle = _.get(settings, 'pageTitle', 'Pagetitle not set');
    const pageSubtitle = _.get(settings, 'pageSubtitle', '');
    const settingsLoaded = isLoaded(settings);

    if (settingsLoaded) {
      return (
        <section className="hero titlebar animated">
          <div className="hero-body">
            <div className="columns is-marginless">
              <div className="column is-4 has-text-centered-mobile is-vcentered">
                {settings.activeLogo &&
                  <a onClick={() => returnToFrontpage()}>
                    <div id="logo">
                      <img src={settings.activeLogo} alt="" className="is-hidden-tablet" />

                      <figure className="image is-hidden-mobile">
                        <img src={settings.activeLogo} alt="" />
                      </figure>
                    </div>
                  </a>
                }
                {settings.pageTitle &&
                  <div id="titletext" className="title is-2">
                    {pageTitle}
                  </div>
                }
              </div>
              <div className="column is-8 button-container">
                {highlightsActive && <Highlights />}
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
        <button disabled className="button is-loading is-black"><Translate id="loading" />.</button>
      </div>
    );
  }
}

TitleBar.propTypes = {
  settings: PropTypes.object,
  dispatch: PropTypes.func,
  returnToFrontpage: PropTypes.func,
};
