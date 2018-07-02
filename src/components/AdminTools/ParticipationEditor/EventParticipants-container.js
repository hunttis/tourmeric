import { connect } from 'react-redux';
import { compose } from 'redux';

import EventParticipants from './EventParticipants';

export default compose(
  connect(state => ({
    categories: state.firebase.data.categories,
    participations: state.firebase.data.participations,
    events: state.firebase.data.events,
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(EventParticipants);
