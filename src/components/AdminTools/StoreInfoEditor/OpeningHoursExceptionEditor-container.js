import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import OpeningHoursExceptionEditor from './OpeningHoursExceptionEditor';

export default compose(
  firebaseConnect([
    { path: '/openinghoursexceptions' },
  ]),
  connect(state => ({
    settings: state.firebase.data.settings,
    openinghoursexceptions: state.firebase.data.openinghoursexceptions,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(OpeningHoursExceptionEditor);
