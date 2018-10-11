import { connect } from 'react-redux';
import { compose } from 'redux';
import { SingleEvent } from './SingleEvent';

export default compose(
  connect(state => ({
    events: state.firebase.data.events,
    participations: state.firebase.data.participations,
    categories: state.firebase.data.categories,
    userid: state.firebase.auth.uid,
    settings: state.firebase.data.settings,
    languages: state.locale.languages,
  })),
  connect(({ firebase: { auth, profile } }) => ({ auth, profile })),
)(SingleEvent);
