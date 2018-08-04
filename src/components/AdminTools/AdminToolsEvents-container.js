import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';

import AdminToolsEvents from './AdminToolsEvents';

export default compose(
  firebaseConnect([
    { path: '/events', queryParams: ['orderByChild=date'] },
    { path: '/categories' },
    { path: '/participations' },
    { path: '/storecredit' },
  ]),
  connect(state => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(AdminToolsEvents);
