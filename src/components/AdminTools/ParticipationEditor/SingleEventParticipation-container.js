import { connect } from 'react-redux';
import { compose } from 'redux';
import { chooseParticipant } from '../../../actions/adminActions';

import SingleEventParticipation from './SingleEventParticipation';

export default compose(
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    users: state.firebase.ordered.users,
    admin: state.admin,
    settings: state.firebase.data.settings,
  }), dispatch => ({
    chooseParticipant: (eventId, userUID) => dispatch(chooseParticipant(eventId, userUID)),
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(SingleEventParticipation);
