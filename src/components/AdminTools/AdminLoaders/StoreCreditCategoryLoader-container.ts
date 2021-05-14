import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { StoreCreditCategoryLoader } from './StoreCreditCategoryLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/storecreditcategories' },
  ]),
  connect((state: ReduxState) => ({
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(StoreCreditCategoryLoader) as React.ComponentType<any>;
