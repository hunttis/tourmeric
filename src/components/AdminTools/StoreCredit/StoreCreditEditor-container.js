import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import StoreCreditEditor from './StoreCreditEditor';

export default compose(
  firebaseConnect([
    { path: '/storecredit' },
    { path: '/users', queryParams: ['orderByChild=displayName'] },
  ]),
  connect(state => ({
    storecredit: state.firebase.data.storecredit,
    settings: state.firebase.data.settings,
    users: state.firebase.ordered.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreCreditEditor);
