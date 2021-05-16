import React from 'react';
import { FormattedMessage } from "react-intl";
import firebase from 'firebase/app';
import { User } from '../../../models/ReduxState';

const disableUser = (userId: string | undefined) => {
  if (userId) {
    firebase.update(`/users/${userId}`, { active: false });
  }
};

interface Props {
  userId: string | undefined;
  userData: User | undefined;
}

export const DisableModal = ({ userId, userData }: Props) => (
  <>
    <div className="box">
      <h1 className="title"><FormattedMessage id="disablethisuser" /></h1>
      <ul>
        {userData && userData.displayName &&
          <li><FormattedMessage id="displayname" />: {userData.displayName}</li>
        }
        {userData && userData.username &&
          <li><FormattedMessage id="username" />: {userData.username}</li>
        }
        <li><FormattedMessage id="email" />: {userData && userData.email}</li>
        {userData && userData.avatarUrl &&
          <li><FormattedMessage id="avatarurl" />:&nbsp;
            <a target="_blank" rel="noopener noreferrer" href={userData.avatarUrl}>{userData.avatarUrl.substr(0, 20)}...</a>
          </li>
        }
        {userData && userData.dciNumber &&
          <li><FormattedMessage id="dcinumber" />: {userData.dciNumber}</li>
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
  </>
);
