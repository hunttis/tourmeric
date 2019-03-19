import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { EventLoader } from './EventLoader';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
    { path: '/eventsongoing', queryParams: ['orderByChild=date'] },
  ]),
  connect(state => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EventLoader);
