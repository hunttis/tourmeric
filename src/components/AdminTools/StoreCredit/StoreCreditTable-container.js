import { connect } from 'react-redux';
import { compose } from 'redux';

import StoreCreditTable from './StoreCreditTable';

export default compose(
  connect(state => ({
    users: state.firebase.ordered.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(StoreCreditTable);
