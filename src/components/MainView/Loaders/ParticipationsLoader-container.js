import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { ParticipationsLoader } from './ParticipationsLoader';

export default compose(
  firebaseConnect([
    { path: '/participations' },
  ]),
  connect(state => ({
    participations: state.firebase.data.participations,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(ParticipationsLoader);
