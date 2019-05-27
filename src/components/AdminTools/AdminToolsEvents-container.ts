import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import { firebaseConnect } from 'react-redux-firebase';

import AdminToolsEvents from './AdminToolsEvents';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/storecredit' },
  ]),
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    location: state.router.location,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(withRouter<any>(AdminToolsEvents)) as React.ComponentType<any>;
