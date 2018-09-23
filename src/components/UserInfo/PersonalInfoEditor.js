import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import EditableVerticalField from '../Common/EditableVerticalField-container';

export const PersonalInfoEditor = ({ profile, auth }) => (
  <Fragment>
    <h1 className="title"><Translate id="personalinfo" /></h1>
    <div className="columns is-multiline">

      <div className="column is-12 has-text-info">
        <p><Translate id="alltheinformationenteredhereissavedautomatically" /></p>
      </div>

      <div className="column is-12">
        <EditableVerticalField
          labelContent="firstname"
          placeHolder="firstnameplaceholder"
          defaultValue={profile.firstName}
          path={`/users/${auth.uid}`}
          targetName="firstName"
          idleIcon="fa-address-book"
          emptyClass="is-danger"
        />
      </div>

      <div className="column is-12">
        <EditableVerticalField
          labelContent="lastname"
          placeHolder="lastnameplaceholder"
          defaultValue={profile.lastName}
          path={`/users/${auth.uid}`}
          targetName="lastName"
          idleIcon="fa-address-book"
          emptyClass="is-danger"
        />
      </div>

      <div className="column is-12">
        <EditableVerticalField
          labelContent="email"
          placeHolder="emailplaceholder"
          defaultValue={profile.email}
          path={`/users/${auth.uid}`}
          targetName="email"
          idleIcon="fa-envelope"
          emptyClass="is-danger"
        />
      </div>

      <div className="column is-12">
        <EditableVerticalField
          labelContent="dcinumber"
          placeHolder="dcinumberplaceholder"
          defaultValue={profile.dciNumber}
          path={`/users/${auth.uid}`}
          targetName="dciNumber"
          idleIcon="fa-magic"
        />
      </div>


      <div className="column is-12">
        <div className="level">
          <div className="level-left">
            <Translate id="youcansendmeanewsletter" />:
          </div>

          <div className="level-right">
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { acceptsNewsletter: true }); }} className={`button ${profile.acceptsNewsletter && 'is-success'}`}><Translate id="yes" /></button>
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { acceptsNewsletter: false }); }} className={`button ${!profile.acceptsNewsletter && 'is-danger'}`}><Translate id="no" /></button>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

PersonalInfoEditor.propTypes = {
  profile: PropTypes.object,
  auth: PropTypes.object,
};
