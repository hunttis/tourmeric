import React from 'react';
import { isLoaded } from 'react-redux-firebase';
import { FormattedMessage, IntlShape } from "react-intl";
import _ from 'lodash';
import { Settings } from '../../../models/Settings';

interface Props {
  settings: Settings;
}

export const CompanyInfo = ({ settings }: Props) => {
  if (isLoaded(settings)) {
    const companyInfo = _.get(settings, 'companyinfo', '');
    const formattedCompanyInfo = companyInfo.split('\n');

    return (
      <div className="section">
        <h1 className="title"><FormattedMessage id="companyinfo" /></h1>
        {formattedCompanyInfo.map((paragraph: string, index: number) => <p key={`companyinfo-${index}`}>{paragraph}&nbsp;</p>)}
      </div>
    );
  }
  return (
    <div>...</div>
  );
};
