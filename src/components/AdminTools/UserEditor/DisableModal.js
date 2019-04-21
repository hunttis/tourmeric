import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';

const disableUser = (userId) => {
  firebase.update(`/users/${userId}`, { active: false });
};

export const DisableModal = ({ userId, userData }) => (
  <Fragment>
    <div className="box">
      <h1 className="title"><Translate id="disablethisuser" /></h1>
      <ul>
        {userData.displayName &&
        <li><Translate id="displayname" />: {userData.displayName}</li>
          }
        {userData.username &&
        <li><Translate id="username" />: {userData.username}</li>
          }
        <li><Translate id="email" />: {userData.email}</li>
        {userData.avatarUrl &&
        <li><Translate id="avatarurl" />:&nbsp;
          <a target="_blank" rel="noopener noreferrer" href={userData.avatarUrl}>{userData.avatarUrl.substr(0, 20)}...</a>
        </li>
          }
        {userData.dciNumber &&
        <li><Translate id="dcinumber" />: {userData.dciNumber}</li>
          }
      </ul>
      <hr />
      <div className="level">
        <div className="level-item">
          <button className="button is-danger is-small" onClick={() => disableUser(userId)}>Yes</button>
          <button className="button is-primary is-large">No</button>
        </div>
      </div>
    </div>
  </Fragment>
);

DisableModal.propTypes = {
  userId: PropTypes.string,
  userData: PropTypes.object,
};
