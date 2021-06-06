import React from 'react';
import { FormattedMessage, IntlShape } from "react-intl";

import { History, Location } from 'history';
import { FirebaseProfile } from '../../models/ReduxState';

interface Props {
  profile: FirebaseProfile;
  history: History;
  location: Location;
}

export const UserInfoNotice = ({ history, location, profile }: Props) => (
  <section className="hero is-danger">
    <div className="hero-body">

      {location.pathname.indexOf('userinfo') === -1 &&
        <>
          <h1 className="title">Notice!</h1>
          <h2 className="subtitle">
            <FormattedMessage id="loggedinbutneedinfo" />
            <br />
            <FormattedMessage id="youcantparticipatebeforeyoudo" />
          </h2>
          <button className="button is-dark" onClick={() => history.push('/userinfo')}>
            <FormattedMessage id="clickhere" />
          </button>
        </>
      }

      {location.pathname.indexOf('userinfo') !== -1 &&
        <>
          <h2 className="subtitle">
            <span className="icon"><i className="fas fa-arrow-down" /></span>
            <span><FormattedMessage id="pleasefillinfobelow" /></span>
            <span className="icon"><i className="fas fa-arrow-down" /></span>
          </h2>
          <FormattedMessage id="thingstodo" />
          {!profile.acceptedPrivacyPolicy && <p>- <FormattedMessage id="acceptprivacypolicy" /></p>}
          {!profile.firstName && <p>- <FormattedMessage id="addfirstname" /></p>}
          {!profile.lastName && <p>- <FormattedMessage id="addlastname" /></p>}
        </>
      }
    </div>
  </section>
);
