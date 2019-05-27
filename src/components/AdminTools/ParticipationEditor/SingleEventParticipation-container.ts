import { connect } from 'react-redux';
import { compose } from 'redux';
import { chooseParticipant } from '../../../actions/adminActions';

import SingleEventParticipation from './SingleEventParticipation';
import { ReduxState } from '~/models/ReduxState';

export default compose(
  connect((state: ReduxState) => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    users: state.firebase.ordered.users,
    admin: state.admin,
    settings: state.firebase.data.settings,
    chooseParticipant: (eventId: string, userUID: string) => chooseParticipant(eventId, userUID),
  })),
  connect(({ firebase: { auth, profile } }: ReduxState) => ({ auth, profile })),
)(SingleEventParticipation) as React.ComponentType<any>;
