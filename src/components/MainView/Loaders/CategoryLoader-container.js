import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { CategoryLoader } from './CategoryLoader';

export default compose(
  firebaseConnect([
    { path: '/categories' },
  ]),
  connect(state => ({
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(CategoryLoader);
