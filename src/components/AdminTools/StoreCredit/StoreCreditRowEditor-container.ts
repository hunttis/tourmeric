import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import _ from 'lodash';
import { StoreCreditRowEditor } from './StoreCreditRowEditor';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => {
    const idFromUrl = _.last(state.router.location.pathname.split('/'));
    const userIdFromUrl = _.nth(state.router.location.pathname.split('/'), 4);

    return ({
      dataId: idFromUrl,
      storecreditcategories: state.firebase.data.storecreditcategories,
      data: state.firebase.data.storecredit[userIdFromUrl!][idFromUrl!],
      isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
    });
  }),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any, any>(StoreCreditRowEditor)) as React.ComponentType<any>;
