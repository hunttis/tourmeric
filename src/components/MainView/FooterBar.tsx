import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';
import { isLoaded } from 'react-redux-firebase';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy-container';
import { Settings } from '~/models/Settings';

interface Props {
  settings: Settings;
}

const FooterBar = ({ settings }: Props) => {

  const showingSponsors = _.get(settings, 'showSponsors', false);
  const hasAtLeastOneSponsor = showingSponsors && !_.isEmpty(_.get(settings, 'footer', {}));

  if (!isLoaded(settings)) {
    return <div />;
  }

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
                <a href={_.get(settings, 'footer.first.link', '')} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={_.get(settings, 'footer.first.image', '')} alt="" />
                </a>
              </figure>
            </div>
          }
          {(showingSponsors && _.get(settings, 'footer.second.image')) &&
            <div className="column">
              <figure className="image is-paddingless is-marginless">
                <a href={_.get(settings, 'footer.second.link', '')} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={_.get(settings, 'footer.second.image', '')} alt="" />
                </a>
              </figure>
            </div>
          }
          {(showingSponsors && _.get(settings, 'footer.third.image')) &&
            <div className="column">
              <figure className="image is-paddingless is-marginless">
                <a href={_.get(settings, 'footer.third.link', '')} target="_blank" rel="noopener noreferrer">
                  <img className="footerImage" src={_.get(settings, 'footer.third.image', '')} alt="" />
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
};

export default FooterBar;
