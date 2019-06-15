import React, { Fragment } from 'react';
import { Translate } from 'react-localize-redux';
import { isLoaded } from 'react-redux-firebase';
import EditableTextarea from '../../Common/EditableTextarea-container';
import { Settings } from '~/models/Settings';

interface Props {
  settings: Settings;
}

const CompanyInfoEditor = ({ settings }: Props) => {

  if (isLoaded(settings)) {
    return (
      <Fragment>
        <h1 className="title">
          <Translate id="companyinfo" />
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
        {/* <button className="button" onClick={() => this.setAsUpdated()}><Translate id="setasupdated" /></button> */}
      </Fragment>
    );

  }
  return <div><Translate id="loading" /></div>;
};

export default CompanyInfoEditor;
