import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { CategoryLoader } from './CategoryLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/categories' },
  ]),
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(CategoryLoader) as React.ComponentType<any>;
