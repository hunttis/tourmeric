import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { ParticipationsLoader } from './ParticipationsLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/participations' },
  ]),
  connect((state: ReduxState) => ({
    participations: state.firebase.data.participations,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(ParticipationsLoader) as React.ComponentType<any>;
