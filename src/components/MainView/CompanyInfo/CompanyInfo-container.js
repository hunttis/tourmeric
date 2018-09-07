import { compose } from 'redux';
import { connect } from 'react-redux';

import CompanyInfo from './CompanyInfo';

export default compose(
  connect(state => ({
    settings: state.firebase.data.settings,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CompanyInfo);
