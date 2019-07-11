import { connect } from 'react-redux';
import { compose } from 'redux';
import _ from 'lodash';

import { ReduxState } from '~/models/ReduxState';
import { AddPlaceHolderUser } from './AddPlaceHolderUser';

export default compose(
  connect((state: ReduxState) => ({
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(AddPlaceHolderUser) as React.ComponentType<any>;
