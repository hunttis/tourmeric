import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Translate, setActiveLanguage } from 'react-localize-redux';
import { isLoaded, isEmpty } from 'react-redux-firebase';
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
    const settingsLoaded = isLoaded(settings) && !isEmpty(settings);

    if (settingsLoaded) {
      return (
        <Fragment>
          {/* Mobile hero bar */}
          <section className="hero titlebar is-small is-hidden-tablet">
            <div className="hero-body ">
              <div className="container has-text-centered is-flex is-horizontal-center">
                {settings.activeLogo &&
                <a onClick={() => returnToFrontpage()}>
                  <figure className="image is-128x128 is-flex is-vertical-center">
                    <img src={settings.activeLogo} alt="" />
                  </figure>
                </a>
              }
                {settings.pageTitle &&
                <div id="titletext" className="title is-2">
                  {pageTitle}
                </div>
              }
                {pageSubtitle &&
                <div id="subtitletext" className="subtitle has-text-grey-light is-6 is-paddingless is-marginless">
                  {pageSubtitle}
                </div>
              }
              </div>
              <div className="container button-container">
                {highlightsActive && <Highlights />}
              </div>
            </div>
          </section>

          {/* Non-Mobile hero bar */}
          <section className="hero titlebar is-hidden-mobile">
            <div className="hero-body is-hidden-mobile">
              <div className="columns is-marginless">
                <div className="column is-2 is-vcentered">
                  {settings.activeLogo &&
                  <a onClick={() => returnToFrontpage()}>
                    <div id="logo" className="is-paddingless is-marginless">
                      <figure className="image">
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
                <div className="column button-container">
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
        </Fragment>
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
