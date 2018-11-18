import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { UsersLoader } from './UsersLoader';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=lastName'] },
  ]),
  connect(state => ({
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(UsersLoader);
