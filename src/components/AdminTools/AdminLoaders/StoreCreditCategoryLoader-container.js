import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { StoreCreditCategoryLoader } from './StoreCreditCategoryLoader';

export default compose(
  firebaseConnect([
    { path: '/storecreditcategories' },
  ]),
  connect(state => ({
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreCreditCategoryLoader);
