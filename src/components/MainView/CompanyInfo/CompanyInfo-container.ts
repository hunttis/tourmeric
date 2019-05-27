import { compose } from 'redux';
import { connect } from 'react-redux';

import { CompanyInfo } from './CompanyInfo';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(CompanyInfo) as React.ComponentType<any>;
