import React from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
import _ from 'lodash';
import { isLoaded } from 'react-redux-firebase';
import PrivacyPolicy from './PrivacyPolicy/PrivacyPolicy-container';
import { Settings } from '../../models/Settings';

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
        <div className="columns is-multiline">

          {hasAtLeastOneSponsor &&
            <>
              <div className="column is-12 has-text-centered is-hidden-tablet">
                <FormattedMessage id="sponsoredby" />:
              </div>
              <div className="column is-6 has-text-left is-hidden-mobile">
                <FormattedMessage id="sponsoredby" />:
              </div>
              <div className="column is-6 has-text-right is-hidden-mobile">
                <PrivacyPolicy showAcceptance={false} />
              </div>
            </>
          }

          {showingSponsors &&
            <>
              {settings.footer && Object.entries(settings.footer).map((footerEntry) => {

                const key = footerEntry[0];
                const value = footerEntry[1];

                return (
                  <div key={`Footer-${key}`} className="column sponsor">
                    <figure className="image is-paddingless is-marginless">
                      <a href={value.link} target="_blank" rel="noopener noreferrer" title={value.text}>
                        <img className="footerImage" src={value.image} alt="" />
                      </a>
                    </figure>
                  </div>
                );
              })}
            </>
          }

          <div className="column is-12 has-text-centered is-hidden-tablet">
            <PrivacyPolicy showAcceptance={false} />
          </div>

        </div>
      </div>
    </footer>
  );
};

export default FooterBar;
