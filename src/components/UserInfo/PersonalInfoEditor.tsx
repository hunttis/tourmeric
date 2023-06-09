import React from 'react';
import { Translate } from 'react-localize-redux';
import firebase from 'firebase/app';
import _ from 'lodash';
import EditableVerticalField from '../Common/EditableVerticalField-container';
import { FirebaseProfile, FirebaseAuth } from '~/models/ReduxState';

interface Props {
  profile: FirebaseProfile;
  auth: FirebaseAuth;
}

export const PersonalInfoEditor = ({ profile, auth }: Props) => (
  <>
    <h1 className="title"><Translate id="personalinfo" /></h1>
    <div className="columns is-multiline">

      <div className="column is-12 has-text-info">
        <p><Translate id="alltheinformationenteredhereissavedautomatically" /></p>
      </div>

      <div className="column is-12">
        <hr />
        <h2 className="subtitle">
          <Translate id="name" />
        </h2>
      </div>

      <div className="column is-12 is-half-desktop">
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

      <div className="column is-12 is-half-desktop">
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
        <hr />
        <h2 className="subtitle">
          <Translate id="emailinfo" />
        </h2>
      </div>


      <div className="column is-12">
        <EditableVerticalField
          labelContent="emailfromsocialmedia"
          placeHolder="emailplaceholder"
          defaultValue={_.get(profile, 'providerData[0].email')}
          path={`/users/${auth.uid}`}
          targetName="email"
          idleIcon="fa-lock"
          emptyClass="is-danger"
          disabled
        />
      </div>

      <div className="column is-12">
        <div className="level">
          <div className="level-left">
            <Translate id="useotheremail" />:
          </div>
          <div className="level-right">
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { useOtherEmail: true }); }} className={`button ${profile.useOtherEmail && 'is-success'}`}><Translate id="yes" /></button>
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { useOtherEmail: false }); }} className={`button ${!profile.useOtherEmail && 'is-danger'}`}><Translate id="no" /></button>
          </div>
        </div>
      </div>

      {profile.useOtherEmail &&
        <div className="column is-12">
          <EditableVerticalField
            labelContent="otheremail"
            placeHolder="emailplaceholder"
            defaultValue={profile.otherEmail}
            path={`/users/${auth.uid}`}
            targetName="otherEmail"
            idleIcon="fa-envelope"
            emptyClass="is-danger"
          />
        </div>
      }

      <div className="column is-12">
        <div className="level">
          <div className="level-left">
            <Translate id="youcansendmeanewsletter" />:
          </div>

          <div className="level-right">
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { acceptsNewsletter: true }); }} className={`button ${profile.acceptsNewsLetter && 'is-success'}`}><Translate id="yes" /></button>
            <button onClick={() => { firebase.update(`/users/${auth.uid}`, { acceptsNewsletter: false }); }} className={`button ${!profile.acceptsNewsLetter && 'is-danger'}`}><Translate id="no" /></button>
          </div>
        </div>
      </div>

      <div className="column is-12">
        <hr />
        <h2 className="subtitle">
          <Translate id="otherinfo" />
        </h2>
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

    </div>
  </>
);
