import { connect } from 'react-redux';
import { compose } from 'redux';
import { getActiveLanguage } from 'react-localize-redux';

import StoreCreditReport from './StoreCreditReport';

export default compose(
  connect(state => ({
    users: state.firebase.data.users,
    storecreditcategories: state.firebase.data.storecreditcategories,
    storecredit: state.firebase.data.storecredit,
    activeLanguage: getActiveLanguage(state.locale).code,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreCreditReport);
