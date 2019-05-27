import { connect } from 'react-redux';
import { compose } from 'redux';

import EventParticipants from './EventParticipants';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    categories: state.firebase.data.categories,
    participations: state.firebase.data.participations,
    events: state.firebase.data.events,
    users: state.firebase.data.users,
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(EventParticipants) as React.ComponentType<any>;
