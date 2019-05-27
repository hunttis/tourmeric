import { connect } from 'react-redux';
import { compose } from 'redux';

import StoreCreditTable from './StoreCreditTable';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    users: state.firebase.ordered.users,
    storecreditcategories: state.firebase.data.storecreditcategories,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(StoreCreditTable) as React.ComponentType<any>;
