import _ from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { setReturnLocation } from '../../../actions/eventEditorActions';
import EventCard from './EventCard';

export default compose(
  connect(state => ({
    events: state.firebase.data.events,
    eventsongoing: state.firebase.data.eventsongoing,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userId: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
    isAdmin: _.get(state, 'firebase.profile.role', 'user') === 'admin',
  }), dispatch => ({
    setReturnLocation: returnLocation => dispatch(setReturnLocation(returnLocation)),
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(withRouter(EventCard));
