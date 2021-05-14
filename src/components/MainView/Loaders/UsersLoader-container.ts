import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { UsersLoader } from './UsersLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=lastName'] },
  ]),
  connect((state: ReduxState) => ({
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(UsersLoader) as React.ComponentType<any>;
