import { connect } from 'react-redux';
import { compose } from 'redux';
import { withFirebase, firebaseConnect } from 'react-redux-firebase';

import UserInfo from './UserInfo';
import { ReduxState, FirebaseObject } from '~/models/ReduxState';

export default compose(
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),

  firebaseConnect(({ auth }: FirebaseObject) => [
    { path: `/storecredit/${auth.uid}` },
  ]),
  withFirebase,
  connect((state: ReduxState) => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    storecredit: state.firebase.data.storecredit,
  })),
)(UserInfo) as React.ComponentType<any>;
