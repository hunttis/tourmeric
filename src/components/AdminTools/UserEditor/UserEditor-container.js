import { connect } from 'react-redux';
import { compose } from 'redux';

import UserEditor from './UserEditor';

export default compose(
  connect(state => ({
    storecredit: state.firebase.data.storecredit,
    users: state.firebase.ordered.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(UserEditor);
