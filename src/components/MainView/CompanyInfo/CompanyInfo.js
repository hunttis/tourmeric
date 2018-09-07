import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export default class CompanyInfo extends Component {

  foo() {}

  render() {
    const { settings } = this.props;
    console.log(settings);

    if (isLoaded(settings)) {
      const companyInfo = _.get(settings, 'companyinfo', '');
      const formattedCompanyInfo = companyInfo.split('\n');
      console.log(formattedCompanyInfo);

      return (
        <div className="section">
          <h1 className="title"><Translate id="companyinfo" /></h1>
          {formattedCompanyInfo.map((paragraph, index) => <p key={`companyinfo-${index}`}>{paragraph}&nbsp;</p>)}
        </div>
      );
    }
    return (
      <div>...</div>
    );
  }
}

CompanyInfo.propTypes = {
  settings: PropTypes.object,
};
