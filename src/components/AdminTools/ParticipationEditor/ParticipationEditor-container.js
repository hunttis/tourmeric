import { connect } from 'react-redux';
import { compose } from 'redux';

import { firebaseConnect } from 'react-redux-firebase';
import ParticipationEditor from './ParticipationEditor';
import { chooseParticipant } from '../../../actions/adminActions';

export default compose(
  firebaseConnect([
    { path: '/users', queryParams: ['orderByChild=displayName'] },
  ]),
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
)(ParticipationEditor);
