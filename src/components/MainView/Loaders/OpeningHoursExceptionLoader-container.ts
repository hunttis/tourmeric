import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { OpeningHoursExceptionLoader } from './OpeningHoursExceptionLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/openinghoursexceptions' },
  ]),
  connect((state: ReduxState) => ({
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(OpeningHoursExceptionLoader) as React.ComponentType<any>;
