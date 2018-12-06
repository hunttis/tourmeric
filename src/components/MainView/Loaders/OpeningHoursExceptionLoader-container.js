import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { OpeningHoursExceptionLoader } from './OpeningHoursExceptionLoader';

export default compose(
  firebaseConnect([
    { path: '/openinghoursexceptions' },
  ]),
  connect(state => ({
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(OpeningHoursExceptionLoader);
