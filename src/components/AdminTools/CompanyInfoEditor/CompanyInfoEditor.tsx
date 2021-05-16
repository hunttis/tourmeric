import React from 'react';
import { FormattedMessage } from "react-intl";
import { isLoaded } from 'react-redux-firebase';
import EditableTextarea from '../../Common/EditableTextarea-container';
import { Settings } from '../../../models/Settings';

interface Props {
  settings: Settings;
}

const CompanyInfoEditor = ({ settings }: Props) => {

  if (isLoaded(settings)) {
    return (
      <>
        <h1 className="title">
          <FormattedMessage id="companyinfo" />
        </h1>
        <EditableTextarea
          isOk
          updateFieldStatus={() => { }}
          labelContent=""
          placeHolder="companyinfoplaceholder"
          defaultValue={settings.companyinfo}
          path="/settings"
          targetName="companyinfo"
          rows={10}
        />
        {/* <button className="button" onClick={() => this.setAsUpdated()}><FormattedMessage id="setasupdated" /></button> */}
      </>
    );

  }
  return <div><FormattedMessage id="loading" /></div>;
};

export default CompanyInfoEditor;
