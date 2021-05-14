import React from 'react';
import { Translate } from 'react-localize-redux';

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
            <Translate id="loggedinbutneedinfo" />
            <br />
            <Translate id="youcantparticipatebeforeyoudo" />
          </h2>
          <button className="button is-dark" onClick={() => history.push('/userinfo')}>
            <Translate id="clickhere" />
          </button>
        </>
      }

      {location.pathname.indexOf('userinfo') !== -1 &&
        <>
          <h2 className="subtitle">
            <span className="icon"><i className="fas fa-arrow-down" /></span>
            <span><Translate id="pleasefillinfobelow" /></span>
            <span className="icon"><i className="fas fa-arrow-down" /></span>
          </h2>
          <Translate id="thingstodo" />
          {!profile.acceptedPrivacyPolicy && <p>- <Translate id="acceptprivacypolicy" /></p>}
          {!profile.firstName && <p>- <Translate id="addfirstname" /></p>}
          {!profile.lastName && <p>- <Translate id="addlastname" /></p>}
        </>
      }
    </div>
  </section>
);
