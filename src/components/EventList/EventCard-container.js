import { connect } from 'react-redux';
import { compose } from 'redux';
import EventCard from './EventCard';

export default compose(
  connect(state => ({
    events: state.firebase.ordered.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
  })),
  connect(({ firebase: { profile } }) => ({ profile })),
)(EventCard);
