import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { EventLoader } from './EventLoader';
import { ReduxState } from '../../../models/ReduxState';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
    { path: '/eventsongoing', queryParams: ['orderByChild=date'] },
  ]),
  connect((state: ReduxState) => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EventLoader) as React.ComponentType<any>;
