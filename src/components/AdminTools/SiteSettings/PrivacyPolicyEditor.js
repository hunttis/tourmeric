import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import moment from 'moment';
import EditableTextarea from '../../Common/EditableTextarea-container';

export default class PrivacyPolicyEditor extends Component {

  setAsUpdated() {
    firebase.update('/settings', { privacypolicyupdated: moment().format('YYYY-MM-DD') });
  }

  render() {
    const { settings } = this.props;

    if (isLoaded(settings)) {
      return (
        <Fragment>
          <h1 className="title">
            <Translate id="privacypolicy" />
          </h1>
          <EditableTextarea
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent=""
            placeHolder="privacypolicyplaceholder"
            defaultValue={settings.privacyPolicy}
            path="/settings"
            targetName="privacyPolicy"
            rows={100}
          />
          <button className="button" onClick={() => this.setAsUpdated()}><Translate id="setasupdated" /></button>
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

PrivacyPolicyEditor.propTypes = {
  settings: PropTypes.object,

};
