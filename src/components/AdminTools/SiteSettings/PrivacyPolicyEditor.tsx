import React, { Component } from 'react';
import { FormattedMessage, IntlShape } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import firebase from 'firebase/app';
import moment from 'moment';
import EditableTextarea from '../../Common/EditableTextarea-container';
import { Settings } from '../../../models/Settings';

interface Props {
  settings: Settings;
}

export default class PrivacyPolicyEditor extends Component<Props> {

  setAsUpdated() {
    firebase.update('/settings', { privacypolicyupdated: moment().format('YYYY-MM-DD') });
  }

  render() {
    const { settings } = this.props;

    if (isLoaded(settings)) {
      return (
        <>
          <h1 className="title">
            <FormattedMessage id="privacypolicy" />
          </h1>
          <EditableTextarea
            isOk
            updateFieldStatus={() => { }}
            labelContent=""
            placeHolder="privacypolicyplaceholder"
            defaultValue={settings.privacyPolicy}
            path="/settings"
            targetName="privacyPolicy"
            rows={100}
          />
          <button className="button" onClick={() => this.setAsUpdated()}><FormattedMessage id="setasupdated" /></button>
        </>
      );

    }
    return <div><FormattedMessage id="loading" /></div>;
  }
}
