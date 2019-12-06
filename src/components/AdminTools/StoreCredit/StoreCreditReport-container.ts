import { connect } from 'react-redux';
import { compose } from 'redux';
import { withLocalize } from 'react-localize-redux';

import StoreCreditReport from './StoreCreditReport';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    users: state.firebase.data.users,
    storecreditcategories: state.firebase.data.storecreditcategories,
    storecredit: state.firebase.data.storecredit,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withLocalize<any>(StoreCreditReport)) as React.ComponentType<any>;
