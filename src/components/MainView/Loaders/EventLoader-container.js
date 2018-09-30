import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';

import { EventLoader } from './EventLoader';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
  ]),
  connect(state => ({
    events: state.firebase.data.events,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EventLoader);
