import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import { withRouter } from 'react-router-dom';
import StoreCreditTable from './StoreCreditTable';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    users: state.firebase.ordered.users,
    storecreditcategories: state.firebase.data.storecreditcategories,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(StoreCreditTable)) as React.ComponentType<any>;
