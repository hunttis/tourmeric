import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';

import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy-container';

export default class FooterBar extends Component {

  foo() {}

  render() {

    const { settings } = this.props;

    const showingSponsors = _.get(settings, 'showSponsors', false);
    const hasAtLeastOneSponsor = showingSponsors && !_.isEmpty(_.get(settings, 'footer', {}));

    return (
      <footer className="footer less-bottompadding">
        <div className="content">
          <div className="columns">

            {hasAtLeastOneSponsor &&
            <Fragment>
              <div className="column has-text-centered is-hidden-desktop">
                <Translate id="sponsoredby" />:
              </div>
              <div className="column has-text-left is-hidden-mobile">
                <Translate id="sponsoredby" />:
              </div>
            </Fragment>
            }
            {(showingSponsors && _.get(settings, 'footer.first.image')) &&
            <div className="column is-vcentered">
              <figure className="image is-paddingless is-marginless">
                <a href={settings.footer.first.link} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={settings.footer.first.image} alt="" />
                </a>
              </figure>
            </div>
            }
            {(showingSponsors && _.get(settings, 'footer.second.image')) &&
            <div className="column">
              <figure className="image is-paddingless is-marginless">
                <a href={settings.footer.second.link} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={settings.footer.second.image} alt="" />
                </a>
              </figure>
            </div>
            }
            {(showingSponsors && _.get(settings, 'footer.third.image')) &&
            <div className="column">
              <figure className="image is-paddingless is-marginless">
                <a href={settings.footer.third.link} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={settings.footer.third.image} alt="" />
                </a>
              </figure>
            </div>
            }
            <div className="column has-text-centered is-hidden-desktop">
              <PrivacyPolicy showAcceptance={false} />
            </div>
            <div className="column has-text-right is-hidden-mobile">
              <PrivacyPolicy showAcceptance={false} />
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

FooterBar.propTypes = {
  settings: PropTypes.object,
};
