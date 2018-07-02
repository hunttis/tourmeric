import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import UserEditor from './UserEditor';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=displayName'] },
  ]),
  connect(state => ({
    users: state.firebase.ordered.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(UserEditor);
