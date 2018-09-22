import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isLoaded } from 'react-redux-firebase';
import { Translate } from 'react-localize-redux';
import _ from 'lodash';

export default class CompanyInfo extends Component {

  foo() {}

  render() {
    const { settings } = this.props;

    if (isLoaded(settings)) {
      const companyInfo = _.get(settings, 'companyinfo', '');
      const formattedCompanyInfo = companyInfo.split('\n');

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