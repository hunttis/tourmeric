import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import EventCard from './EventCard';

export default compose(
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userId: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(withRouter(EventCard));
