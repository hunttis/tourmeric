import { connect } from 'react-redux';
import { compose } from 'redux';

import UserEditor from './UserEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    storecredit: state.firebase.data.storecredit,
    users: state.firebase.ordered.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(UserEditor) as React.ComponentType<any>;
