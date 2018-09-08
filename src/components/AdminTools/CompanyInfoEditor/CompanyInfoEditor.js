import React, { Component, Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import PropTypes from 'prop-types';
import EditableTextarea from '../../Common/EditableTextarea-container';

export default class CompanyInfoEditor extends Component {

  render() {
    const { settings } = this.props;

    if (isLoaded(settings)) {
      return (
        <Fragment>
          <h1 className="title">
            <Translate id="companyinfo" />
          </h1>
          <EditableTextarea
            isOk
            updateFieldStatus={this.updateFieldStatus}
            labelContent=""
            placeHolder="companyinfoplaceholder"
            defaultValue={settings.companyinfo}
            path="/settings"
            targetName="companyinfo"
            rows={10}
          />
          {/* <button className="button" onClick={() => this.setAsUpdated()}><Translate id="setasupdated" /></button> */}
        </Fragment>
      );

    }
    return <div><Translate id="loading" /></div>;
  }
}

CompanyInfoEditor.propTypes = {
  settings: PropTypes.object,

};
