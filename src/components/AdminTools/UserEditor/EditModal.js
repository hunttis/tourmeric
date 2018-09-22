import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import EditableField from '../../Common/EditableField-container';

export const EditModal = ({ userId, userData }) => (
  <Fragment>
    <div className="box">
      <EditableField
        defaultValue={userData.displayName}
        labelContent="shownname"
        placeHolder="exampleshownname"
        path={`/users/${userId}`}
        targetName="displayName"
      />

      <EditableField
        defaultValue={userData.firstName}
        labelContent="firstname"
        placeHolder="firstname"
        path={`/users/${userId}`}
        targetName="firstName"
      />

      <EditableField
        defaultValue={userData.lastName}
        labelContent="lastname"
        placeHolder="lastname"
        path={`/users/${userId}`}
        targetName="lastName"
      />

      <EditableField
        defaultValue={userData.email}
        labelContent="email"
        placeHolder="exampleemail"
        path={`/users/${userId}`}
        targetName="email"
      />

      <EditableField
        defaultValue={userData.avatarUrl}
        labelContent="avatarurl"
        placeHolder="avatar image url"
        path={`/users/${userId}`}
        targetName="avatarURL"
      />

      <EditableField
        defaultValue={userData.username}
        labelContent="username"
        placeHolder="username"
        path={`/users/${userId}`}
        targetName="username"
      />

      <div className="field is-horizontal">
        <div className="field-label is-normal">
          <label className="label"><Translate id="role" /></label>
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control is-expanded">
              <div className="select">
                <select
                  defaultValue={userData.role}
                  onChange={event => firebase.update(`/users/${userId}`, { role: event.target.value })}
                >
                  <option value={null}><Translate id="select" /></option>
                  <option value="user"><Translate id="roleuser" /></option>
                  <option value="admin"><Translate id="roleadmin" /></option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);


EditModal.propTypes = {
  userId: PropTypes.string,
  userData: PropTypes.object,
};