import { connect } from 'react-redux';
import { compose } from 'redux';

import EventParticipation from './EventParticipation';

export default compose(
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
  connect(state => ({
    events: state.firebase.data.events,
    settings: state.firebase.data.settings,
  })),
)(EventParticipation);
